import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FavoriteItemApi} from "../../backend/favorite-item-api";
import {FavoriteItem, FavoriteList, FavoriteListStatus} from "../../backend/favorite-list-interfaces";

@Component({
  selector: 'app-algorithm',
  templateUrl: './algorithm.component.html',
  styleUrls: ['./algorithm.component.css']
})
export class AlgorithmComponent implements OnInit {
  favoriteList: FavoriteList
  toBeChosenItems: FavoriteItem[]
  private selectedItems: FavoriteItem[]
  newFavorites: FavoriteItem[] = []

  constructor(private route: ActivatedRoute,
              public router: Router,
              private favoriteItemApi: FavoriteItemApi) {
  }

  ngOnInit(): void {
    const listId = +this.route.snapshot.paramMap.get('id');
    this.favoriteItemApi.initialize(listId);
    this.favoriteItemApi.getFavoriteList().subscribe((list) => this.favoriteList = list)
    this.initializeNextStep()
  }

  private initializeNextStep() {
    // If the list is finished, we automatically redirect to the main screen.
    if (this.favoriteList.status == FavoriteListStatus.FINISHED) {
      this.router.navigate(['/list/' + this.favoriteList.id])
    } else {
      this.selectedItems = []
      this.toBeChosenItems = this.favoriteItemApi.getNextItems();
    }
  }

  skip() {
    // Skipping is the same as selecting all the items.
    this.favoriteItemApi.selectItems(this.toBeChosenItems)
    this.initializeNextStep()
  }

  select() {
    this.newFavorites = this.favoriteItemApi.selectItems(this.selectedItems)
    this.initializeNextStep()
  }

  clickItem(item: FavoriteItem) {
    // Toggle the selection of the item.
    const indexOfItem = this.selectedItems.indexOf(item);
    if (indexOfItem >= 0) {
      // Remove the item from the list.
      this.selectedItems.splice(indexOfItem, 1)
    } else {
      // Add the item to the list.
      this.selectedItems.push(item);
    }
  }

  isItemSelected(item: FavoriteItem) {
    return this.selectedItems.includes(item);
  }
}
