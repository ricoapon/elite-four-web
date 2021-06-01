// The class under test uses localStorage. We mock this entire object.
import {FavoriteListsRepositoryImpl} from './favorite-list-repository-impl.service';
import {FavoriteList, FavoriteListStatus} from './favorite-list-interfaces';

beforeEach(() => {
  let store = {};
  spyOn(localStorage, 'getItem').and.callFake((key) => {
    return store[key] === undefined ? null : store[key];
  });
  spyOn(localStorage, 'setItem').and.callFake((key, value) => {
    return store[key] = value;
  });
  spyOn(localStorage, 'clear').and.callFake(() => {
    store = {};
  });
});

describe('FavoriteListsRepositoryImpl', () => {
  it('loads data from localStorage when constructed', () => {
    // Given
    localStorage.setItem(FavoriteListsRepositoryImpl.LOCALSTORAGE_KEY, JSON.stringify([{
      id: 1, name: 'list-name', status: FavoriteListStatus.CREATED, tsCreated: new Date(), items: [], nrOfItemsToBeShownOnScreen: 20
    }]));
    // When
    const repo = new FavoriteListsRepositoryImpl();
    let result;
    repo.getFavoriteLists().subscribe((favoriteLists: FavoriteList[]) => {
      result = favoriteLists;
    });
    // Then
    expect(result[0].name).toEqual('list-name');
  });

  it('emits current value when subscribing to the observable', () => {
    // Given
    const repo = new FavoriteListsRepositoryImpl();
    // When
    let result;
    repo.getFavoriteLists().subscribe((favoriteLists: FavoriteList[]) => {
      result = favoriteLists;
    });
    // Then
    expect(result).toEqual([]);
  });

  it('saves and emits value when data is modified', () => {
    // Given
    const repo = new FavoriteListsRepositoryImpl();
    repo.addFavoriteList('some-name', 20);
    // When
    let result;
    repo.getFavoriteLists().subscribe((favoriteLists: FavoriteList[]) => {
      result = favoriteLists;
    });
    repo.modify((favoriteLists: FavoriteList[]) => {
      favoriteLists[0].name = 'changed-name';
    });
    // Then
    expect(result[0].name).toEqual('changed-name');
    expect(JSON.parse(localStorage.getItem(FavoriteListsRepositoryImpl.LOCALSTORAGE_KEY))[0].name).toEqual('changed-name');
  });

  it('emitted value gives cloned data', () => {
    // Given
    const repo = new FavoriteListsRepositoryImpl();
    repo.addFavoriteList('some-name', 20);
    // When
    let modifiedData;
    repo.getFavoriteLists().subscribe((favoriteLists: FavoriteList[]) => {
      modifiedData = favoriteLists;
    });
    modifiedData[0].name = 'changed-name';
    // The underlying data is not changed, but when subscribing you get this cloned and changed data again. To make sure that we can test
    // that actual underlying data (which is not accessible) is not touched, we trigger the repo to emit again.
    repo.modify(() => {});
    // Then
    let result;
    repo.getFavoriteLists().subscribe((favoriteLists: FavoriteList[]) => {
      result = favoriteLists;
    });
    expect(result[0].name).toEqual('some-name');
  });
});
