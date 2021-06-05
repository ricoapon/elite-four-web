import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FavoritePickerAlgorithm} from '../../backend/favorite-picker-algorithm.service';
import {FavoriteItem, FavoriteList, FavoriteListStatus} from '../../backend/favorite-list-interfaces';
import {FavoriteListsRepository} from '../../backend/favorite-lists-repository';

@Component({
  selector: 'app-algorithm',
  templateUrl: './algorithm.component.html',
  styleUrls: ['./algorithm.component.css']
})
export class AlgorithmComponent implements OnInit {
  favoriteList: FavoriteList;
  toBeChosenItems: FavoriteItem[];
  private selectedItems: FavoriteItem[];
  newFavorites: FavoriteItem[] = [];
  private algorithm: FavoritePickerAlgorithm;

  constructor(private route: ActivatedRoute,
              public router: Router,
              private favoriteListsRepository: FavoriteListsRepository) {
  }

  ngOnInit(): void {
    const listId = +this.route.snapshot.paramMap.get('id');
    this.algorithm = new FavoritePickerAlgorithm(this.favoriteListsRepository, listId);
    this.favoriteListsRepository.getFavoriteListById(listId).subscribe((list) => this.favoriteList = list);
    this.initializeNextStep();
  }

  private initializeNextStep(): void {
    // If the list is finished, we automatically redirect to the main screen.
    if (this.favoriteList.status === FavoriteListStatus.FINISHED) {
      this.router.navigate(['/list/' + this.favoriteList.id]);
    } else {
      this.selectedItems = [];
      this.toBeChosenItems = this.algorithm.getNextItems();
    }
  }

  skip(): void {
    // Skipping is the same as selecting all the items.
    this.algorithm.selectItems(this.toBeChosenItems);
    this.initializeNextStep();
  }

  select(): void {
    this.newFavorites = this.algorithm.selectItems(this.selectedItems);
    this.initializeNextStep();
  }

  clickItem(item: FavoriteItem): void {
    // Toggle the selection of the item.
    const indexOfItem = this.selectedItems.indexOf(item);
    if (indexOfItem >= 0) {
      // Remove the item from the list.
      this.selectedItems.splice(indexOfItem, 1);
    } else {
      // Add the item to the list.
      this.selectedItems.push(item);
    }
  }

  isItemSelected(item: FavoriteItem): boolean {
    return this.selectedItems.includes(item);
  }
}
