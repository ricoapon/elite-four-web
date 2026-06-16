import {HttpHeaders} from '@angular/common/http';
import {of} from 'rxjs';
import {SpotifySearchClient} from './spotify-search-client';

describe('SpotifySearchClient', () => {
  it('calls Spotify search with query params, limit, and auth header', async () => {
    // Given
    const headers = new HttpHeaders().set('Authorization', 'Bearer test-token');
    const get = jasmine.createSpy('get').and.returnValue(of(spotifyResponse([])));
    const client = new SpotifySearchClient(
      {getAuthenticationHeader: () => headers} as any,
      {get} as any
    );

    // When
    await client.searchTracks('fallen leaves');

    // Then
    const calledUrl = new URL(get.calls.argsFor(0)[0]);
    expect(calledUrl.origin + calledUrl.pathname).toEqual('https://api.spotify.com/v1/search');
    expect(calledUrl.searchParams.get('type')).toEqual('track');
    expect(calledUrl.searchParams.get('limit')).toEqual('10');
    expect(calledUrl.searchParams.get('q')).toEqual('fallen leaves');
    expect(get.calls.argsFor(0)[1].headers.get('Authorization')).toEqual('Bearer test-token');
  });

  it('parses the result into Track object', async () => {
    // Given
    const get = jasmine.createSpy('get').and.returnValue(of(spotifyResponse([
      spotifyTrack('Fallen Leaves', ['Billy Talent'], 'track-id')
    ])));
    const client = new SpotifySearchClient(createAuthenticationState(), {get} as any);

    // When
    const tracks = await client.searchTracks('fallen leaves');

    // Then
    expect(tracks).toEqual([{
      name: 'Fallen Leaves',
      artists: ['Billy Talent'],
      id: 'track-id',
      externalUrl: 'https://open.spotify.com/track/track-id'
    }]);
  });
});

function createAuthenticationState(): any {
  return {
    getAuthenticationHeader: () => new HttpHeaders()
  };
}

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
