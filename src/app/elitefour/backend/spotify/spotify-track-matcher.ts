import {Track} from './spotify-search';

/**
 * Returns the best matching track or undefined if no track properly matches.
 * @param search The used search input.
 * @param foundTracks The tracks that have been found using the search input.
 */
export function findBestMatchingTrack(search: string, foundTracks: Track[]): Track | undefined {
  // Spotify has already done the hard searching stuff for us. We only need to determine whether
  // the found tracks are actually the input. Checking if the artist and song track occur is
  // a good enough check for this. If the song is on spotify, this will surely match.

  // We can probably just split on spaces and check if each word is contained in one of the outputs.
  const normalizedSearchWords = normalize(search)
    .toLowerCase()
    .split(" ")
    // Some elements of the string are not really words. Characters like '-' are often used as separator.
    .filter(w => {
      return !(w.length == 1 && !w.match("\\w"));
    });
  // Map each track to a long string that contains all the words we would like to find.
  // Note: we combine the artist names and song name in one string and there is no way to differentiate.
  // In practise, it seems that this will not be an issue.
  const normalizedTrackString = foundTracks.map(track => normalize(track.name) + " " + track.artists.map(artist => normalize(artist)).join(" "))
    .map(s => s.toLowerCase())
    // Filter out the same elements that we do for search.
    .map(s => s.split(" ").filter(w => {
      return !(w.length == 1 && !w.match("\\w"));
    }).join(" "));

  // Start with 0.5 as a minimum. If matches do not exceed this, it will not be a matching song.
  let bestMatchingIndex = 0.5;
  let bestMatchingIndexIndex = undefined;

  for (let i = 0; i < normalizedTrackString.length; i++) {
    const trackString = normalizedTrackString[i];
    const matchingIndex = determineMatchingIndex(normalizedSearchWords, trackString);

    // Note that we use ">" instead of ">=". The first occurring songs in the list are most likely to match.
    // So if any equality in matches occur, the first occurring song of those will be returned.
    if (matchingIndex > bestMatchingIndex) {
      bestMatchingIndex = matchingIndex;
      bestMatchingIndexIndex = i;
    }
  }

  // The algorithm struggles with additional words like "radio edit". These occur quite frequently.
  // If we found no match, try again, but ignoring these words. This makes it more likely a match will occur.
  if (bestMatchingIndexIndex == undefined) {
    for (let i = 0; i < normalizedTrackString.length; i++) {
      const trackString = normalizedTrackString[i]
        .replace(' radio edit', '')
      const matchingIndex = determineMatchingIndex(normalizedSearchWords, trackString);

      console.log(matchingIndex, normalizedSearchWords, trackString)

      // Note that we use ">" instead of ">=". The first occurring songs in the list are most likely to match.
      // So if any equality in matches occur, the first occurring song of those will be returned.
      if (matchingIndex > bestMatchingIndex) {
        bestMatchingIndex = matchingIndex;
        bestMatchingIndexIndex = i;
      }
    }
  }

  return foundTracks[bestMatchingIndexIndex];
}

/** Remove strange characters that are annoying to deal with in the matching algorithm. */
function normalize(input: string): string {
  // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
  return input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/** Returns a value that indicates how well the search matches the track. Higher is better */
function determineMatchingIndex(searchWords: string[], trackString: string) {
  let countMatchingWords = 0
  for (let word of searchWords) {
    if (trackString.includes(word)) {
      countMatchingWords++;
    }
  }
  const nrOfWordsInTrackString = trackString.split(" ").length;
  return (countMatchingWords / searchWords.length) +
    ((countMatchingWords - nrOfWordsInTrackString) / nrOfWordsInTrackString);
}
