import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SpotifyAuthenticationState} from './spotify-authentication-state';
import {SpotifySearchClient} from './spotify-search/spotify-search-client';
import {normalizeSpotifySearchInput} from './spotify-search/spotify-search-text';
import type {SpotifyMatchResult, Track} from './spotify-search/spotify-search-types';
import {scoreSpotifyTrackCandidates} from './spotify-search/spotify-track-matcher';

export type {SpotifyMatchResult, SpotifyTrackCandidate, Track} from './spotify-search/spotify-search-types';

const MIN_SPOTIFY_SEARCH_INPUT_LENGTH = 3;

/**
 * This class is responsible for finding the right Spotify tracks when searching based on user input. The search API
 * does not always return the best results, depending on weird characters in the input or even the ordering of artist
 * and title. This class is a Facade and uses files that are located in the `spotify-search` directory.
 *
 * The method `searchTrack` works as follows:
 * 1. Clean the search input into normalized text.
 * 2. Execute the Spotify search and collect the found tracks.
 * 3. Use fuzzy text matching to determine a score for each of the resulted tracks (0 is perfect match, 1 is terrible).
 * 4. If there is a track with a score below a threshold, return this as the best matching track.
 */
@Injectable({providedIn: 'root'})
export class SpotifySearch {
  private readonly spotifySearchClient: SpotifySearchClient;

  constructor(spotifyAuthenticationState: SpotifyAuthenticationState, httpClient: HttpClient) {
    this.spotifySearchClient = new SpotifySearchClient(spotifyAuthenticationState, httpClient);
  }

  async searchTrack(searchInput: string): Promise<Track | undefined> {
    const result = await this.searchTrackCandidates(searchInput);
    return result.autoMatch?.track;
  }

  async searchTrackCandidates(searchInput: string): Promise<SpotifyMatchResult> {
    const normalizedInput = normalizeSpotifySearchInput(searchInput);
    // If the text is too short, it is probably an invalid search.
    if (normalizedInput.length < MIN_SPOTIFY_SEARCH_INPUT_LENGTH) {
      return {candidates: []};
    }

    const tracks = await this.spotifySearchClient.searchTracks(normalizedInput);
    return scoreSpotifyTrackCandidates(tracks, normalizedInput);
  }
}
