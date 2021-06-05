import {FavoriteListsRepository} from './favorite-lists-repository';
import {FavoriteList} from './favorite-list-interfaces';
import {BehaviorSubject, Observable} from 'rxjs';

/** Simple implementation for test that stores data in memory. */
export class FavoriteListsRepositorySpec extends FavoriteListsRepository {
  private favoriteLists: FavoriteList[];
  private readonly favoriteListsSubject: BehaviorSubject<FavoriteList[]>;

  /** Get the underlying value to make the tests easier. */
  getValue(): FavoriteList[] {
    return this.favoriteLists;
  }

  constructor() {
    super();
    this.favoriteLists = [];
    this.favoriteListsSubject = new BehaviorSubject<FavoriteList[]>(this.favoriteLists);
  }

  protected _overrideAndSaveAndEmit(favoriteLists: FavoriteList[]): void {
    this.favoriteLists = favoriteLists;
    this.favoriteListsSubject.next(this.favoriteLists);
  }

  getFavoriteLists(): Observable<FavoriteList[]> {
    return this.favoriteListsSubject.asObservable();
  }

  modify(modifier: (favoriteLists: FavoriteList[]) => void): void {
    modifier(this.favoriteLists);
    this.favoriteListsSubject.next(this.favoriteLists);
  }
}
