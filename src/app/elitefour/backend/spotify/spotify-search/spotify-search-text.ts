export function normalizeSpotifySearchInput(searchInput: string): string {
  return normalizeSpotifyText(searchInput)
    .replace(/-/g, ' ')
    .replace(/[()]/g, ' ')
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 0)
    .filter((word) => !(word.length === 1 && !/\w/.test(word)))
    .join(' ');
}

function normalizeSpotifyText(input: string): string {
  return input
    .replace(/\u00e2\u20ac[\u201c\u201d]/g, '-')
    .replace(/\u00e2\u20ac\u2122/g, '\'')
    .replace(/[\u2010-\u2015]/g, '-')
    .replace(/[\u2018\u2019]/g, '\'')
    .replace(/[\u201c\u201d]/g, '"')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function tokenizeSpotifyText(input: string): string[] {
  return normalizeSpotifyText(input)
    .replace(/&/g, ' and ')
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .map((word) => word.trim())
    .filter((word) => word.length > 0);
}
