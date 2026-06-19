import {HttpHeaders} from '@angular/common/http';
import {of} from 'rxjs';
import {SpotifySearch} from './spotify-search';

describe('SpotifySearch', () => {
  function createAuthenticationState(): any {
    return {
      getAuthenticationHeader: () => new HttpHeaders()
    };
  }

  it('searchTrack returns autoMatch', async () => {
    // Given
    const get = jasmine.createSpy('get').and.returnValue(of(spotifyResponse([
      spotifyTrack('Fallen Leaves', ['Billy Talent'], 'track-id')
    ])));
    const spotifySearch = new SpotifySearch(createAuthenticationState(), {get} as any);

    // When
    const track = await spotifySearch.searchTrack('Billy Talent - Fallen Leaves');

    // Then
    expect(track.id).toEqual('track-id');
  });
});

function spotifyResponse(items: any[]): any {
  return {
    tracks: {
      items
    }
  };
}

function spotifyTrack(name: string, artists: string[], id: string): any {
  return {
    name,
    artists: artists.map((artist) => ({name: artist})),
    id,
    external_urls: {
      spotify: 'https://open.spotify.com/track/' + id
    }
  };
}
