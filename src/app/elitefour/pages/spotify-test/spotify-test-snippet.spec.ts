import type {Track} from '../../backend/spotify/spotify-search';
import {generateSpotifyMatcherTestSnippet} from './spotify-test-snippet';

describe('SpotifySearchDebug test snippet generation', () => {
  it('generates an auto-match helper call', () => {
    const snippet = generateSpotifyMatcherTestSnippet('Billy Talent - Fallen Leaves', [
      spotifyTrack('Fallen Leaves', ['Billy Talent'], 'correct')
    ], {type: 'autoMatch', trackId: 'correct'});

    expect(snippet).toEqual([
      `itAutoMatches('Billy Talent - Fallen Leaves', 'correct', [`,
      `  track('Fallen Leaves', 'Billy Talent', 'correct')`,
      `]);`
    ].join('\n'));
  });

  it('generates a no-auto-match helper call', () => {
    const snippet = generateSpotifyMatcherTestSnippet('Krystal Harris - Super Girl', [
      spotifyTrack('Super Girl', ['Reamonn'], 'incorrect-title-only'),
      spotifyTrack('Goodbye', ['Krystal Harris'], 'incorrect-artist-only')
    ], {type: 'noMatch'});

    expect(snippet).toEqual([
      `itDoesNotAutoMatch('Krystal Harris - Super Girl', [`,
      `  track('Super Girl', 'Reamonn', 'incorrect-title-only'),`,
      `  track('Goodbye', 'Krystal Harris', 'incorrect-artist-only')`,
      `]);`
    ].join('\n'));
  });

  it('escapes quotes and backslashes', () => {
    const snippet = generateSpotifyMatcherTestSnippet('Artist\\Name - Don\'t Stop', [
      spotifyTrack('Don\'t \\ Stop', ['Artist\'s \\ Name'], 'id\'\\')
    ], {type: 'autoMatch', trackId: 'id\'\\'});

    expect(snippet).toContain('Artist\\\\Name');
    expect(snippet).toContain('Don\\\'t');
    expect(snippet).toContain('\\\\ Stop');
    expect(snippet).toContain('Artist\\\'s \\\\ Name');
    expect(snippet).toContain('id\\\'\\\\');
  });

  it('generates an artist array for tracks with multiple artists', () => {
    const snippet = generateSpotifyMatcherTestSnippet('Artist One Artist Two Duet', [
      spotifyTrack('Duet', ['Artist One', 'Artist Two'], 'duet-id')
    ], {type: 'autoMatch', trackId: 'duet-id'});

    expect(snippet).toContain(`track('Duet', ['Artist One', 'Artist Two'], 'duet-id')`);
  });
});

function spotifyTrack(name: string, artists: string[], id: string): Track {
  return {
    name,
    artists,
    id,
    externalUrl: '',
  };
}
