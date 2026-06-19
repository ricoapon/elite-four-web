import {normalizeSpotifySearchInput} from './spotify-search-text';
import type {SpotifyMatchResult, Track} from './spotify-search-types';
import {scoreSpotifyTrackCandidates} from './spotify-track-matcher';

export function itAutoMatches(searchInput: string, expectedTrackId: string, tracks: Track[]): void {
  it(`auto-matches ${searchInput}`, () => {
    const result = score(searchInput, tracks);

    expect(result.autoMatch?.track.id).toEqual(expectedTrackId);
  });
}

export function itDoesNotAutoMatch(searchInput: string, tracks: Track[]): void {
  it(`does not auto-match ${searchInput}`, () => {
    const result = score(searchInput, tracks);

    expect(result.autoMatch).toBeUndefined();
  });
}

export function score(searchInput: string, tracks: Track[]): SpotifyMatchResult {
  const normalizedInput = normalizeSpotifySearchInput(searchInput);
  return scoreSpotifyTrackCandidates(tracks, normalizedInput);
}

export function track(name: string, artists: string | string[], id: string): Track {
  return {
    name,
    artists: Array.isArray(artists) ? artists : [artists],
    id,
    externalUrl: '',
  };
}
