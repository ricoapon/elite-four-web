import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SpotifyAuthenticationState} from './spotify-authentication-state';

export type Track = {
  name: string,
  artists: string[],
  id: string,
  externalUrl: string,
};

@Injectable({providedIn: 'root'})
export class SpotifySearch {
  static readonly SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search';

  constructor(private spotifyAuthenticationState: SpotifyAuthenticationState, private httpClient: HttpClient) {}

  searchTracks(searchInput: string): Promise<Track[]> {
    const paramsString = new HttpParams({
      fromObject: {
        type: 'track',
        // We expect the search input to be complete, so we will only need a few results.
        limit: '3',
        q: searchInput,
      }
    }).toString();

    return new Promise((resolve, fatal) => {
      this.executeGetRequest(SpotifySearch.SPOTIFY_SEARCH_URL + '?' + paramsString).subscribe(
        (response) => {
          resolve(this.parseResponse(response));
        },
        (error) => {
          fatal(error);
        }
      );
    });
  }

  private executeGetRequest(url: string): Observable<any> {
    return this.httpClient.get(url, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.spotifyAuthenticationState.authenticatedInfo.accessToken)
    });
  }

  private parseResponse(response: any): Track[] {
    const tracks: Track[] = [];
    for (const track of response.tracks.items) {
      const name = track.name;
      const artists = track.artists.map(artist => artist.name)
      const id = track.id;
      const externalUrl = track.external_urls.spotify;
      tracks.push({name, artists, id, externalUrl});
    }
    return tracks;
  }
}
