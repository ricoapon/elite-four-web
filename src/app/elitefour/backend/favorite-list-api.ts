import {FavoriteItem, FavoriteList, FavoriteListStatus} from './favorite-list-interfaces';
import {Observable, ReplaySubject} from 'rxjs';
import {Injectable} from '@angular/core';
import {FavoriteListStore} from './favorite-list-store';

@Injectable({
  providedIn: 'root'
})
export class FavoriteListApi {
  private readonly favoriteListsStorage: FavoriteListStore;
  private readonly favoriteListsSubject: ReplaySubject<FavoriteList[]>;

  constructor() {
    this.favoriteListsSubject = new ReplaySubject<FavoriteList[]>(1);
    this.favoriteListsStorage = new FavoriteListStore(this.favoriteListsSubject);
  }

  private findListById(listId: number): FavoriteList {
    return this.favoriteListsStorage.get().find(favoriteList => favoriteList.id === listId);
  }

  private findItemById(listId: number, itemId: number): FavoriteItem {
    return this.findListById(listId).items.find(item => item.id === itemId);
  }



  updateList(favoriteList: FavoriteList): void {
    const favoriteListInlist: FavoriteList = this.favoriteListsStorage.get().find(list => list.id === favoriteList.id);

    if (!favoriteListInlist) {
      throw new Error('List ' + favoriteList.id + ' does not exist. Contact administrator.');
    }

    const listIndex = this.favoriteListsStorage.get().indexOf(favoriteListInlist);
    this.favoriteListsStorage.modify(favoriteLists => favoriteLists[listIndex] = favoriteList);
  }

  getFavoriteLists(): Observable<FavoriteList[]> {
    return this.favoriteListsSubject.asObservable();
  }

  getFavoriteListById(listId: number): Observable<FavoriteList> {
    return new Observable<FavoriteList>((observer) => {
      this.getFavoriteLists().subscribe((favoriteLists) => {
          observer.next(favoriteLists.find(favoriteList => favoriteList.id === listId));
      }
      );
    });
  }

  addNewFavoriteList(listName: string, nrOfItemsToBeShownOnScreen: number): void {
    const nameExists: boolean = !!this.favoriteListsStorage.get().find(x => x.name === listName);

    if (nameExists) {
      throw new Error('List with the same name already exists');
    }

    const favoriteList: FavoriteList = this.favoriteListsStorage.createNewList(listName, nrOfItemsToBeShownOnScreen);

    this.favoriteListsStorage.modify(favoriteLists => favoriteLists.push(favoriteList));
  }

  deleteFavoriteList(listId: number): void {
    const favoriteList = this.findListById(listId);
    this.favoriteListsStorage.modify(favoriteLists => favoriteLists.splice(favoriteLists.indexOf(favoriteList), 1));
  }

  addItemToFavoriteList(listId: number, itemName: string): void {
    const favoriteList: FavoriteList = this.findListById(listId);
    const itemExists: boolean = !!favoriteList.items.find(item => item.name === itemName);

    if (itemExists) {
      throw new Error('Item with the same name already exists');
    }

    this.favoriteListsStorage.modify(() => favoriteList.items.push(this.favoriteListsStorage.createNewItem(favoriteList, itemName)));
  }

  updateItemForFavoriteList(listId: number, updatedItem: FavoriteItem): void {
    const favoriteList: FavoriteList = this.findListById(listId);
    const itemInList: FavoriteItem = favoriteList.items.find(item => item.id === updatedItem.id);

    if (!itemInList) {
      throw new Error('Item ' + updatedItem.id + ' does not exist. Contact administrator.');
    }

    const itemIndex = favoriteList.items.indexOf(itemInList);
    this.favoriteListsStorage.modify(() => favoriteList.items[itemIndex] = updatedItem);
  }

  deleteItemFromFavoriteList(listId: number, itemId: number): void {
    const items = this.findListById(listId).items;
    const favoriteItem: FavoriteItem = this.findItemById(listId, itemId);
    this.favoriteListsStorage.modify(() => items.splice(items.indexOf(favoriteItem), 1));
  }

  resetAlgorithm(listId: number): void {
    const favoriteList: FavoriteList = this.findListById(listId);
    favoriteList.status = FavoriteListStatus.CREATED;
    this.favoriteListsStorage.modify(() => favoriteList.items.forEach((item) => {
      item.favoritePosition = undefined;
      item.eliminatedBy = [];
      item.toBeChosen = false;
    }));
  }

  removeAllItems(listId: number): void {
    const favoriteList: FavoriteList = this.findListById(listId);
    this.favoriteListsStorage.modify(() => favoriteList.items = []);
  }



  getAsString(): string {
    return this.favoriteListsStorage.getAsString();
  }

  importFromString(data: string): void {
    this.favoriteListsStorage.saveFromString(data);
  }
}
