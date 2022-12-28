import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {SpotifyStorage} from './spotify-storage';
import * as crypto from 'crypto-js';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class SpotifyAuthentication {
  static readonly SPOTIFY_BASE_URL = 'https://accounts.spotify.com/';
  static readonly CLIENT_ID = '9f119ae07667426ba566161b900a7c06';
  static readonly APP_REDIRECT_BACK_URL = environment.app_base_url + 'spotify-callback';

  constructor(private httpClient: HttpClient, private spotifyStorage: SpotifyStorage) {
  }

  redirectToSpotify(currentRelativeUrl: string): void {
    const state = this.generateRandomString(20);
    const codeVerifier = this.generateRandomString(128);
    this.spotifyStorage.setState(state);
    this.spotifyStorage.setCodeVerifier(codeVerifier);
    this.spotifyStorage.setUrl(currentRelativeUrl);

    const codeVerifierHash = crypto.SHA256(codeVerifier).toString(crypto.enc.Base64);
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
    return state === this.spotifyStorage.getState();
  }

  navigateBack(router: Router): void {
    router.navigate([this.spotifyStorage.getUrl()]);
  }

  private generateRandomString(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  requestAccessToken(code: string): Promise<boolean> {
    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('code', code)
      .set('redirect_uri', SpotifyAuthentication.APP_REDIRECT_BACK_URL)
      .set('client_id', SpotifyAuthentication.CLIENT_ID)
      .set('code_verifier', this.spotifyStorage.getCodeVerifier());

    return new Promise((resolve) => {
        this.httpClient.post(
          SpotifyAuthentication.SPOTIFY_BASE_URL + 'api/token',
          body.toString(),
          {
            headers: new HttpHeaders()
              .set('Content-Type', 'application/x-www-form-urlencoded')
          }
        ).subscribe({
            next: (response) => {
              this.processTokenResponse(response);
              resolve(true);
            },
            error: (e) => {
              console.log(e);
              resolve(false);
            }
          }
        );
      }
    );
  }

  private processTokenResponse(response: any): void {
    // The following fields are available: access_token, token_type, expires_in, refresh_token, scope.
    this.spotifyStorage.setAccessToken(response.access_token);
  }
}
