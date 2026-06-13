import {SpotifyAuthenticationState} from './spotify-authentication-state';

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

describe('SpotifyAuthenticationState', () => {
  beforeEach(() => {
    mockLocalStorage();
  });

  it('rehydrates validUntil as a Date from localStorage', () => {
    // Given
    const validUntil = new Date();
    validUntil.setMinutes(validUntil.getMinutes() + 5);
    localStorage.setItem(SpotifyAuthenticationState.LOCALSTORAGE_KEY_AUTHENTICATED_INFO, JSON.stringify({
      userName: 'Some User',
      userId: 'some-user',
      accessToken: 'some-token',
      validUntil: validUntil.toISOString()
    }));

    // When
    const state = new SpotifyAuthenticationState({} as any);

    // Then
    expect(state.authenticatedInfo.validUntil instanceof Date).toEqual(true);
    expect(state.isLoggedIn()).toEqual(true);
  });

  it('removes expired localStorage authentication state', () => {
    // Given
    const validUntil = new Date();
    validUntil.setMinutes(validUntil.getMinutes() - 5);
    localStorage.setItem(SpotifyAuthenticationState.LOCALSTORAGE_KEY_AUTHENTICATED_INFO, JSON.stringify({
      userName: 'Some User',
      userId: 'some-user',
      accessToken: 'some-token',
      validUntil: validUntil.toISOString()
    }));

    // When
    const state = new SpotifyAuthenticationState({} as any);

    // Then
    expect(state.isLoggedIn()).toEqual(false);
    expect(localStorage.getItem(SpotifyAuthenticationState.LOCALSTORAGE_KEY_AUTHENTICATED_INFO)).toBeNull();
  });

  it('removes invalid JSON localStorage authentication state', () => {
    // Disable logging for this specific test, to avoid thinking something is wrong.
    spyOn(console, 'log');

    // Given
    localStorage.setItem(SpotifyAuthenticationState.LOCALSTORAGE_KEY_AUTHENTICATED_INFO, '{');

    // When
    const state = new SpotifyAuthenticationState({} as any);

    // Then
    expect(state.isLoggedIn()).toEqual(false);
    expect(localStorage.getItem(SpotifyAuthenticationState.LOCALSTORAGE_KEY_AUTHENTICATED_INFO)).toBeNull();
  });

  it('throws when creating an authentication header while logged out', () => {
    // Given
    const state = new SpotifyAuthenticationState({} as any);

    // When and then
    expect(() => {
      state.getAuthenticationHeader();
    }).toThrowError();
  });
});
