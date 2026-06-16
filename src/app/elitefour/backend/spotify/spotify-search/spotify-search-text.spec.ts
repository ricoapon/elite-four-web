import {normalizeSpotifySearchInput} from './spotify-search-text';

describe('SpotifySearchText#normalizeSpotifySearchInput', () => {
  it('normalizes plain input', () => {
    // When
    const normalizedInput = normalizeSpotifySearchInput('Billy Talent Fallen Leaves');

    // Then
    expect(normalizedInput).toEqual('billy talent fallen leaves');
  });

  it('turns one dash into plain text', () => {
    // When
    const normalizedInput = normalizeSpotifySearchInput('Billy Talent - Fallen Leaves');

    // Then
    expect(normalizedInput).toEqual('billy talent fallen leaves');
  });

  it('normalizes en dash and extra spaces', () => {
    // When
    const normalizedInput = normalizeSpotifySearchInput('  Sexion d\u2019Assaut   \u2013   Desole  ');

    // Then
    expect(normalizedInput).toEqual('sexion d\'assaut desole');
  });

  it('normalizes multiple dashes', () => {
    // When
    const normalizedInput = normalizeSpotifySearchInput('Artist - Title - Live');

    // Then
    expect(normalizedInput).toEqual('artist title live');
  });

  it('returns an empty string for empty input', () => {
    // When
    const normalizedInput = normalizeSpotifySearchInput('   ');

    // Then
    expect(normalizedInput).toEqual('');
  });
});
