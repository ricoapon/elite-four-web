import {map, Observable} from 'rxjs';
import {FavoriteItem, FavoriteList, FavoriteListStatus, SpotifyTrackReference} from './favorite-list-interfaces';
import {FavoriteListCloner} from './favorite-list-cloner';

/**
 * Interface (with default methods) for storing, retrieving and searching a {@link FavoriteList} array. This entry point maintains all the
 * data that exists in this application.
 * <br/>
 * The implementation of this class only needs to handle the storage and modification. The rest is done in this interface.
 */
export abstract class FavoriteListsRepository {

  private static requireListById(listId: number, favoriteLists: FavoriteList[]): FavoriteList {
    const favoriteList = favoriteLists.find(candidateFavoriteList => candidateFavoriteList.id === listId);
    if (!favoriteList) {
      throw new Error('List with id ' + listId + ' does not exist. Contact administrator.');
    }

    return favoriteList;
  }

  private static requireItemById(listId: number, itemId: number, favoriteLists: FavoriteList[]): FavoriteItem {
    const favoriteItem = this.requireListById(listId, favoriteLists).items.find(item => item.id === itemId);
    if (!favoriteItem) {
      throw new Error('Item ' + itemId + ' does not exist. Contact administrator.');
    }

    return favoriteItem;
  }

  private static generateListId(favoriteLists: FavoriteList[]): number {
    return Math.max(...favoriteLists.map(list => list.id), 0) + 1;
  }

  private static generateItemId(favoriteList: FavoriteList): number {
    return Math.max(...favoriteList.items.map(item => item.id), 0) + 1;
  }

  static parseFavoriteLists(data: string): FavoriteList[] {
    // Clone to ensure that Date objects are restored.
    return FavoriteListCloner.cloneFavoriteLists(JSON.parse(data));
  }

  /**
   * Returns an observable that pushes the latest {@link FavoriteList} array if any changes have been made. The object that is pushed will
   * be a copy of the original and cannot be modified directly. Use other methods for this.
   */
  abstract getFavoriteLists(): Observable<FavoriteList[]>;

  /**
   * Modifies the content, saves it and emits a new value to the observable from {@link FavoriteListsRepository#getFavoriteLists()}.
   * @param modifier The method that modifies the content.
   */
  abstract modify(modifier: (favoriteLists: FavoriteList[]) => void): void;

  /** Overrides the data completely, which is not possible with the modify method. Also save and emit the value. Only for internal use. */
  protected abstract _overrideAndSaveAndEmit(favoriteLists: FavoriteList[]): void;

  /**
   * Returns an observable that pushes the latest {@link FavoriteList} with a specific id if any changes have been made. The object that is
   * pushed will be a copy of the original and cannot be modified directly. Use other methods for this.
   */
  getFavoriteListById(listId: number): Observable<FavoriteList> {
    return this.getFavoriteLists()
      .pipe(map((favoriteLists) => favoriteLists.find(favoriteList => favoriteList.id === listId)));
  }

  addFavoriteList(listName: string, nrOfItemsToBeShownOnScreen: number): void {
    this.modify((favoriteLists: FavoriteList[]) => {
      if (listName.trim().length === 0) {
        throw new Error('List name cannot be empty');
      }
      if (!Number.isInteger(nrOfItemsToBeShownOnScreen) || nrOfItemsToBeShownOnScreen <= 0) {
        throw new Error('Number of items to be shown must be a positive integer');
      }

      const nameExists: boolean = !!favoriteLists.find(x => x.name === listName);
      if (nameExists) {
        throw new Error('List with the name ' + listName + ' already exists');
      }

      favoriteLists.push({
        id: FavoriteListsRepository.generateListId(favoriteLists), name: listName, status: FavoriteListStatus.CREATED,
        tsCreated: new Date(), items: [], nrOfItemsToBeShownOnScreen
      });
    });
  }

  updateFavoriteList(favoriteList: FavoriteList): void {
    this.modify((favoriteLists: FavoriteList[]) => {
      const favoriteListInlist: FavoriteList = FavoriteListsRepository.requireListById(favoriteList.id, favoriteLists);

      const listIndex = favoriteLists.indexOf(favoriteListInlist);
      favoriteLists[listIndex] = favoriteList;
    });
  }

  deleteFavoriteList(listId: number): void {
    this.modify((favoriteLists: FavoriteList[]) => {
      const favoriteList = FavoriteListsRepository.requireListById(listId, favoriteLists);

      favoriteLists.splice(favoriteLists.indexOf(favoriteList), 1);
    });
  }

  addItemToFavoriteList(listId: number, itemName: string, spotify?: SpotifyTrackReference): void {
    this.modify((favoriteLists: FavoriteList[]) => {
      const favoriteList: FavoriteList = FavoriteListsRepository.requireListById(listId, favoriteLists);
      if (itemName.trim().length === 0) {
        throw new Error('Item name cannot be empty');
      }

      const itemExists: boolean = !!favoriteList.items.find(item => item.name === itemName);
      if (itemExists) {
        throw new Error('Item with the name ' + itemName + ' already exists');
      }

      favoriteList.items.push({
        id: FavoriteListsRepository.generateItemId(favoriteList), name: itemName, eliminatedBy: [], toBeChosen: false, spotify: spotify
      });
    });
  }

  updateItemForFavoriteList(listId: number, updatedItem: FavoriteItem): void {
    this.modify((favoriteLists: FavoriteList[]) => {
      const favoriteList: FavoriteList = FavoriteListsRepository.requireListById(listId, favoriteLists);
      const itemInList: FavoriteItem = FavoriteListsRepository.requireItemById(listId, updatedItem.id, favoriteLists);

      const itemIndex = favoriteList.items.indexOf(itemInList);
      favoriteList.items[itemIndex] = updatedItem;
    });
  }

  deleteItemFromFavoriteList(listId: number, itemId: number): void {
    this.modify((favoriteLists: FavoriteList[]) => {
      const items = FavoriteListsRepository.requireListById(listId, favoriteLists).items;
      const favoriteItem: FavoriteItem = FavoriteListsRepository.requireItemById(listId, itemId, favoriteLists);

      items.splice(items.indexOf(favoriteItem), 1);
    });
  }

  removeAllItems(listId: number): void {
    this.modify((favoriteLists: FavoriteList[]) => {
      const favoriteList: FavoriteList = FavoriteListsRepository.requireListById(listId, favoriteLists);
      favoriteList.items = [];
    });
  }


  importFromString(data: string): boolean {
    try {
      this._overrideAndSaveAndEmit(FavoriteListsRepository.parseFavoriteLists(data));
    } catch (e) {
      console.log(e);
      return false;
    }

    return true;
  }
}
