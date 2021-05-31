import {FavoriteList, FavoriteListsRepository, FavoriteListStatus} from './favorite-list-interfaces';
import {BehaviorSubject, Observable} from 'rxjs';
import {Injectable} from '@angular/core';

/**
 * Implementation of {@link FavoriteListsRepository} that uses localStorage to store the object.
 */
@Injectable({
  providedIn: 'root'
})
export class FavoriteListsRepositoryImpl extends FavoriteListsRepository {
  static readonly LOCALSTORAGE_KEY = 'store';

  /** Data that should always be saved to storage when modified. Whenever modified, an event must be pushed favoriteListsSubject. */
  private favoriteLists: FavoriteList[];
  private readonly favoriteListsSubject: BehaviorSubject<FavoriteList[]>;

  constructor() {
    super();
    // If we have favoriteLists in storage, retrieve it. Otherwise, initialize with an empty list.
    if (localStorage.getItem(FavoriteListsRepositoryImpl.LOCALSTORAGE_KEY) !== null) {
      this.favoriteLists = JSON.parse(localStorage.getItem(FavoriteListsRepositoryImpl.LOCALSTORAGE_KEY));
    } else {
      this.favoriteLists = [];
      this.saveDataToLocalStorage();
    }

    this.favoriteListsSubject = new BehaviorSubject<FavoriteList[]>(this.favoriteLists);
  }

  getFavoriteLists(): Observable<FavoriteList[]> {
    return this.favoriteListsSubject.asObservable();
  }

  modify(modifier: (favoriteLists: FavoriteList[]) => void): void {
    modifier(this.favoriteLists);
    this.saveDataToLocalStorage();
    this.favoriteListsSubject.next(this.favoriteLists);
  }

  private saveDataToLocalStorage(): void {
    localStorage.setItem(FavoriteListsRepositoryImpl.LOCALSTORAGE_KEY, JSON.stringify(this.favoriteLists));
  }

  resetAlgorithm(listId: number): void {
    this.modify((favoriteLists: FavoriteList[]) => {
      const favoriteList: FavoriteList = favoriteLists.find(x => x.id === listId);
      favoriteList.status = FavoriteListStatus.CREATED;
      favoriteList.items.forEach((item) => {
        item.favoritePosition = undefined;
        item.eliminatedBy = [];
        item.toBeChosen = false;
      });
    });
  }

  getAsString(): string {
    return JSON.stringify(this.favoriteLists);
  }

  importFromString(data: string): boolean {
    try {
      this.favoriteLists = JSON.parse(data);
    } catch (e) {
      console.log(e);
      return false;
    }

    this.saveDataToLocalStorage();
    return true;
  }
}
