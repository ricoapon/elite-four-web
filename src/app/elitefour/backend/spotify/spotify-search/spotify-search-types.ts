export type Track = {
  name: string,
  artists: string[],
  id: string,
  externalUrl: string,
};

export type SpotifyTrackCandidate = {
  track: Track,
  score: number,
};

export type SpotifyMatchResult = {
  candidates: SpotifyTrackCandidate[],
  autoMatch?: SpotifyTrackCandidate,
};
