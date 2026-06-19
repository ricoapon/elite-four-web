import {SpotifyTrackReference} from '../favorite-list-interfaces';

export const SPOTIFY_TRACK_URL_REGEXP = new RegExp('https:\\/\\/open\\.spotify\\.com\\/track\\/(\\w+)');

export function parseSpotifyTrackUrl(url: string): SpotifyTrackReference | undefined {
  const match = SPOTIFY_TRACK_URL_REGEXP.exec(url.trim());
  if (!match) {
    return undefined;
  }

  return {
    id: match[1],
    externalUrl: url.trim()
  };
}
