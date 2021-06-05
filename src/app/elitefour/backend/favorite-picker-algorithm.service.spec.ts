import {FavoriteListsRepositorySpec} from './spec-helper-mocks.spec';
import {FavoriteItem, FavoriteListStatus} from './favorite-list-interfaces';
import {FavoritePickerAlgorithm} from './favorite-picker-algorithm.service';

describe('FavoritePickerAlgorithm', () => {
  let repo: FavoriteListsRepositorySpec;
  let algorithm: FavoritePickerAlgorithm;
  beforeEach(() => {
    repo = new FavoriteListsRepositorySpec();
    repo.addFavoriteList('some-name', 2);
    repo.addItemToFavoriteList(1, 'item-1');
    repo.addItemToFavoriteList(1, 'item-2');
    repo.addItemToFavoriteList(1, 'item-3');
    algorithm = new FavoritePickerAlgorithm(repo, 1);
  });

  describe('Status related', () => {
    it('sets the status of the list to ONGOING if the list was just created', () => {
      // When
      algorithm.getNextItems();
      // Then
      expect(repo.getValue()[0].status).toEqual(FavoriteListStatus.ONGOING);
    });

    it('throws', () => {
      // Given
      repo.getValue()[0].status = FavoriteListStatus.FINISHED;
      // When and then
      expect(() => {
        algorithm.getNextItems();
      }).toThrowError();
    });
  });

  describe('toBeChosen related', () => {
    it('items are returned when toBeChosen is already set', () => {
      // Given
      repo.getValue()[0].items[0].toBeChosen = true;
      // When
      const result = algorithm.getNextItems();
      // Then
      expect(result).toEqual([repo.getValue()[0].items[0]]);
    });

    it('toBeChosen is set when items are chosen', () => {
      // Given
      spyOn(Math, 'random').and.returnValue(0);
      // When
      const result = algorithm.getNextItems();
      // Then
      expect(result).toHaveSize(2);
      expect(repo.getValue()[0].items[0].toBeChosen).toEqual(true);
      expect(repo.getValue()[0].items[1].toBeChosen).toEqual(true);
    });
  });

  describe('algorithm', () => {
    it('stores eliminatedBy after selecting items', () => {
      // Given
      spyOn(Math, 'random').and.returnValue(0);
      // When
      algorithm.selectItems([algorithm.getNextItems()[0]]); // Select 1 over 2
      // Then
      expect(repo.getValue()[0].status).toEqual(FavoriteListStatus.ONGOING);
      expect(repo.getValue()[0].items[1].eliminatedBy[0]).toEqual(1);
    });

    it('picks favorites automatically when no other choices are available', () => {
      // Given
      spyOn(Math, 'random').and.returnValue(0);
      // When
      const result1: FavoriteItem[] = algorithm.selectItems([algorithm.getNextItems()[0]]); // Select 1 over 2
      const result2: FavoriteItem[] = algorithm.selectItems([algorithm.getNextItems()[0]]); // Select 3 over 1
      // Then
      expect(result1).toHaveSize(0);
      expect(result2).toHaveSize(3);
      expect(repo.getValue()[0].status).toEqual(FavoriteListStatus.FINISHED);
      expect(repo.getValue()[0].items[0].favoritePosition).toEqual(2);
      expect(repo.getValue()[0].items[1].favoritePosition).toEqual(3);
      expect(repo.getValue()[0].items[2].favoritePosition).toEqual(1);
    });

    it('makes item eligible for choosing when item that eliminates it is picked as favorite', () => {
      // Given
      spyOn(Math, 'random').and.returnValue(0);
      // When
      const result1: FavoriteItem[] = algorithm.selectItems([algorithm.getNextItems()[0]]); // Select 1 over 2
      const result2: FavoriteItem[] = algorithm.selectItems([algorithm.getNextItems()[1]]); // Select 1 over 3
      const result3: FavoriteItem[] = algorithm.selectItems([algorithm.getNextItems()[0]]); // Select 2 over 3
      // Then
      expect(result1).toHaveSize(0);
      expect(result2[0].id).toEqual(1);
      expect(result3).toHaveSize(2);
      expect(repo.getValue()[0].status).toEqual(FavoriteListStatus.FINISHED);
    });
  });
});
