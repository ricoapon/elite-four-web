import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {SpotifySearch} from '../../backend/spotify/spotify-search';
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

  showSearchTextBox = false;
  searchItemName = '';
  @ViewChild('searchTextBox') searchTextBox: ElementRef;

  constructor(private route: ActivatedRoute,
              public router: Router,
              private favoriteListsRepository: FavoriteListsRepository,
              private modalService: NgbModal,
              private cdRef: ChangeDetectorRef,
              public spotifyAuthenticationState: SpotifyAuthenticationState,
              private spotifySearch: SpotifySearch,
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
      {
        key: ['cmd + f'],
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
    // Note that we do not want to override elements, as they could be inserted manually.
    for (let item of this.favoriteList.items.filter(item => !item.spotify)) {
      this.spotifySearch.searchTrack(item.name).then((track) => {

        if (track != undefined) {
          item.spotify = {
            id: track.id,
            externalUrl: track.externalUrl
          }
          this.favoriteListsRepository.updateItemForFavoriteList(this.favoriteList.id, item);
        }
      });
    }
  }

  exportToSpotifyPlaylist() {
    const sortedFilteredItems = ExportModalComponent.sortItems(this.favoriteList.items.filter(item => !!item.favoritePosition));
    this.spotifyPlaylist.create(this.favoriteList.name, sortedFilteredItems)
      .then((url) => window.open(url, '_blank').focus())
      .catch((e) => alert('Failed: ' + e))
  }
}
