import {FavoriteList} from './favorite-list-interfaces';

/**
 * Class for methods used to clone {@link FavoriteList} objects.
 */
export class FavoriteListCloner {
  public static cloneFavoriteLists(favoriteLists: FavoriteList[]): FavoriteList[] {
    // This is not the fastest, so it might not perform for extremely large objects. Not a problem for this small application.
    // Right now, this is an easy solution without a lot of work. Easy to maintain!
    const result = JSON.parse(JSON.stringify(favoriteLists));
    result.forEach((favoriteList) => {
      favoriteList.tsCreated = new Date(favoriteList.tsCreated);
    });
    return result;
  }
}
