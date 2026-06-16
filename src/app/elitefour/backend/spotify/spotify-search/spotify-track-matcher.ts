import * as FuseModule from 'fuse.js';
import type {FuseResult, IFuseOptions} from 'fuse.js';
import type {
  SpotifyMatchResult,
  SpotifyTrackCandidate,
  Track
} from './spotify-search-types';
import {tokenizeSpotifyText} from './spotify-search-text';

const FuseConstructor = ((FuseModule as any).default ?? FuseModule) as new <T>(
  list: readonly T[],
  options?: IFuseOptions<T>
) => { search(pattern: string): FuseResult<T>[] };

type TrackSearchDocument = {
  track: Track,
  searchRank: number,
  title: string,
  artistText: string,
  artistTitleText: string,
  titleArtistText: string,
};

type RankedSpotifyTrackCandidate = SpotifyTrackCandidate & {
  spotifySearchRank: number,
  exactTextMatch: boolean,
};

const CLEAR_SCORE = 0.15;
const AUTO_MATCH_GAP = 0.10;

const FUSE_OPTIONS: IFuseOptions<TrackSearchDocument> = {
  includeScore: true,
  ignoreDiacritics: true,
  ignoreLocation: true,
  shouldSort: true,
  threshold: 1,
  keys: [
    {name: 'artistTitleText', weight: 0.40},
    {name: 'titleArtistText', weight: 0.40},
    {name: 'title', weight: 0.15},
    {name: 'artistText', weight: 0.05},
  ]
};

export function scoreSpotifyTrackCandidates(
  foundTracks: Track[],
  searchText: string
): SpotifyMatchResult {
  const normalizedSearchText = normalizeComparable(searchText);
  if (normalizedSearchText.length === 0) {
    return {candidates: []};
  }

  const documents = createTrackSearchDocuments(foundTracks);
  const rankedCandidates = scoreSpotifyQuery(documents, normalizedSearchText).sort(compareCandidates);
  const candidates = rankedCandidates.map(toPublicCandidate);
  return {
    candidates,
    autoMatch: toPublicCandidate(determineAutoMatch(rankedCandidates))
  };
}

function scoreSpotifyQuery(
  documents: TrackSearchDocument[],
  normalizedSearchText: string
): RankedSpotifyTrackCandidate[] {
  if (documents.length === 0) {
    return [];
  }

  const fuse = new FuseConstructor(documents, FUSE_OPTIONS);
  return fuse.search(normalizedSearchText)
    .map((result) => scoreFuseResult(result, normalizedSearchText));
}

function scoreFuseResult(
  result: FuseResult<TrackSearchDocument>,
  normalizedSearchText: string
): RankedSpotifyTrackCandidate {
  const document = result.item;
  const exactTextMatch = isExactSearchTextMatch(document, normalizedSearchText);
  const score = exactTextMatch ? 0 : result.score ?? 1;

  return {
    track: document.track,
    score: roundScore(score),
    spotifySearchRank: document.searchRank,
    exactTextMatch
  };
}

function determineAutoMatch(
  candidates: RankedSpotifyTrackCandidate[]
): RankedSpotifyTrackCandidate | undefined {
  const bestCandidate = candidates[0];
  if (!bestCandidate) {
    return undefined;
  }

  const secondCandidate = candidates.find((candidate) => candidate.track.id !== bestCandidate.track.id);
  const hasClearGap = !secondCandidate || secondCandidate.score - bestCandidate.score >= AUTO_MATCH_GAP;
  if (bestCandidate.exactTextMatch) {
    return bestCandidate;
  }

  if (bestCandidate.score <= CLEAR_SCORE && hasClearGap) {
    return bestCandidate;
  }

  return undefined;
}

function compareCandidates(a: RankedSpotifyTrackCandidate, b: RankedSpotifyTrackCandidate): number {
  if (a.score !== b.score) {
    return a.score - b.score;
  }

  return a.spotifySearchRank - b.spotifySearchRank;
}

function toPublicCandidate(candidate: RankedSpotifyTrackCandidate): SpotifyTrackCandidate;
function toPublicCandidate(candidate: RankedSpotifyTrackCandidate | undefined): SpotifyTrackCandidate | undefined;
function toPublicCandidate(candidate: RankedSpotifyTrackCandidate | undefined): SpotifyTrackCandidate | undefined {
  if (!candidate) {
    return undefined;
  }

  return {
    track: candidate.track,
    score: candidate.score
  };
}

function createTrackSearchDocuments(tracks: Track[]): TrackSearchDocument[] {
  const tracksById = new Map<string, TrackSearchDocument>();
  tracks.forEach((track, index) => {
    if (!tracksById.has(track.id)) {
      const title = normalizeComparable(track.name);
      const artistText = normalizeComparable(track.artists.join(' '));
      tracksById.set(track.id, {
        track,
        searchRank: index,
        title,
        artistText,
        artistTitleText: [artistText, title].filter((value) => value.length > 0).join(' '),
        titleArtistText: [title, artistText].filter((value) => value.length > 0).join(' ')
      });
    }
  });
  return Array.from(tracksById.values());
}

function isExactSearchTextMatch(document: TrackSearchDocument, normalizedSearchText: string): boolean {
  return normalizedSearchText === document.artistTitleText ||
    normalizedSearchText === document.titleArtistText;
}

function normalizeComparable(input: string | undefined): string {
  return tokenizeSpotifyText(input ?? '')
    .filter((token) => !/^\d{4}$/.test(token))
    .join(' ');
}

function roundScore(score: number): number {
  return Math.round(score * 1000) / 1000;
}
