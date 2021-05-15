import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FavoriteItem, FavoriteList, FavoriteListStatus} from '../../backend/favorite-list-interfaces';
import {FavoriteListApi} from '../../backend/favorite-list-api';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ItemFormModalComponent} from '../../base/item-form-modal/item-form-modal.component';
import {AreYouSureModalComponent} from '../../modals';
import {ListFormModalComponent} from '../../base/list-form-modal/list-form-modal.component';
import {ExportModalComponent} from '../../modals';
import {ImportModalComponent} from '../../base/import-modal/import-modal.component';
import {ShortcutInput} from 'ng-keyboard-shortcuts';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styles: []
})
export class ListDetailComponent implements OnInit, AfterViewInit {
  // A field has to be created, otherwise it cannot be used in the HTML template.
  readonly CREATED = FavoriteListStatus.CREATED;
  readonly ONGOING = FavoriteListStatus.ONGOING;
  readonly FINISHED = FavoriteListStatus.FINISHED;

  favoriteList: FavoriteList = {id: 0, name: '', status: undefined, tsCreated: new Date(), items: [], nrOfItemsToBeShownOnScreen: 20};

  showSearchTextBox = false;
  searchItemName = '';
  @ViewChild('searchTextBox') searchTextBox: ElementRef;

  constructor(private route: ActivatedRoute,
              public router: Router,
              private favoriteListApi: FavoriteListApi,
              private modalService: NgbModal,
              private cdRef: ChangeDetectorRef) {
  }

  shortcuts: ShortcutInput[] = [];
  ngAfterViewInit(): void {
    this.shortcuts.push(
      {
        key: ['n'],
        label: 'New item',
        description: 'N',
        command: () => this.openItemModal(undefined),
        preventDefault: true
      },
      {
        key: ['shift + f'],
        label: 'Search list',
        description: 'Search list',
        command: () => this.toggleSearchTextBox(),
        preventDefault: true
      },
      {
        key: ['esc'],
        label: 'Escape',
        description: 'Escape',
        command: () => this.onPressEscape(),
        preventDefault: true
      },
    );
  }

  onPressEscape(): void {
    this.showSearchTextBox = false;
    this.searchItemName = '';
  }

  toggleSearchTextBox(): void {
    this.showSearchTextBox = !this.showSearchTextBox;
    if (!this.showSearchTextBox) {
      this.searchItemName = '';
    } else {
      this.cdRef.detectChanges();
      this.searchTextBox.nativeElement.focus();
    }
  }

  ngOnInit(): void {
    const listId = +this.route.snapshot.paramMap.get('id');
    this.favoriteListApi.getFavoriteListById(listId)
      .subscribe((favoriteList) => {
        this.favoriteList = favoriteList;
      });
  }

  determineNumberOfFavoriteItemsPicked(): number {
    return this.favoriteList.items.filter((item) => !!item.favoritePosition).length;
  }

  openItemModal(favoriteItem: FavoriteItem): void {
    const modalRef = this.modalService.open(ItemFormModalComponent);
    modalRef.componentInstance.listId = this.favoriteList.id;

    if (!!favoriteItem) {
      modalRef.componentInstance.favoriteItem = favoriteItem;
    }
  }

  openListModal(): void {
    const modalRef = this.modalService.open(ListFormModalComponent);
    modalRef.componentInstance.favoriteList = this.favoriteList;
  }

  openExportModal(): void {
    const modalRef = this.modalService.open(ExportModalComponent);
    modalRef.componentInstance.listId = this.favoriteList.id;
  }

  openImportModal(): void {
    const modalRef = this.modalService.open(ImportModalComponent);
    modalRef.componentInstance.listId = this.favoriteList.id;
  }

  deleteList(): void {
    const modalRef = this.modalService.open(AreYouSureModalComponent);
    modalRef.result.then((result) => {
      if (result) {
        this.favoriteListApi.deleteFavoriteList(this.favoriteList.id);
        this.router.navigate(['/']);
      }}, () => {});
  }

  deleteItem(itemId: number): void {
    const modalRef = this.modalService.open(AreYouSureModalComponent);
    modalRef.result.then((result) => {
      if (result) {
        this.favoriteListApi.deleteItemFromFavoriteList(this.favoriteList.id, itemId);
      }}, () => {});
  }

  sortAndFilter(favoriteItems: FavoriteItem[]): FavoriteItem[] {
    const sortedItems = ExportModalComponent.sortItems(favoriteItems);

    if (this.showSearchTextBox) {
      return sortedItems.filter((item) => item.name.indexOf(this.searchItemName) >= 0);
    }

    return sortedItems;
  }

  resetAlgorithm(): void {
    const modalRef = this.modalService.open(AreYouSureModalComponent);
    modalRef.componentInstance.body =
      'Resetting the algorithm will clear all the favorites you picked and set the status of the list to created. ' +
      'No items will be deleted.';
    modalRef.result.then((result) => {
      if (result) {
        this.favoriteListApi.resetAlgorithm(this.favoriteList.id);
      }}, () => {});
  }

  removeAllItems(): void {
    const modalRef = this.modalService.open(AreYouSureModalComponent);
    modalRef.result.then((result) => {
      if (result) {
        this.favoriteListApi.removeAllItems(this.favoriteList.id);
      }}, () => {});
  }
}

