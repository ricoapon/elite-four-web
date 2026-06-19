import {itAutoMatches, itDoesNotAutoMatch, score, track} from './spotify-track-matcher-spec-helper';

describe('SpotifyTrackMatcher#scoreSpotifyTrackCandidates', () => {
  itAutoMatches('Billy Talent - Fallen Leaves', 'correct', [
    track('Fallen Leaves', 'Billy Talent', 'correct'),
    track('Fallen Leaves - Live', 'Billy Talent', 'incorrect1'),
    track('Fallen Leaves - Radio Edit', 'Billy Talent', 'incorrect2')
  ]);

  itAutoMatches('Fallen Leaves - Billy Talent', 'correct', [
    track('Fallen Leaves', 'Billy Talent', 'correct'),
    track('Billy Talent', 'Someone Else', 'incorrect')
  ]);

  itAutoMatches('Sexion d\u2019Assaut \u2013 Desole', 'correct', [
    track('D\u00e9sol\u00e9', 'Sexion d\u2019Assaut', 'correct'),
    track('Desole', 'Sexion d\'Assaut', 'incorrect1')
  ]);

  it('returns no candidates when Spotify returned no tracks', () => {
    const result = score('Billy Talent - Fallen Leaves', []);

    expect(result.candidates).toEqual([]);
    expect(result.autoMatch).toBeUndefined();
  });

  it('filters duplicate candidates with the same normalized title and artists', () => {
    const result = score('Billy Talent - Fallen Leaves', [
      track('Fallen Leaves', 'Billy Talent', 'first'),
      track('fallen leaves', 'BILLY TALENT', 'second')
    ]);

    expect(result.candidates.map((candidate) => candidate.track.id)).toEqual(['first']);
  });

  it('auto-matches duplicate-only results that would otherwise need review', () => {
    const singleResult = score('Deep Purple - Child in Time', [
      track('Child in Time - 1995 Remaster', 'Deep Purple', 'single')
    ]);
    const duplicateResult = score('Deep Purple - Child in Time', [
      track('Child in Time - 1995 Remaster', 'Deep Purple', 'first'),
      track('Child in Time - 1995 Remaster', 'Deep Purple', 'second')
    ]);

    expect(singleResult.autoMatch).toBeUndefined();
    expect(duplicateResult.candidates.map((candidate) => candidate.track.id)).toEqual(['first']);
    expect(duplicateResult.autoMatch?.track.id).toEqual('first');
  });

  itDoesNotAutoMatch('Krystal Harris - Super Girl', [
    track('Super Girl', 'Reamonn', 'incorrect-title-only'),
    track('Goodbye', 'Krystal Harris', 'incorrect-artist-only')
  ]);

  itAutoMatches('Fallen Leaves Billy Talent', 'correct', [
    track('Fallen Leaves', 'Billy Talent', 'correct'),
    track('Fallen Leaves Billy Talent', 'Someone Else', 'incorrect-title-only')
  ]);
});
