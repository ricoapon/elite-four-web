import {SpotifyAuthentication} from './spotify-authentication';

function mockLocalStorage(): void {
  let store = {};

  const getItemFake = (key) => {
    return store[key] === undefined ? null : store[key];
  };
  const setItemFake = (key, value) => {
    return store[key] = value;
  };
  const removeItemFake = (key) => {
    delete store[key];
  };

  if ((localStorage.getItem as any).and) {
    (localStorage.getItem as jasmine.Spy).and.callFake(getItemFake);
  } else {
    spyOn(localStorage, 'getItem').and.callFake(getItemFake);
  }

  if ((localStorage.setItem as any).and) {
    (localStorage.setItem as jasmine.Spy).and.callFake(setItemFake);
  } else {
    spyOn(localStorage, 'setItem').and.callFake(setItemFake);
  }

  if ((localStorage.removeItem as any).and) {
    (localStorage.removeItem as jasmine.Spy).and.callFake(removeItemFake);
  } else {
    spyOn(localStorage, 'removeItem').and.callFake(removeItemFake);
  }
}

describe('SpotifyAuthentication', () => {
  beforeEach(() => {
    mockLocalStorage();
  });

  it('validates state from localStorage', () => {
    // Given
    localStorage.setItem(SpotifyAuthentication.LOCALSTORAGE_KEY, JSON.stringify({
      state: 'some-state',
      codeVerifier: 'some-verifier',
      url: '/list/1'
    }));
    const spotifyAuthentication = new SpotifyAuthentication({} as any, {} as any);

    // When and then
    expect(spotifyAuthentication.isStateValid('some-state')).toEqual(true);
    expect(spotifyAuthentication.isStateValid('wrong-state')).toEqual(false);
  });

  it('clears previous authentication state before moving back', () => {
    // Given
    localStorage.setItem(SpotifyAuthentication.LOCALSTORAGE_KEY, JSON.stringify({
      state: 'some-state',
      codeVerifier: 'some-verifier',
      url: '/list/1'
    }));
    const spotifyAuthentication = new SpotifyAuthentication({} as any, {} as any);
    const router = {
      navigate: jasmine.createSpy('navigate')
    };

    // When
    spotifyAuthentication.navigateBack(router as any);

    // Then
    expect(router.navigate).toHaveBeenCalledWith(['/list/1']);
    expect(spotifyAuthentication.infoBefore).toBeUndefined();
    expect(localStorage.getItem(SpotifyAuthentication.LOCALSTORAGE_KEY)).toBeNull();
  });
});
