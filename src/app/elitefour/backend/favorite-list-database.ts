import {Injectable} from '@angular/core';
import {FavoriteItem, FavoriteList, FavoriteListStatus} from './favorite-list-interfaces';
import {FavoriteListStore} from './favorite-list-store';

@Injectable({
  providedIn: 'root'
})
export class FavoriteListDatabase {
  private readonly store: FavoriteListStore;

  constructor() {
    this.store = new FavoriteListStore();
  }

  private generateListId(): number {
    return Math.max(...this.store.get().map(list => list.id), 0) + 1;
  }

  // noinspection JSMethodCanBeStatic
  private generateItemId(favoriteList: FavoriteList): number {
    return Math.max(...favoriteList.items.map(item => item.id), 0) + 1;
  }

  getLists(): FavoriteList[] {
    return this.store.get();
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

  saveLists(favoriteLists: FavoriteList[]): void {
    this.store.save(favoriteLists);
  }
}
