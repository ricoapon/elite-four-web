import {FavoriteListsRepository} from './favorite-lists-repository';
import {FavoriteItem, FavoriteListStatus} from './favorite-list-interfaces';
import {FavoriteListsRepositorySpec} from './spec-helper-mocks.spec';

describe('FavoriteListsRepository', () => {
  it('getFavoriteListById() emits value for specific list when modified', () => {
    // Given
    const repo = new FavoriteListsRepositorySpec();
    repo.addFavoriteList('some-list', 20);
    // When
    let resultList;
    repo.getFavoriteListById(1).subscribe((favoriteList) => {
      resultList = favoriteList;
    });
    repo.modify((favoriteLists => {
      favoriteLists[0].name = 'changed-name';
    }));
    // Then
    expect(resultList.name).toEqual('changed-name');
  });

  describe('addFavoriteList', () => {
    it('adds a new list which has correct default values', () => {
      // Mock new Date() so we can test the date.
      jasmine.clock().install();
      const mockedDate = new Date('2020-01-01');
      jasmine.clock().mockDate(mockedDate);
      // Given
      const repo = new FavoriteListsRepositorySpec();
      // When
      repo.addFavoriteList('some-list', 1337);
      // Then
      expect(repo.getValue()[0]).toEqual({
        id: 1, name: 'some-list', status: FavoriteListStatus.CREATED, tsCreated: mockedDate, items: [], nrOfItemsToBeShownOnScreen: 1337
      });
      jasmine.clock().uninstall();
    });

    it('throws an error when list with the same name already exists', () => {
      // Given
      const repo = new FavoriteListsRepositorySpec();
      repo.addFavoriteList('some-list', 1337);
      // When and then
      expect(() => {
        repo.addFavoriteList('some-list', 2);
      }).toThrowError();
    });
  });

  describe('updateFavoriteList', () => {
    it('works', () => {
      // Given
      const repo = new FavoriteListsRepositorySpec();
      repo.addFavoriteList('some-list', 1337);
      // When
      const list = {
        id: 1, name: 'changed-name', status: FavoriteListStatus.CREATED, tsCreated: new Date(), items: [], nrOfItemsToBeShownOnScreen: 1337
      };
      repo.updateFavoriteList(list);
      // Then
      expect(repo.getValue()[0].name).toEqual('changed-name');
    });

    it('throws an error when list with same id does not exist', () => {
      // Given
      const repo = new FavoriteListsRepositorySpec();
      repo.addFavoriteList('some-list', 1337);
      // When and then
      const list = {
        id: 123, name: 'some-list', status: FavoriteListStatus.CREATED, tsCreated: new Date(), items: [], nrOfItemsToBeShownOnScreen: 1337
      };
      expect(() => {
        repo.updateFavoriteList(list);
      }).toThrowError();
    });
  });

  describe('deleteFavoriteList', () => {
    it('works', () => {
      // Given
      const repo = new FavoriteListsRepositorySpec();
      repo.addFavoriteList('some-list', 1337);
      // When
      repo.deleteFavoriteList(1);
      // Then
      expect(repo.getValue()).toHaveSize(0);
    });

    it('throws an error when list with id does not exist', () => {
      // Given
      const repo = new FavoriteListsRepositorySpec();
      // When and then
      expect(() => {
        repo.deleteFavoriteList(1);
      }).toThrowError();
    });
  });

  describe('addItemToFavoriteList', () => {
    it('works', () => {
      // Given
      const repo = new FavoriteListsRepositorySpec();
      repo.addFavoriteList('some-list', 1337);
      // When
      repo.addItemToFavoriteList(1, 'some-item-name');
      // Then
      expect(repo.getValue()[0].items[0].name).toEqual('some-item-name');
    });

    it('throws an error when item with name already exists', () => {
      // Given
      const repo = new FavoriteListsRepositorySpec();
      repo.addFavoriteList('some-list', 1337);
      repo.addItemToFavoriteList(1, 'some-item-name');
      // When and then
      expect(() => {
        repo.addItemToFavoriteList(1, 'some-item-name');
      }).toThrowError();
    });
  });

  describe('updateItemForFavoriteList', () => {
    it('works', () => {
      // Given
      const repo = new FavoriteListsRepositorySpec();
      repo.addFavoriteList('some-list', 1337);
      repo.addItemToFavoriteList(1, 'some-item-name');
      // When
      const item = repo.getValue()[0].items[0];
      item.name = 'changed-item-name';
      repo.updateItemForFavoriteList(1, item);
      // Then
      expect(repo.getValue()[0].items[0].name).toEqual('changed-item-name');
    });

    it('throws an error when item with id does not exist', () => {
      // Given
      const repo = new FavoriteListsRepositorySpec();
      repo.addFavoriteList('some-list', 1337);
      // When and then
      const item: FavoriteItem = {
        id: 123, name: 'non-existing-name', eliminatedBy: [], toBeChosen: false
      };
      expect(() => {
        repo.updateItemForFavoriteList(1, item);
      }).toThrowError();
    });
  });

  describe('deleteItemFromFavoriteList', () => {
    it('works', () => {
      // Given
      const repo = new FavoriteListsRepositorySpec();
      repo.addFavoriteList('some-list', 1337);
      repo.addItemToFavoriteList(1, 'some-item-name');
      // When
      repo.deleteItemFromFavoriteList(1, 1);
      // Then
      expect(repo.getValue()[0].items).toHaveSize(0);
    });

    it('throws an error when item with id does not exist', () => {
      // Given
      const repo = new FavoriteListsRepositorySpec();
      repo.addFavoriteList('some-list', 1337);
      // When and then
      expect(() => {
        repo.deleteItemFromFavoriteList(1, 1);
      }).toThrowError();
    });
  });

  describe('removeAllItems', () => {
    it('works', () => {
      // Given
      const repo = new FavoriteListsRepositorySpec();
      repo.addFavoriteList('some-list', 1337);
      repo.addItemToFavoriteList(1, 'some-item-name');
      repo.addItemToFavoriteList(1, 'some-other-item-name');
      // When
      repo.removeAllItems(1);
      // Then
      expect(repo.getValue()[0].items).toHaveSize(0);
    });
  });

  describe('importFromString', () => {
    it('works', () => {
      // Given
      const repo = new FavoriteListsRepositorySpec();
      // When
      const result = repo.importFromString('[{"id":1,"name":"some-list-name","status":"Finished","tsCreated":"2021-05-13T17:02:35.313Z","items":[{"id":2,"name":"b","eliminatedBy":[],"toBeChosen":false,"favoritePosition":1},{"id":3,"name":"c","eliminatedBy":[],"toBeChosen":false,"favoritePosition":2},{"id":1,"name":"a","eliminatedBy":[],"toBeChosen":false,"favoritePosition":3}],"nrOfItemsToBeShownOnScreen":20}]');
      // Then
      expect(result).toEqual(true);
      expect(repo.getValue()[0].name).toEqual('some-list-name');
      expect(repo.getValue()[0].items).toHaveSize(3);
    });

    it('fails when JSON is invalid', () => {
      // Disable logging for this specific test, to avoid thinking something is wrong.
      spyOn(console, 'log');

      // Given
      const repo = new FavoriteListsRepositorySpec();
      // When
      const result = repo.importFromString('[{');
      // Then
      expect(result).toEqual(false);
    });
  });
});
