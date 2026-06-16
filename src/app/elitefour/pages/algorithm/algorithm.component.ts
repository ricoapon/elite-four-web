import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FavoritePickerAlgorithm} from '../../backend/favorite-picker-algorithm.service';
import {FavoriteItem, FavoriteList, FavoriteListStatus} from '../../backend/favorite-list-interfaces';
import {FavoriteListsRepository} from '../../backend/favorite-lists-repository';

type PickerColumnLayout = 'auto' | '2' | '3' | '4' | '5';

type PickerColumnOption = {
  value: PickerColumnLayout,
  label: string,
  ariaLabel: string
};

@Component({
  selector: 'app-algorithm',
  templateUrl: './algorithm.component.html',
  styleUrls: ['./algorithm.component.css']
})
export class AlgorithmComponent implements OnInit {
  private static readonly PICKER_COLUMN_LAYOUT_STORAGE_KEY = 'elite-four-picker-column-layout';

  favoriteList: FavoriteList;
  toBeChosenItems: FavoriteItem[];
  selectedItems: FavoriteItem[];
  newFavorites: FavoriteItem[] = [];
  pickerColumnLayout: PickerColumnLayout = 'auto';
  readonly pickerColumnOptions: PickerColumnOption[] = [
    {value: 'auto', label: 'Auto', ariaLabel: 'Use automatic picker columns'},
    {value: '2', label: '2', ariaLabel: 'Use two picker columns'},
    {value: '3', label: '3', ariaLabel: 'Use three picker columns'},
    {value: '4', label: '4', ariaLabel: 'Use four picker columns'},
    {value: '5', label: '5', ariaLabel: 'Use five picker columns'}
  ];
  private algorithm: FavoritePickerAlgorithm;

  constructor(private route: ActivatedRoute,
              public router: Router,
              private favoriteListsRepository: FavoriteListsRepository) {
  }

  ngOnInit(): void {
    this.pickerColumnLayout = this.loadPickerColumnLayout();

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

  progressPercentage(): number {
    if (!this.favoriteList || this.favoriteList.items.length === 0) {
      return 0;
    }

    const nrOfFavoriteItemsPicked = this.favoriteList.items.filter((item) => !!item.favoritePosition).length;

    return 100 * (nrOfFavoriteItemsPicked / this.favoriteList.items.length);
  }

  setPickerColumnLayout(pickerColumnLayout: PickerColumnLayout): void {
    this.pickerColumnLayout = pickerColumnLayout;
    localStorage.setItem(AlgorithmComponent.PICKER_COLUMN_LAYOUT_STORAGE_KEY, pickerColumnLayout);
  }

  private loadPickerColumnLayout(): PickerColumnLayout {
    const storedPickerColumnLayout = localStorage.getItem(AlgorithmComponent.PICKER_COLUMN_LAYOUT_STORAGE_KEY);

    return this.isPickerColumnLayout(storedPickerColumnLayout) ? storedPickerColumnLayout : 'auto';
  }

  private isPickerColumnLayout(value: string | null): value is PickerColumnLayout {
    return this.pickerColumnOptions.some((option) => option.value === value);
  }
}
