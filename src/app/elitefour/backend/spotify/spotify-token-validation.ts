import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SpotifyAuthenticationState} from './spotify-authentication-state';
import {Observable} from 'rxjs';

// Purpose of this class is to make any call to Spotify to see if the token still works.
@Injectable({providedIn: 'root'})
export class SpotifyTokenValidation {
  static readonly SPOTIFY_USER_URL = 'https://api.spotify.com/v1/me';

  constructor(private spotifyAuthenticationState: SpotifyAuthenticationState, private httpClient: HttpClient) {
  }

  validate() {
    if (!this.spotifyAuthenticationState.isLoggedIn()) {
      return
    }

    this.executeGetRequest(SpotifyTokenValidation.SPOTIFY_USER_URL).subscribe(
      () => {
        // Response was valid.
      },
      (error) => {
        console.log('Token not valid anymore', error);
        this.spotifyAuthenticationState.reset();
      }
    );
  }

  private executeGetRequest(url: string): Observable<any> {
    return this.httpClient.get(url, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.spotifyAuthenticationState.authenticatedInfo.accessToken)
    });
  }
}
