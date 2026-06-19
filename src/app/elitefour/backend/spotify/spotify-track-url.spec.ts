import {parseSpotifyTrackUrl} from './spotify-track-url';

describe('parseSpotifyTrackUrl', () => {
  it('parses a Spotify track URL', () => {
    const result = parseSpotifyTrackUrl('https://open.spotify.com/track/6zyrb7dW1IR4Hrc8nXJsln?si=abc');

    expect(result).toEqual({
      id: '6zyrb7dW1IR4Hrc8nXJsln',
      externalUrl: 'https://open.spotify.com/track/6zyrb7dW1IR4Hrc8nXJsln?si=abc'
    });
  });

  it('returns undefined for non-track URLs', () => {
    expect(parseSpotifyTrackUrl('https://open.spotify.com/album/album-id')).toBeUndefined();
  });
});
