import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class SpotifyStorage {
  static readonly LOCALSTORAGE_KEY_STATE = 'spotify-state';
  static readonly LOCALSTORAGE_KEY_CODE_VERIFIER = 'spotify-code-verifier';
  static readonly LOCALSTORAGE_KEY_URL = 'spotify-code-url';
  static readonly LOCALSTORAGE_KEY_ACCESS_TOKEN = 'spotify-code-access-token';

  public setState(state: string): void {
    localStorage.setItem(SpotifyStorage.LOCALSTORAGE_KEY_STATE, state);
  }

  public setCodeVerifier(codeVerifier: string): void {
    localStorage.setItem(SpotifyStorage.LOCALSTORAGE_KEY_CODE_VERIFIER, codeVerifier);
  }

  public setUrl(url: string): void {
    localStorage.setItem(SpotifyStorage.LOCALSTORAGE_KEY_URL, url);
  }

  public setAccessToken(accessToken: any): void {
    localStorage.setItem(SpotifyStorage.LOCALSTORAGE_KEY_ACCESS_TOKEN, accessToken);
  }

  public getState(): string {
    return localStorage.getItem(SpotifyStorage.LOCALSTORAGE_KEY_STATE);
  }

  public getCodeVerifier(): string {
    return localStorage.getItem(SpotifyStorage.LOCALSTORAGE_KEY_CODE_VERIFIER);
  }

  public getUrl(): string {
    return localStorage.getItem(SpotifyStorage.LOCALSTORAGE_KEY_URL);
  }

  public getAccessToken(): string {
    return localStorage.getItem(SpotifyStorage.LOCALSTORAGE_KEY_ACCESS_TOKEN);
  }
}
