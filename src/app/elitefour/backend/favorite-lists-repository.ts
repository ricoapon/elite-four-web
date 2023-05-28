import {Observable} from 'rxjs';
import {FavoriteItem, FavoriteList, FavoriteListStatus} from './favorite-list-interfaces';

/**
 * Interface (with default methods) for storing, retrieving and searching a {@link FavoriteList} array. This entry point maintains all the
 * data that exists in this application.
 * <br/>
 * The implementation of this class only needs to handle the storage and modification. The rest is done in this interface.
 */
export abstract class FavoriteListsRepository {

  private static findListById(listId: number, favoriteLists: FavoriteList[]): FavoriteList {
    return favoriteLists.find(favoriteList => favoriteList.id === listId);
  }

  private static findItemById(listId: number, itemId: number, favoriteLists: FavoriteList[]): FavoriteItem {
    return this.findListById(listId, favoriteLists).items.find(item => item.id === itemId);
  }

  private static generateListId(favoriteLists: FavoriteList[]): number {
    return Math.max(...favoriteLists.map(list => list.id), 0) + 1;
  }

  private static generateItemId(favoriteList: FavoriteList): number {
    return Math.max(...favoriteList.items.map(item => item.id), 0) + 1;
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
    return new Observable<FavoriteList>((observer) => {
      this.getFavoriteLists().subscribe((favoriteLists) => {
          observer.next(favoriteLists.find(favoriteList => favoriteList.id === listId));
        }
      );
    });
  }

  addFavoriteList(listName: string, nrOfItemsToBeShownOnScreen: number): void {
    this.modify((favoriteLists: FavoriteList[]) => {
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
      const favoriteListInlist: FavoriteList = favoriteLists.find(list => list.id === favoriteList.id);
      if (!favoriteListInlist) {
        throw new Error('List with id ' + favoriteList.id + ' does not exist. Contact administrator.');
      }

      const listIndex = favoriteLists.indexOf(favoriteListInlist);
      favoriteLists[listIndex] = favoriteList;
    });
  }

  deleteFavoriteList(listId: number): void {
    this.modify((favoriteLists: FavoriteList[]) => {
      const favoriteList = FavoriteListsRepository.findListById(listId, favoriteLists);
      if (!favoriteList) {
        throw new Error('List with id ' + listId + ' does not exist. Contact administrator.');
      }

      favoriteLists.splice(favoriteLists.indexOf(favoriteList), 1);
    });
  }

  addItemToFavoriteList(listId: number, itemName: string, spotify: any = undefined): void {
    this.modify((favoriteLists: FavoriteList[]) => {
      const favoriteList: FavoriteList = FavoriteListsRepository.findListById(listId, favoriteLists);
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
      const favoriteList: FavoriteList = FavoriteListsRepository.findListById(listId, favoriteLists);
      const itemInList: FavoriteItem = favoriteList.items.find(item => item.id === updatedItem.id);
      if (!itemInList) {
        throw new Error('Item ' + updatedItem.id + ' does not exist. Contact administrator.');
      }

      const itemIndex = favoriteList.items.indexOf(itemInList);
      favoriteList.items[itemIndex] = updatedItem;
    });
  }

  deleteItemFromFavoriteList(listId: number, itemId: number): void {
    this.modify((favoriteLists: FavoriteList[]) => {
      const items = FavoriteListsRepository.findListById(listId, favoriteLists).items;
      const favoriteItem: FavoriteItem = FavoriteListsRepository.findItemById(listId, itemId, favoriteLists);
      if (!favoriteItem) {
        throw new Error('Item ' + itemId + ' does not exist. Contact administrator.');
      }

      items.splice(items.indexOf(favoriteItem), 1);
    });
  }

  removeAllItems(listId: number): void {
    this.modify((favoriteLists: FavoriteList[]) => {
      const favoriteList: FavoriteList = FavoriteListsRepository.findListById(listId, favoriteLists);
      favoriteList.items = [];
    });
  }


  importFromString(data: string): boolean {
    try {
      this._overrideAndSaveAndEmit(JSON.parse(data));
    } catch (e) {
      console.log(e);
      return false;
    }

    return true;
  }
}
