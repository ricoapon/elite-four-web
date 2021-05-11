import {FavoriteItem, FavoriteList, FavoriteListStatus} from "./favorite-list-interfaces";
import {FavoriteListApi} from "./favorite-list-api";
import {Injectable} from "@angular/core";
import {Observable, ReplaySubject} from "rxjs";

// This class shouldn't actually be a singleton. It should be a dependency that is created using a listId.
// I don't know how to do this, so I just rewritten this as a singleton where the initialize method overwrites the whole content.
// This class will not be used more than once on a screen anyway. So that is probably fine.
@Injectable({
  providedIn: 'root'
})
export class FavoriteItemApi {
  private favoriteList: FavoriteList
  private favoriteListSubject: ReplaySubject<FavoriteList>;

  constructor(private favoriteListApi: FavoriteListApi) {
  }

  /**
   * Initialize the api for a certain list.
   * @param listId The id of the list.
   */
  initialize(listId: number) {
    this.favoriteListApi.getFavoriteListById(listId).subscribe(list => this.favoriteList = list)
    this.favoriteListSubject = new ReplaySubject<FavoriteList>(1)
    this.favoriteListSubject.next(this.favoriteList)
  }

  private getItemsThatCanBeChosen(nrOfItemsToBeShownOnScreen: number): FavoriteItem[] {
    // Any item that is not eliminated or already a favorite can be chosen.
    const possibleItemSelection = this.favoriteList.items.filter((item) => item.eliminatedBy.length == 0 && !item.favoritePosition)

    // To sort properly, we need to count the number of items that the item eliminated.
    // To make the amount of calculations predictable, we don't do this inside the sort, but create a map in memory.
    const nrOfEliminated = new Map<number, number>()
    possibleItemSelection.forEach((item) => nrOfEliminated.set(item.id,
      this.favoriteList.items.filter((eliminatedItem) => eliminatedItem.eliminatedBy.includes(item.id)).length))

    return possibleItemSelection
      // Sort all items in blocks based on the number of eliminated items.
      // However, also randomize all the elements inside the blocks.
      .sort((a, b) => {
        const aNrOfEliminatedItems = nrOfEliminated.get(a.id)
        const bNrOfEliminatedItems = nrOfEliminated.get(b.id)
        if (aNrOfEliminatedItems == bNrOfEliminatedItems) {
          return 0.5 - Math.random();
        } else {
          return aNrOfEliminatedItems - bNrOfEliminatedItems
        }
      })
      // Now pick the total amount of needed items.
      .slice(0, nrOfItemsToBeShownOnScreen)
  }

  private getToBeChosenItems(): FavoriteItem[] {
    return this.favoriteList.items.filter((item) => item.toBeChosen)
  }

  private getNumberOfFavoritesPicked(): number {
    return this.favoriteList.items.filter((item) => !!item.favoritePosition).length
  }

  private save() {
    this.favoriteListApi.updateList(this.favoriteList);
    this.favoriteListSubject.next(this.favoriteList);
  }

  getFavoriteList(): Observable<FavoriteList> {
    return this.favoriteListSubject.asObservable()
  }

  getNextItems(): FavoriteItem[] {
    // If we already made a selection, return that one again.
    const preChosenItems = this.getToBeChosenItems();
    if (preChosenItems.length > 0) {
      return preChosenItems;
    }

    // If the list was not yet started, we start it now.
    if (this.favoriteList.status == FavoriteListStatus.CREATED) {
      this.favoriteList.status = FavoriteListStatus.ONGOING
    }

    // If the list was finished already, we cannot start.
    if (this.favoriteList.status == FavoriteListStatus.FINISHED) {
      throw new Error('Cannot execute algorithm for a finished list.')
    }

    // Pick n items of this list (or less if there are not that many items left).
    const toBeChosenItems = this.getItemsThatCanBeChosen(this.favoriteList.nrOfItemsToBeShownOnScreen);

    // Mark all items in the list.
    toBeChosenItems.forEach((item) => {
      item.toBeChosen = true
    })

    this.save();
    return toBeChosenItems
  }

  /**
   * Executes the algorithm for picking items.
   *
   * Returns items that are picked as favorite in the previous step.
   * @param selectedFavoriteItems
   */
  selectItems(selectedFavoriteItems: FavoriteItem[]): FavoriteItem[] {
    // Retrieve all the chosen items
    const toBeChosenItems = this.getToBeChosenItems()

    // Create a list of id's from the selected favorite items.
    const selectedFavoriteItemIds = selectedFavoriteItems.map((item) => item.id)

    toBeChosenItems.forEach((item) => {
      // If the item was not selected
      if (!selectedFavoriteItems.find((selectedItem) => selectedItem.id == item.id)) {
        // Mark it as eliminated by all the selected items.
        item.eliminatedBy.push(...selectedFavoriteItemIds);
      }

      // Unmark all items, so a new list of chosen items can be picked.
      toBeChosenItems.forEach((item) => item.toBeChosen = false)
    })

    // Create a list of all favorites that can be picked this round.
    let pickedFavorites: FavoriteItem[] = []
    let favoriteIsPicked: boolean = true;
    do {
      const newFavoriteItem = this.pickFavoritesIfPossible()
      if (!!newFavoriteItem) {
        // If a favorite was picked, store it in a list that we will return.
        pickedFavorites.push(newFavoriteItem)
      } else {
        // If not, end checking for favorites.
        favoriteIsPicked = false;
      }
    } while (favoriteIsPicked)

    this.save()
    return pickedFavorites;
  }

  /**
   * Determine the position of the new favorite element if it exists.
   *
   * Returns the position that was picked. If no item was picked as a new favorite, 0 is returned.
   */
  private pickFavoritesIfPossible(): FavoriteItem {
    const toBeChosenItemsNextTime = this.getItemsThatCanBeChosen(this.favoriteList.nrOfItemsToBeShownOnScreen);

    // If more than one element is still available, we just continue.
    if (toBeChosenItemsNextTime.length > 1) {
      return undefined;
    } else if (toBeChosenItemsNextTime.length == 0) {
      // We must pick at least one element. If no elements can be picked anymore, then we are finished.
      this.favoriteList.status = FavoriteListStatus.FINISHED
      return undefined;
    }

    // A single element is left for the next choice, hence we mark it as the next favorite.
    const newFavoriteItem = toBeChosenItemsNextTime[0]
    newFavoriteItem.favoritePosition = this.getNumberOfFavoritesPicked() + 1

    // Remove the item from all the eliminatedBy lists.
    this.favoriteList.items.forEach((item) => {
      const indexOfFavoriteItem = item.eliminatedBy.indexOf(newFavoriteItem.id)
      if (indexOfFavoriteItem >= 0) {
        item.eliminatedBy.splice(indexOfFavoriteItem, 1)
      }
    })

    return newFavoriteItem
  }
}
