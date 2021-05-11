import {FavoriteList} from './favorite-list-interfaces';

export class Store {
  has(favoriteLists: string): boolean {
    return false;
  }

  set(favoriteLists1: string, favoriteLists: FavoriteList[]): void {

  }

  get(favoriteLists: string): FavoriteList[] {
    return [];
  }
}
