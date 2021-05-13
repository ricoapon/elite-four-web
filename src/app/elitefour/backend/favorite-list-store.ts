import {FavoriteList} from './favorite-list-interfaces';

export class FavoriteListStore {
  static readonly LOCALSTORAGE_KEY = 'store';

  favoriteLists: FavoriteList[];

  constructor() {
    // If we have favoriteLists in storage, retrieve it. Otherwise, initialize with an empty list.
    if (localStorage.getItem(FavoriteListStore.LOCALSTORAGE_KEY) !== null) {
      this.favoriteLists = JSON.parse(localStorage.getItem(FavoriteListStore.LOCALSTORAGE_KEY));
    } else {
      this.favoriteLists = [];
      this.saveStore();
    }
  }

  save(favoriteLists: FavoriteList[]): void {
    this.favoriteLists = favoriteLists;
    this.saveStore();
  }

  get(): FavoriteList[] {
    return this.favoriteLists;
  }

  getAsString(): string {
    return JSON.stringify(this.favoriteLists);
  }

  importString(favoriteLists: string): void {
    this.favoriteLists = JSON.parse(favoriteLists);
    this.saveStore();
  }

  private saveStore(): void {
    localStorage.setItem(FavoriteListStore.LOCALSTORAGE_KEY, JSON.stringify(this.favoriteLists));
  }
}
