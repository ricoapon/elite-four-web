import type {SpotifyMatchResult, SpotifyTrackCandidate, Track} from './spotify-search-types';
import {tokenizeSpotifyText} from './spotify-search-text';

/**
 * DISCLAIMER: this file is fully generated using AI. I have created a lot of tests to ensure that the output is as expected.
 * This algorithm became complicated with many exceptions for specific words and tweaking of weights. I do not understand it,
 * but it works really well for all the tests. This is the only file that I didn't manually review or tweak.
 */
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'of', 'to', 'in', 'on', 'for', 'with',
  'le', 'la', 'el', 'de', 'di', 'da', 'der', 'het'
]);
const SOFT_TITLE_STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'of', 'to', 'in', 'on', 'for', 'with'
]);
const FEATURE_WORDS = new Set(['feat', 'featuring', 'ft', 'vs']);
const VERSION_WORDS = new Set([
  'live', 'remix', 'remastered', 'remaster', 'edit', 'acoustic',
  'instrumental', 'karaoke', 'backing', 'demo', 'extended', 'version',
  'mix', 'sped', 'slowed', 'pt', 'part', 'bonus', 'tribute', 'popular',
  'symphonic', 'closure', 'continuation', 'single', 'studio', 'sessions',
  'session', 'vocal', 'guide'
]);
const HARD_VERSION_WORDS = new Set([
  'live', 'remix', 'remastered', 'remaster', 'edit', 'acoustic',
  'instrumental', 'karaoke', 'backing', 'demo', 'sped', 'slowed', 'pt',
  'part', 'bonus', 'tribute', 'popular', 'symphonic', 'closure',
  'continuation', 'single', 'studio', 'sessions', 'session', 'vocal',
  'guide'
]);

const MIN_CONFIDENCE = 0.70;
const MIN_TITLE_SCORE = 0.58;
const MIN_ARTIST_SCORE = 0.45;
const MAX_DUPLICATE_AUTO_MATCH_SCORE = 0.80;

export function scoreSpotifyTrackCandidates(
  foundTracks: Track[],
  normalizedSearchText: string
): SpotifyMatchResult {
  if (foundTracks.length === 0) {
    return {
      candidates: [],
      autoMatch: undefined
    };
  }

  const queryTokens = tokensFor(normalizedSearchText);
  const scoredCandidates = foundTracks
    .map((track, index) => scoreTrackCandidate(createTrackSearchDocument(track, index), queryTokens))
    .sort(compareCandidateScores);
  const uniqueScoredCandidates = uniqueSpotifyTrackCandidates(scoredCandidates);

  const candidates = uniqueScoredCandidates.map(toSpotifyTrackCandidate);
  const autoMatch = findAutoMatch(uniqueScoredCandidates) ??
    findDuplicateAutoMatch(scoredCandidates, uniqueScoredCandidates);

  return {
    candidates,
    autoMatch: autoMatch === undefined ? undefined : toSpotifyTrackCandidate(autoMatch)
  };
}

function createTrackSearchDocument(track: Track, index: number): TrackSearchDocument {
  const title = splitTitle(track.name);
  const artistTokenGroups = track.artists.map((artist) => tokensFor(artist));
  const artistSignificantGroups = artistTokenGroups
    .map(significantTokens)
    .filter((tokens) => tokens.length > 0);
  const allArtistTokens = flatten(artistTokenGroups);
  const allArtistSignificant = significantTokens(allArtistTokens);

  return {
    track,
    index,
    title,
    artistSignificantGroups,
    allArtistSignificant
  };
}

function scoreTrackCandidate(
  document: TrackSearchDocument,
  queryTokens: string[]
): InternalCandidateScore {
  const querySignificant = titleSignificantTokens(queryTokens);
  const coreTitleTokens = titleSignificantTokens(document.title.coreTokens)
    .filter((token) => !FEATURE_WORDS.has(token));
  const artist = scoreArtist(document, queryTokens, coreTitleTokens);
  let queryTitleTokens = querySignificant.filter((token) => (
    bestTokenScore(document.allArtistSignificant, token) < 0.72 &&
    !containsCompoundMatch(document.allArtistSignificant, token)
  ));
  if (queryTitleTokens.length === 0) {
    queryTitleTokens = querySignificant;
  }

  const allTitleTokens = titleSignificantTokens(document.title.allTokens)
    .filter((token) => !FEATURE_WORDS.has(token));

  const queryTitleCoverage = coverage(queryTitleTokens, allTitleTokens, true);
  const coreTitleCoverage = coverage(coreTitleTokens, querySignificant, true);
  const exactCoreTitle = coreTitleTokens.length > 0 &&
    coverage(coreTitleTokens, queryTitleTokens, false) >= 0.98 &&
    coverage(queryTitleTokens, coreTitleTokens, false) >= 0.98;

  let titleScore = 0.58 * queryTitleCoverage + 0.42 * coreTitleCoverage;
  if (exactCoreTitle) {
    titleScore = Math.max(titleScore, 1);
  }
  if (queryTitleTokens.length <= 1 && coreTitleTokens.length > queryTitleTokens.length && !exactCoreTitle) {
    titleScore = Math.min(titleScore, 0.56);
  }

  const unmatchedCoreTokens = coreTitleTokens
    .filter((token) => bestTokenScore(querySignificant, token) < 0.72);
  if (unmatchedCoreTokens.length >= 1 && !exactCoreTitle) {
    titleScore -= Math.min(0.22, unmatchedCoreTokens.length * 0.09);
  }
  titleScore = clamp(titleScore);

  const versionPenalty = scoreVersionPenalty(document, querySignificant, queryTitleTokens);
  let confidence = 0.64 * titleScore + 0.36 * artist.score - versionPenalty;
  if (titleScore >= 0.98 && artist.score >= 0.98 && versionPenalty <= 0.02) {
    confidence += 0.04;
  }
  if (titleScore < 0.50 || artist.score < 0.35) {
    confidence -= 0.12;
  }
  confidence = clamp(confidence);

  return {
    track: document.track,
    index: document.index,
    score: 1 - confidence,
    confidence,
    titleScore,
    artistScore: artist.score,
    primaryArtistScore: artist.primaryScore,
    versionPenalty,
    exactCoreTitle,
    coreVersionTokens: unrequestedCoreVersionTokens(document, querySignificant),
    suffixVersionTokens: unrequestedSuffixVersionTokens(document, querySignificant),
    suffixHardVersionTokens: unrequestedSuffixHardVersionTokens(document, querySignificant),
    artistFingerprint: artistFingerprint(document),
    coreTitleFingerprint: coreTitleTokens.join(' '),
    hasFeatureSuffix: document.title.featureTokens.length > 0
  };
}

function scoreArtist(document: TrackSearchDocument, queryTokens: string[], coreTitleTokens: string[]): ArtistScore {
  const querySignificant = significantTokens(queryTokens);
  const groupScores = document.artistSignificantGroups.map((artistTokens, index) => {
    let score = coverage(artistTokens, queryTokens, true);
    const matched = matchedCount(artistTokens, queryTokens, true);
    const compactArtist = compactTokens(artistTokens);
    const compactQuery = compactTokens(queryTokens);

    if (matched >= 2) {
      score = Math.max(score, 0.86);
    }
    if (matched >= 1 && artistTokens.length === 1) {
      score = Math.max(score, 1);
    }
    if (compactArtist.length >= 6 && (compactQuery.includes(compactArtist) || compactArtist.includes(compactQuery))) {
      score = Math.max(score, 0.92);
    }
    if (index > 0 && querySignificant.length <= 2) {
      score = Math.min(score, 0.64);
    }

    return score;
  });

  const primaryScore = groupScores[0] ?? 0;
  const anyScore = groupScores.length === 0 ? 0 : Math.max(...groupScores);
  const allScore = document.allArtistSignificant.length === 0
    ? 0
    : Math.min(
      1,
      matchedCount(document.allArtistSignificant, queryTokens, true) /
        Math.min(document.allArtistSignificant.length, Math.max(1, querySignificant.length))
    );
  const unmatchedGroups = groupScores.filter((score) => score < 0.50).length;
  const extraArtistPenalty = Math.min(
    0.10,
    Math.max(0, unmatchedGroups - (primaryScore < 0.50 ? 1 : 0)) * 0.035
  );
  let score = clamp(Math.max(primaryScore, anyScore * 0.94, allScore) - extraArtistPenalty);

  if (queryTokens.some((token) => FEATURE_WORDS.has(token))) {
    const queryArtistTokens = querySignificant
      .filter((token) => !VERSION_WORDS.has(token))
      .filter((token) => bestTokenScore(coreTitleTokens, token) < 0.72);
    if (queryArtistTokens.length > 1) {
      score = Math.min(score, coverage(queryArtistTokens, document.allArtistSignificant, true));
    }
  }

  return {
    score,
    primaryScore
  };
}

function scoreVersionPenalty(
  document: TrackSearchDocument,
  querySignificant: string[],
  queryTitleTokens: string[]
): number {
  const coreVersionTokens = unrequestedCoreVersionTokens(document, querySignificant);
  const suffixVersionTokens = unrequestedSuffixVersionTokens(document, querySignificant);
  const suffixHardVersionTokens = unrequestedSuffixHardVersionTokens(document, querySignificant);
  const suffixSignificant = titleSignificantTokens(document.title.suffixTokens)
    .filter((token) => !FEATURE_WORDS.has(token));

  let penalty = 0;
  if (coreVersionTokens.length > 0) {
    penalty += 0.10;
  }
  if (suffixVersionTokens.length > 0) {
    penalty += suffixVersionTokens.includes('radio') && suffixVersionTokens.includes('mix') ? 0.07 : 0.08;
  }
  if (suffixHardVersionTokens.length > 0) {
    penalty += 0.12;
  }
  if (suffixSignificant.length > 0 && document.title.featureTokens.length === 0) {
    const suffixMentioned = coverage(suffixSignificant, queryTitleTokens, true) >= 0.50;
    if (!suffixMentioned) {
      penalty += Math.min(0.16, 0.06 + suffixSignificant.length * 0.015);
    }
  }
  if (suffixSignificant.some((token) => /\d/.test(token) && /[a-z]/.test(token))) {
    penalty += 0.10;
  }
  if (hasMaskedPrefix(document.track.name)) {
    penalty += 0.35;
  }

  const artistOverlapInSuffix = suffixSignificant
    .filter((token) => bestTokenScore(document.allArtistSignificant, token) >= 0.82)
    .length;
  if (
    document.title.featureTokens.length === 0 &&
    artistOverlapInSuffix > 0 &&
    suffixSignificant.length > artistOverlapInSuffix
  ) {
    penalty += 0.14;
  }

  return penalty;
}

function findAutoMatch(candidates: InternalCandidateScore[]): InternalCandidateScore | undefined {
  const best = candidates[0];

  if (best === undefined) {
    return undefined;
  }
  if (best.confidence < MIN_CONFIDENCE || best.titleScore < MIN_TITLE_SCORE || best.artistScore < MIN_ARTIST_SCORE) {
    return undefined;
  }
  const tolerableRadioEdit = isTolerableUnrequestedRadioEdit(best, candidates);
  if (isStrongUnrequestedVersion(best) && !tolerableRadioEdit && best.confidence < 0.92) {
    return undefined;
  }
  if (best.versionPenalty >= 0.20 && !tolerableRadioEdit && best.confidence < 0.90) {
    return undefined;
  }

  return best;
}

function findDuplicateAutoMatch(
  allCandidates: InternalCandidateScore[],
  uniqueCandidates: InternalCandidateScore[]
): InternalCandidateScore | undefined {
  if (allCandidates.length <= 1 || uniqueCandidates.length !== 1) {
    return undefined;
  }

  const duplicateCandidate = uniqueCandidates[0];
  if (
    duplicateCandidate.score >= MAX_DUPLICATE_AUTO_MATCH_SCORE ||
    duplicateCandidate.titleScore < MIN_TITLE_SCORE ||
    duplicateCandidate.artistScore < MIN_ARTIST_SCORE
  ) {
    return undefined;
  }

  return duplicateCandidate;
}

function uniqueSpotifyTrackCandidates(candidates: InternalCandidateScore[]): InternalCandidateScore[] {
  const seenFingerprints = new Set<string>();

  return candidates.filter((candidate) => {
    const fingerprint = trackDuplicateFingerprint(candidate.track);
    if (fingerprint === undefined) {
      return true;
    }
    if (seenFingerprints.has(fingerprint)) {
      return false;
    }

    seenFingerprints.add(fingerprint);
    return true;
  });
}

function trackDuplicateFingerprint(track: Track): string | undefined {
  const title = tokensFor(track.name).join(' ');
  const artists = track.artists
    .map((artist) => tokensFor(artist).join(' '))
    .filter((artist) => artist.length > 0)
    .sort();

  if (title.length === 0 || artists.length === 0) {
    return undefined;
  }

  return title + '::' + artists.join('|');
}

function isTolerableUnrequestedRadioEdit(
  candidate: InternalCandidateScore,
  candidates: InternalCandidateScore[]
): boolean {
  if (!isUnrequestedRadioEdit(candidate) || !candidate.exactCoreTitle || candidate.artistScore < 0.98) {
    return false;
  }

  const indistinguishableRadioEditCount = candidates
    .filter((otherCandidate) => (
      otherCandidate.coreTitleFingerprint === candidate.coreTitleFingerprint &&
      otherCandidate.artistFingerprint === candidate.artistFingerprint &&
      isUnrequestedRadioEdit(otherCandidate)
    ))
    .length;

  return indistinguishableRadioEditCount === 1;
}

function isUnrequestedRadioEdit(candidate: InternalCandidateScore): boolean {
  return candidate.coreVersionTokens.length === 0 &&
    candidate.suffixVersionTokens.length === 2 &&
    candidate.suffixVersionTokens.includes('radio') &&
    candidate.suffixVersionTokens.includes('edit') &&
    candidate.suffixHardVersionTokens.length === 1 &&
    candidate.suffixHardVersionTokens.includes('edit');
}

function isStrongUnrequestedVersion(candidate: InternalCandidateScore): boolean {
  if (
    candidate.suffixVersionTokens.includes('radio') &&
    candidate.suffixVersionTokens.includes('mix') &&
    candidate.suffixVersionTokens.length <= 2 &&
    candidate.suffixHardVersionTokens.length === 0 &&
    candidate.coreVersionTokens.length === 0
  ) {
    return false;
  }

  if (candidate.suffixHardVersionTokens.length > 0 || candidate.coreVersionTokens.length > 0) {
    return true;
  }

  return candidate.suffixVersionTokens.some((token) => token !== 'radio');
}

function compareCandidateScores(a: InternalCandidateScore, b: InternalCandidateScore): number {
  const confidenceDiff = b.confidence - a.confidence;
  if (Math.abs(confidenceDiff) > 0.02) {
    return confidenceDiff;
  }

  const primaryArtistDiff = b.primaryArtistScore - a.primaryArtistScore;
  if (Math.abs(primaryArtistDiff) > 0.02) {
    return primaryArtistDiff;
  }

  const versionPenaltyDiff = a.versionPenalty - b.versionPenalty;
  if (Math.abs(versionPenaltyDiff) > 0.02) {
    return versionPenaltyDiff;
  }

  return a.index - b.index;
}

function toSpotifyTrackCandidate(candidate: InternalCandidateScore): SpotifyTrackCandidate {
  return {
    track: candidate.track,
    score: candidate.score
  };
}

function splitTitle(title: string): TitleParts {
  const segments = title
    .replace(/[\[\]()]/g, '|')
    .replace(/\s+[-\u2010-\u2015]\s+/g, '|')
    .replace(/,\s+/g, '|')
    .split('|')
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
  const coreText = segments[0] ?? title;
  const suffixText = segments.slice(1).join(' ');
  const allTokens = tokensFor(title);
  const coreTokens = tokensFor(coreText);
  const suffixTokens = tokensFor(suffixText);

  return {
    allTokens,
    coreTokens,
    suffixTokens,
    coreVersionTokens: titleSignificantTokens(coreTokens)
      .filter((token) => VERSION_WORDS.has(token)),
    suffixVersionTokens: titleSignificantTokens(suffixTokens)
      .filter((token) => VERSION_WORDS.has(token) || token === 'radio'),
    suffixHardVersionTokens: titleSignificantTokens(suffixTokens)
      .filter((token) => HARD_VERSION_WORDS.has(token)),
    featureTokens: suffixTokens.filter((token) => FEATURE_WORDS.has(token))
  };
}

function unrequestedCoreVersionTokens(document: TrackSearchDocument, querySignificant: string[]): string[] {
  return document.title.coreVersionTokens
    .filter((token) => !querySignificant.includes(token));
}

function unrequestedSuffixVersionTokens(document: TrackSearchDocument, querySignificant: string[]): string[] {
  return document.title.suffixVersionTokens
    .filter((token) => !querySignificant.includes(token));
}

function unrequestedSuffixHardVersionTokens(document: TrackSearchDocument, querySignificant: string[]): string[] {
  const tokens = document.title.suffixHardVersionTokens
    .filter((token) => !querySignificant.includes(token));
  if (
    document.title.suffixVersionTokens.includes('mix') &&
    !document.title.suffixVersionTokens.includes('radio') &&
    !querySignificant.includes('mix') &&
    !tokens.includes('mix')
  ) {
    return tokens.concat('mix');
  }

  return tokens;
}

function coverage(needles: string[], haystack: string[], loose: boolean): number {
  if (needles.length === 0) {
    return 0;
  }

  const threshold = loose ? 0.72 : 0.82;
  return needles
    .map((needle) => bestTokenScore(haystack, needle))
    .map((score) => score >= threshold ? score : 0)
    .reduce((sum, score) => sum + score, 0) / needles.length;
}

function matchedCount(needles: string[], haystack: string[], loose: boolean): number {
  const threshold = loose ? 0.72 : 0.82;
  return needles
    .filter((needle) => bestTokenScore(haystack, needle) >= threshold || containsCompoundMatch(haystack, needle))
    .length;
}

function bestTokenScore(haystack: string[], token: string): number {
  const bestScore = haystack
    .map((candidate) => tokenSimilarity(candidate, token))
    .reduce((best, score) => Math.max(best, score), 0);
  if (bestScore < 0.88 && containsCompoundMatch(haystack, token)) {
    return 0.92;
  }

  return bestScore;
}

function containsCompoundMatch(haystack: string[], token: string): boolean {
  if (token.length < 6) {
    return false;
  }

  const significant = significantTokens(haystack);
  for (let start = 0; start < significant.length; start++) {
    let joined = '';
    for (let end = start; end < Math.min(significant.length, start + 4); end++) {
      joined += significant[end];
      if (joined === token || tokenSimilarity(joined, token) >= 0.88) {
        return true;
      }
    }
  }

  return false;
}

function tokenSimilarity(a: string, b: string): number {
  if (a === b) {
    return 1;
  }
  if (a.length <= 1 || b.length <= 1) {
    return 0;
  }
  if (a.length >= 4 && b.length >= 4) {
    const distance = levenshteinDistance(a, b);
    if (distance === 1) {
      return 0.90;
    }
    if (distance === 2 && Math.max(a.length, b.length) >= 7) {
      return 0.76;
    }
  }
  if (a.length >= 4 && b.length >= 4 && (a.includes(b) || b.includes(a))) {
    return 0.72;
  }

  return 0;
}

function levenshteinDistance(a: string, b: string): number {
  const previous = Array.from({length: b.length + 1}, (_, index) => index);
  const current = Array(b.length + 1).fill(0);

  for (let i = 1; i <= a.length; i++) {
    current[0] = i;
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    for (let j = 0; j <= b.length; j++) {
      previous[j] = current[j];
    }
  }

  return previous[b.length];
}

function tokensFor(text: string): string[] {
  const tokenized = tokenizeSpotifyText(text);
  return tokenized.length === 0 ? [] : tokenized.split(' ');
}

function significantTokens(tokens: string[]): string[] {
  return tokens
    .filter((token) => !STOP_WORDS.has(token))
    .filter((token) => !FEATURE_WORDS.has(token));
}

function titleSignificantTokens(tokens: string[]): string[] {
  return tokens
    .filter((token) => !SOFT_TITLE_STOP_WORDS.has(token))
    .filter((token) => !FEATURE_WORDS.has(token));
}

function compactTokens(tokens: string[]): string {
  return significantTokens(tokens).join('');
}

function artistFingerprint(document: TrackSearchDocument): string {
  return document.allArtistSignificant.slice().sort().join(' ');
}

function hasMaskedPrefix(title: string): boolean {
  return /^\s*[^a-zA-Z0-9\s]{2,}\s+/.test(title);
}

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function flatten<T>(arrays: T[][]): T[] {
  return ([] as T[]).concat(...arrays);
}

type TrackSearchDocument = {
  track: Track,
  index: number,
  title: TitleParts,
  artistSignificantGroups: string[][],
  allArtistSignificant: string[],
};

type TitleParts = {
  allTokens: string[],
  coreTokens: string[],
  suffixTokens: string[],
  coreVersionTokens: string[],
  suffixVersionTokens: string[],
  suffixHardVersionTokens: string[],
  featureTokens: string[],
};

type ArtistScore = {
  score: number,
  primaryScore: number,
};

type InternalCandidateScore = SpotifyTrackCandidate & {
  index: number,
  confidence: number,
  titleScore: number,
  artistScore: number,
  primaryArtistScore: number,
  versionPenalty: number,
  exactCoreTitle: boolean,
  coreVersionTokens: string[],
  suffixVersionTokens: string[],
  suffixHardVersionTokens: string[],
  artistFingerprint: string,
  coreTitleFingerprint: string,
  hasFeatureSuffix: boolean,
};
