import type {Track} from '../../backend/spotify/spotify-search';

export type SpotifyMatcherTestSnippetSelection =
  | {type: 'autoMatch', trackId: string}
  | {type: 'noMatch'};

export function generateSpotifyMatcherTestSnippet(
  searchInput: string,
  tracks: Track[],
  selection: SpotifyMatcherTestSnippetSelection
): string {
  const escapedSearchInput = escapeForSingleQuotedString(searchInput.trim());
  const trackList = createTrackListSnippet(tracks);

  if (selection.type === 'noMatch') {
    return `itDoesNotAutoMatch('${escapedSearchInput}', ${trackList});`;
  }

  const escapedTrackId = escapeForSingleQuotedString(selection.trackId);
  return `itAutoMatches('${escapedSearchInput}', '${escapedTrackId}', ${trackList});`;
}

function createTrackListSnippet(tracks: Track[]): string {
  if (tracks.length === 0) {
    return '[]';
  }

  return [
    '[',
    tracks
      .map((track, index) => `  ${createTrackSnippet(track)}${index === tracks.length - 1 ? '' : ','}`)
      .join('\n'),
    ']'
  ].join('\n');
}

function createTrackSnippet(track: Track): string {
  return `track('${escapeForSingleQuotedString(track.name)}', ${createArtistsSnippet(track.artists)}, '${escapeForSingleQuotedString(track.id)}')`;
}

function createArtistsSnippet(artists: string[]): string {
  if (artists.length === 1) {
    return `'${escapeForSingleQuotedString(artists[0])}'`;
  }

  return '[' + artists
    .map((artist) => '\'' + escapeForSingleQuotedString(artist) + '\'')
    .join(', ') + ']';
}

function escapeForSingleQuotedString(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, '\\\'');
}
