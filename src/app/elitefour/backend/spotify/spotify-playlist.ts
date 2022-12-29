import {Injectable} from '@angular/core';
import {SpotifyAuthenticationState} from './spotify-authentication-state';
import {FavoriteItem} from '../favorite-list-interfaces';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class SpotifyPlaylist {
  static readonly MAX_NR_OF_ITEMS_PER_REQUEST = 100;

  constructor(private spotifyAuthenticationState: SpotifyAuthenticationState, private httpClient: HttpClient) {
  }

  create(name: string, sortedItems: FavoriteItem[]): Promise<string> {
    return new Promise((resolve, fatal) => {
      this.httpClient.post('https://api.spotify.com/v1/users/' + this.spotifyAuthenticationState.authenticatedInfo.userId + '/playlists',
        JSON.stringify({
          name,
          description: 'Playlist created by Elite Four',
          public: false,
        }), {headers: this.spotifyAuthenticationState.getAuthenticationHeader()})
        .subscribe({
          next: (response: any) => {
            let playlistId = response.id;
            this.addAllItems(playlistId, sortedItems)
              .then(() => resolve('https://open.spotify.com/playlist/' + playlistId))
              .catch((e) => fatal(e));
          }
        });
    });
  }

  private addAllItems(playlistId: string, sortedItems: FavoriteItem[]): Promise<void> {
    // Recursive method will modify input, so we create a shallow clone to safeguard the actual input.
    // Obviously we need to filter on items that actually contain Spotify information.
    const sortedItemsCloned = Object.assign([], sortedItems.filter(item => item.spotify));
    return this.recursiveAddAllItems(playlistId, sortedItemsCloned);
  }

  private recursiveAddAllItems(playlistId: string, sortedItems: FavoriteItem[]): Promise<void> {
    // Each Spotify request can add at most 100 items per request. These requests need to be sequential to ensure ordering.
    // We resolve this by recursively calling this method, where we only add the first 100 items of the given sortedItems.
    const sortedItemsToAdd = sortedItems.splice(0, SpotifyPlaylist.MAX_NR_OF_ITEMS_PER_REQUEST);

    // Within each partition, the songs will be added in the order we pass them in the request.
    const body = JSON.stringify({
      uris: sortedItemsToAdd.map(item => 'spotify:track:' + item.spotify.id)
    });

    return new Promise((resolve, fatal) => {
      this.httpClient.post('https://api.spotify.com/v1/playlists/' + playlistId + '/tracks', body, {
        headers: this.spotifyAuthenticationState.getAuthenticationHeader()
      }).subscribe({
        next: () => {
          if (sortedItems.length > 0) {
            this.recursiveAddAllItems(playlistId, sortedItems)
              .then(() => resolve())
              .catch((e) => fatal(e));
          } else {
            resolve()
          }
        },
        error: () => fatal()
      });
    });
  }
}
