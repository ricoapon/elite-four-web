import {HttpClient, HttpParams} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {SpotifyAuthenticationState} from '../spotify-authentication-state';
import type {Track} from './spotify-search-types';

const SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search';
const SPOTIFY_SEARCH_LIMIT = 10;

/**
 * This class is purely responsible for calling the Spotify API.
 */
export class SpotifySearchClient {
  constructor(private spotifyAuthenticationState: SpotifyAuthenticationState, private httpClient: HttpClient) {}

  async searchTracks(normalizedInput: string): Promise<Track[]> {
    const paramsString = new HttpParams({
      fromObject: {
        type: 'track',
        limit: String(SPOTIFY_SEARCH_LIMIT),
        q: normalizedInput,
      }
    }).toString();

    const response = await firstValueFrom(
      this.executeGetRequest(SPOTIFY_SEARCH_URL + '?' + paramsString)
    );
    return parseSpotifySearchResponse(response);
  }

  private executeGetRequest(url: string): Observable<any> {
    return this.httpClient.get(url, {
      headers: this.spotifyAuthenticationState.getAuthenticationHeader()
    });
  }
}

function parseSpotifySearchResponse(response: any): Track[] {
  if (!Array.isArray(response?.tracks?.items)) {
    return [];
  }

  const tracks: Track[] = [];
  for (const track of response.tracks.items) {
    const name = track.name;
    const artists = Array.isArray(track.artists) ? track.artists.map(artist => artist.name) : [];
    const id = track.id;
    const externalUrl = track.external_urls?.spotify;
    if (
      typeof name !== 'string' ||
      typeof id !== 'string' ||
      typeof externalUrl !== 'string' ||
      artists.some((artist) => typeof artist !== 'string')
    ) {
      continue;
    }

    tracks.push({
      name,
      artists,
      id,
      externalUrl
    });
  }
  return tracks;
}
