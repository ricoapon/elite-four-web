import {FavoriteList, FavoriteListsRepository} from './favorite-list-interfaces';
import {BehaviorSubject, Observable} from 'rxjs';
import {FavoriteListCloner} from './favorite-list-cloner';
import {Injectable} from '@angular/core';

/**
 * Implementation of {@link FavoriteListsRepository} that uses localStorage to store the object.
 */
@Injectable()
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

    this.favoriteListsSubject = new BehaviorSubject<FavoriteList[]>(FavoriteListCloner.cloneFavoriteLists(this.favoriteLists));
  }

  getFavoriteLists(): Observable<FavoriteList[]> {
    return this.favoriteListsSubject.asObservable();
  }

  modify(modifier: (favoriteLists: FavoriteList[]) => void): void {
    modifier(this.favoriteLists);
    this.saveDataToLocalStorage();
    this.favoriteListsSubject.next(FavoriteListCloner.cloneFavoriteLists(this.favoriteLists));
  }

  protected _overrideAndSaveAndEmit(favoriteLists: FavoriteList[]): void {
    this.favoriteLists = favoriteLists;
    this.saveDataToLocalStorage();
    this.favoriteListsSubject.next(FavoriteListCloner.cloneFavoriteLists(this.favoriteLists));
  }

  private saveDataToLocalStorage(): void {
    localStorage.setItem(FavoriteListsRepositoryImpl.LOCALSTORAGE_KEY, JSON.stringify(this.favoriteLists));
  }
}
