import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FavoriteItem, FavoriteList, FavoriteListStatus} from '../../backend/favorite-list-interfaces';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  AreYouSureModalComponent,
  ExportModalComponent,
  ImportModalComponent,
  ItemFormModalComponent,
  ListFormModalComponent
} from '../../modals';
import {ShortcutInput} from 'ng-keyboard-shortcuts';
import {FavoriteListsRepository} from '../../backend/favorite-lists-repository';
import {SpotifyAuthenticationState} from '../../backend/spotify/spotify-authentication-state';
import {SpotifyPlaylist} from '../../backend/spotify/spotify-playlist';

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

  searchItemName = '';
  @ViewChild('searchTextBox') searchTextBox: ElementRef;
  showSpotifyUnmatchedOnly = false;

  quickAddText = '';
  quickAddError = '';

  constructor(private route: ActivatedRoute,
              public router: Router,
              private favoriteListsRepository: FavoriteListsRepository,
              private modalService: NgbModal,
              public spotifyAuthenticationState: SpotifyAuthenticationState,
              private spotifyPlaylist: SpotifyPlaylist) {
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
    );
  }

  ngOnInit(): void {
    const listId = +this.route.snapshot.paramMap.get('id');
    this.favoriteListsRepository.getFavoriteListById(listId)
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
    modalRef.componentInstance.canEditName = this.favoriteList.status == this.CREATED

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
        this.favoriteListsRepository.deleteFavoriteList(this.favoriteList.id);
        this.router.navigate(['/']);
      }
    }, () => {
    });
  }

  deleteItem(itemId: number): void {
    const modalRef = this.modalService.open(AreYouSureModalComponent);
    modalRef.result.then((result) => {
      if (result) {
        this.favoriteListsRepository.deleteItemFromFavoriteList(this.favoriteList.id, itemId);
      }
    }, () => {
    });
  }

  sortAndFilter(favoriteItems: FavoriteItem[]): FavoriteItem[] {
    let sortedItems = ExportModalComponent.sortItems([...favoriteItems]);

    if (this.showSpotifyUnmatchedOnly) {
      sortedItems = sortedItems.filter((item) => !item.spotify);
    }

    const normalizedSearchItemName = this.searchItemName.trim().toLowerCase();
    if (normalizedSearchItemName.length > 0) {
      sortedItems = sortedItems.filter((item) => item.name.toLowerCase().indexOf(normalizedSearchItemName) >= 0);
    }

    return sortedItems;
  }

  parseQuickAddItems(): string[] {
    return this.quickAddText
      .replace(/\r/g, '')
      .split('\n')
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
  }

  quickAddItemCount(): number {
    return this.parseQuickAddItems().length;
  }

  addQuickItems(): void {
    this.quickAddError = '';
    const quickAddItems = this.parseQuickAddItems();
    if (quickAddItems.length === 0) {
      return;
    }

    const duplicateInputItem = quickAddItems.find((item, index) => quickAddItems.indexOf(item) !== index);
    if (duplicateInputItem) {
      this.quickAddError = '"' + duplicateInputItem + '" appears more than once in this batch.';
      return;
    }

    const existingItem = quickAddItems.find((item) => this.favoriteList.items.some((existing) => existing.name === item));
    if (existingItem) {
      this.quickAddError = '"' + existingItem + '" already exists in this list.';
      return;
    }

    try {
      quickAddItems.forEach((item) => this.favoriteListsRepository.addItemToFavoriteList(this.favoriteList.id, item));
      this.quickAddText = '';
    } catch (error) {
      this.quickAddError = error.message;
    }
  }

  resetAlgorithm(): void {
    const modalRef = this.modalService.open(AreYouSureModalComponent);
    modalRef.componentInstance.body =
      'Resetting the algorithm will clear all the favorites you picked and set the status of the list to created. ' +
      'No items will be deleted.';
    modalRef.result.then((result) => {
      if (result) {
        // Reset algorithm by clearing fields on all items.
        this.favoriteListsRepository.modify((favoriteLists: FavoriteList[]) => {
          const favoriteList: FavoriteList = favoriteLists.find(x => x.id === this.favoriteList.id);
          favoriteList.status = FavoriteListStatus.CREATED;
          favoriteList.items.forEach((item) => {
            item.favoritePosition = undefined;
            item.eliminatedBy = [];
            item.toBeChosen = false;
          });
        });
      }
    }, () => {
    });
  }

  removeAllItems(): void {
    const modalRef = this.modalService.open(AreYouSureModalComponent);
    modalRef.result.then((result) => {
      if (result) {
        this.favoriteListsRepository.removeAllItems(this.favoriteList.id);
      }
    }, () => {
    });
  }

  matchSpotifyItems(): void {
    this.router.navigate(['/list/' + this.favoriteList.id + '/spotify-match']);
  }

  exportToSpotifyPlaylist() {
    const sortedFilteredItems = ExportModalComponent.sortItems(this.favoriteList.items
      .filter(item => !!item.favoritePosition)
      .filter(item => !!item.spotify));

    if (sortedFilteredItems.length == 0) {
      alert('The list contains 0 sorted items, so no Spotify playlist can be created.')
      return
    }

    this.spotifyPlaylist.create(this.favoriteList.name, sortedFilteredItems)
      .then((url) => window.open(url, '_blank').focus())
  }

  changeCheckbox(event: any) {
    this.showSpotifyUnmatchedOnly = event.currentTarget.checked;
  }
}
