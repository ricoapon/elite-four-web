import {HttpHeaders} from '@angular/common/http';
import {of, throwError} from 'rxjs';
import {FavoriteItem} from '../favorite-list-interfaces';
import {SpotifyPlaylist} from './spotify-playlist';

describe('SpotifyPlaylist', () => {
  function createAuthenticationState(): any {
    return {
      authenticatedInfo: {
        userId: 'some-user',
      },
      getAuthenticationHeader: () => new HttpHeaders()
    };
  }

  it('creates the playlist and adds one Spotify track', async () => {
    // Given
    const post = jasmine.createSpy('post').and.callFake((url: string) => {
      if (url.includes('/users/')) {
        return of({id: 'playlist-id'});
      }

      return of({});
    });
    const spotifyPlaylist = new SpotifyPlaylist(createAuthenticationState(), {post} as any);
    const items: FavoriteItem[] = [{
      id: 1,
      name: 'some-item',
      favoritePosition: 1,
      eliminatedBy: [],
      toBeChosen: false,
      spotify: {
        id: 'track-id',
        externalUrl: 'https://open.spotify.com/track/track-id'
      }
    }];

    // When
    const result = await spotifyPlaylist.create('some-list', items);

    // Then
    expect(result).toEqual('https://open.spotify.com/playlist/playlist-id');
    expect(post).toHaveBeenCalledTimes(2);
    expect(post.calls.argsFor(0)[0]).toEqual('https://api.spotify.com/v1/users/some-user/playlists');
    expect(JSON.parse(post.calls.argsFor(0)[1] as string)).toEqual({
      name: 'some-list',
      description: 'Playlist created by Elite Four',
      public: false,
    });
    expect(post.calls.argsFor(1)[0]).toEqual('https://api.spotify.com/v1/playlists/playlist-id/tracks');
    expect(JSON.parse(post.calls.argsFor(1)[1] as string)).toEqual({
      uris: ['spotify:track:track-id']
    });
  });

  it('rejects when Spotify playlist creation fails', async () => {
    // Given
    const error = new Error('Spotify failed');
    const post = jasmine.createSpy('post').and.returnValue(throwError(() => error));
    const spotifyPlaylist = new SpotifyPlaylist(createAuthenticationState(), {post} as any);

    // When and then
    try {
      await spotifyPlaylist.create('some-list', []);
      fail('Expected SpotifyPlaylist#create to reject.');
    } catch (e) {
      expect(e).toBe(error);
    }
  });
});
