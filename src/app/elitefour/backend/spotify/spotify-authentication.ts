import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import * as CryptoJS from 'crypto-js';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {SpotifyAuthenticationState} from './spotify-authentication-state';

type InfoBefore = {
  state: string,
  codeVerifier: string,
  url: string,
}

@Injectable({providedIn: 'root'})
export class SpotifyAuthentication {
  static readonly LOCALSTORAGE_KEY = 'spotify-info-before';
  static readonly SPOTIFY_BASE_URL = 'https://accounts.spotify.com/';
  static readonly CLIENT_ID = '9f119ae07667426ba566161b900a7c06';
  static readonly APP_REDIRECT_BACK_URL = environment.app_base_url + 'spotify-callback';

  infoBefore: InfoBefore = undefined;

  constructor(private httpClient: HttpClient, private spotifyAuthenticationState: SpotifyAuthenticationState) {
    const value = localStorage.getItem(SpotifyAuthentication.LOCALSTORAGE_KEY);
    if (value != null) {
      this.infoBefore = JSON.parse(value);
    }
  }

  redirectToSpotify(currentRelativeUrl: string): void {
    const state = this.generateRandomString(20);
    const codeVerifier = this.generateRandomString(128);
    this.infoBefore = {state, codeVerifier, url: currentRelativeUrl};
    localStorage.setItem(SpotifyAuthentication.LOCALSTORAGE_KEY, JSON.stringify(this.infoBefore));

    const codeVerifierHash = CryptoJS.SHA256(codeVerifier).toString(CryptoJS.enc.Base64);
    const codeChallenge = codeVerifierHash
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    const paramsString = new HttpParams({
      fromObject: {
        client_id: SpotifyAuthentication.CLIENT_ID,
        response_type: 'code',
        redirect_uri: SpotifyAuthentication.APP_REDIRECT_BACK_URL,
        state,
        scope: 'playlist-modify-private',
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
      }
    }).toString();

    // Go to the actual URL.
    window.location.href = SpotifyAuthentication.SPOTIFY_BASE_URL + 'authorize?' + paramsString;
  }

  isStateValid(state: string): boolean {
    return !!this.infoBefore && state === this.infoBefore.state;
  }

  navigateBack(router: Router): void {
    if (!this.infoBefore) {
      throw new Error('Cannot navigate back after Spotify authentication without previous navigation state.');
    }

    const url = this.infoBefore.url;
    localStorage.removeItem(SpotifyAuthentication.LOCALSTORAGE_KEY);
    this.infoBefore = undefined;
    router.navigate([url]);
  }

  private generateRandomString(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    const randomValues = new Uint8Array(length);
    window.crypto.getRandomValues(randomValues);
    for (const randomValue of randomValues) {
      result += characters.charAt(randomValue % charactersLength);
    }
    return result;
  }

  requestAccessToken(code: string): Promise<void> {
    if (!this.infoBefore) {
      return Promise.reject(new Error('Cannot request Spotify access token without previous authentication state.'));
    }

    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('code', code)
      .set('redirect_uri', SpotifyAuthentication.APP_REDIRECT_BACK_URL)
      .set('client_id', SpotifyAuthentication.CLIENT_ID)
      .set('code_verifier', this.infoBefore.codeVerifier);

    return new Promise((resolve, fatal) => {
        this.httpClient.post(
          SpotifyAuthentication.SPOTIFY_BASE_URL + 'api/token',
          body.toString(),
          {
            headers: new HttpHeaders()
              .set('Content-Type', 'application/x-www-form-urlencoded')
          }
        ).subscribe({
            next: (response: any) => {
              // The following fields are available in response: access_token, token_type, expires_in, refresh_token, scope.
              this.spotifyAuthenticationState.parseResponse(response.access_token, response.expires_in)
                .then(() => resolve())
                .catch((e) => fatal(e))
            },
            error: (e) => {
              fatal(e);
            }
          }
        );
      }
    );
  }

  logout() {
    localStorage.removeItem(SpotifyAuthentication.LOCALSTORAGE_KEY);
    this.infoBefore = undefined;
    this.spotifyAuthenticationState.reset();
  }
}
