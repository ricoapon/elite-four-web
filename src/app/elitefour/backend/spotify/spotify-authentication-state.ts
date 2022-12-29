import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

export type AuthenticatedInfo = {
  userName: string,
  userId: string,
  accessToken: string,
  validUntil: Date,
}

@Injectable({providedIn: 'root'})
export class SpotifyAuthenticationState {
  static readonly LOCALSTORAGE_KEY_AUTHENTICATED_INFO = 'spotify-authenticated-info';
  authenticatedInfo: AuthenticatedInfo = null;

  constructor(private httpClient: HttpClient) {
    this.readLocalStorage();
  }

  private readLocalStorage() {
    const value = localStorage.getItem(SpotifyAuthenticationState.LOCALSTORAGE_KEY_AUTHENTICATED_INFO);
    if (value !== null) {
      this.authenticatedInfo = JSON.parse(value);
    }
  }

  private saveLocalStorage() {
    if (this.authenticatedInfo == null) {
      localStorage.removeItem(SpotifyAuthenticationState.LOCALSTORAGE_KEY_AUTHENTICATED_INFO);
    } else {
      localStorage.setItem(SpotifyAuthenticationState.LOCALSTORAGE_KEY_AUTHENTICATED_INFO, JSON.stringify(this.authenticatedInfo));
    }
  }

  public parseResponse(accessToken: string, expiresIn: number): Promise<void> {
    const validUntil = new Date();
    validUntil.setSeconds(validUntil.getSeconds() + expiresIn);

    // Get user information and return promise that waits on the response.
    return new Promise((resolve, fatal) => {
      this.httpClient.get('https://api.spotify.com/v1/me', {headers: new HttpHeaders().set('Authorization', 'Bearer ' + accessToken)})
        .subscribe({
          next: (response: any) => {
            const userName = response.display_name;
            const userId = response.id;

            this.authenticatedInfo = {
              userName,
              userId,
              accessToken,
              validUntil
            };
            this.saveLocalStorage();
            resolve();
          },
          error: (e) => fatal(e)
        });
    });
  }

  public isLoggedIn(): boolean {
    return this.authenticatedInfo !== null;
  }

  public reset() {
    this.authenticatedInfo = null;
    this.saveLocalStorage();
  }

  public getAuthenticationHeader(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Bearer ' + this.authenticatedInfo.accessToken);
  }
}
