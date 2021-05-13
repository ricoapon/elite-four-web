import {FavoriteItem, FavoriteList, FavoriteListStatus} from './favorite-list-interfaces';
import {ReplaySubject} from 'rxjs';

export class FavoriteListStore {
  static readonly LOCALSTORAGE_KEY = 'store';

  /** Data that should always be saved to storage when modified. Whenever modified, an event must be pushed favoriteListsSubject. */
  private favoriteLists: FavoriteList[];

  constructor(private favoriteListsSubject: ReplaySubject<FavoriteList[]>) {
    // If we have favoriteLists in storage, retrieve it. Otherwise, initialize with an empty list.
    if (localStorage.getItem(FavoriteListStore.LOCALSTORAGE_KEY) !== null) {
      this.favoriteLists = JSON.parse(localStorage.getItem(FavoriteListStore.LOCALSTORAGE_KEY));
    } else {
      this.favoriteLists = [];
      this.saveDataToDisk();
    }
    this.favoriteListsSubject.next(this.favoriteLists);
  }

  modify(modifier: (a: FavoriteList[]) => void): void {
    modifier(this.favoriteLists);
    this.saveDataToDisk();
  }

  /** Returns array that should not be modified. */
  get(): readonly FavoriteList[] {
    return this.favoriteLists;
  }

  getAsString(): string {
    return JSON.stringify(this.favoriteLists);
  }

  save(favoriteLists: FavoriteList[]): void {
    this.favoriteLists = favoriteLists;
    this.saveDataToDisk();
  }

  saveFromString(favoriteLists: string): void {
    this.favoriteLists = JSON.parse(favoriteLists);
    this.saveDataToDisk();
  }

  createNewList(listName: string, nrOfItemsToBeShownOnScreen: number): FavoriteList {
    return {
      id: this.generateListId(), name: listName, status: FavoriteListStatus.CREATED,
      tsCreated: new Date(), items: [], nrOfItemsToBeShownOnScreen
    };
  }

  createNewItem(favoriteList: FavoriteList, itemName: string): FavoriteItem {
    return {id: this.generateItemId(favoriteList), name: itemName, eliminatedBy: [], toBeChosen: false};
  }

  private saveDataToDisk(): void {
    localStorage.setItem(FavoriteListStore.LOCALSTORAGE_KEY, JSON.stringify(this.favoriteLists));
    this.favoriteListsSubject.next(this.favoriteLists);
  }

  private generateListId(): number {
    return Math.max(...this.favoriteLists.map(list => list.id), 0) + 1;
  }

  // noinspection JSMethodCanBeStatic
  private generateItemId(favoriteList: FavoriteList): number {
    return Math.max(...favoriteList.items.map(item => item.id), 0) + 1;
  }
}
