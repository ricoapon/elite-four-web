import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SpotifyAuthenticationState} from './spotify-authentication-state';
import {findBestMatchingTrack} from './spotify-track-matcher';

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

  searchTrack(searchInput: string): Promise<Track | undefined> {
    // The search input can be anything. Some characters are difficult. We filter those out.
    const cleanSearchInput = searchInput
      .split(" ")
      // Some elements of the string are not really words. Characters like '-' are often used as separator.
      .filter(w => {
        return !(w.length == 1 && !w.match("\\w"));
      })
      .join(" ")
      .replace('(', '')
      .replace(')', '')
      .replace('’', "'")
      .replace('–', "-")

    const paramsString = new HttpParams({
      fromObject: {
        type: 'track',
        // We expect the search input to be complete, so we will only need a few results.
        limit: '3',
        q: cleanSearchInput,
      }
    }).toString();

    return new Promise((resolve, fatal) => {
      this.executeGetRequest(SpotifySearch.SPOTIFY_SEARCH_URL + '?' + paramsString).subscribe(
        (response) => {
          const tracks = this.parseResponse(response);
          const track = findBestMatchingTrack(cleanSearchInput, tracks);
          resolve(track);
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
