import {FavoriteList, FavoriteListStatus} from './favorite-list-interfaces';
import {FavoriteListCloner} from './favorite-list-cloner';

describe('FavoriteListCloner#cloneFavoriteLists()', () => {
  it('should create a deep clone', () => {
    // Given
    const favoriteLists: FavoriteList[] = [{
      id: 1,
      name: 'some-name',
      items: [{
        id: 1,
        name: 'some-item',
        favoritePosition: 1,
        eliminatedBy: [],
        toBeChosen: false
      }],
      status: FavoriteListStatus.CREATED,
      tsCreated: new Date(),
      nrOfItemsToBeShownOnScreen: 20
    }];

    // When
    const clonedFavoriteLists = FavoriteListCloner.cloneFavoriteLists(favoriteLists);
    clonedFavoriteLists.push({
      id: 2,
      name: 'some-other-name',
      items: [],
      status: FavoriteListStatus.CREATED,
      tsCreated: new Date(),
      nrOfItemsToBeShownOnScreen: 20
    });
    clonedFavoriteLists[0].name = 'changed-list-name';
    clonedFavoriteLists[0].items[0].name = 'changed-item-name';
    clonedFavoriteLists[0].items[0].eliminatedBy.push(1);

    // Then
    expect(favoriteLists.length).toEqual(1);
    expect(favoriteLists[0].name).toEqual('some-name');
    expect(favoriteLists[0].items[0].name).toEqual('some-item');
    expect(favoriteLists[0].items[0].eliminatedBy.length).toEqual(0);
  });

  it('clone has correct data fields', () => {
    // Given
    const favoriteLists: FavoriteList[] = [{
      id: 1,
      name: 'some-name',
      items: [{
        id: 1,
        name: 'some-item',
        favoritePosition: 1,
        eliminatedBy: [],
        toBeChosen: false
      }],
      status: FavoriteListStatus.CREATED,
      tsCreated: new Date('2020-01-01'),
      nrOfItemsToBeShownOnScreen: 20
    }];
    // When
    const clonedFavoriteLists = FavoriteListCloner.cloneFavoriteLists(favoriteLists);
    // Then
    expect(clonedFavoriteLists[0].tsCreated).toEqual(new Date('2020-01-01'));
  });
});
