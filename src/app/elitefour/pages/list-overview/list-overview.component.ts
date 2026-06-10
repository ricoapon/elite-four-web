import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AreYouSureModalComponent, ListFormModalComponent} from '../../modals';
import {FavoriteList, FavoriteListStatus} from '../../backend/favorite-list-interfaces';
import {ShortcutInput} from 'ng-keyboard-shortcuts';
import {FavoriteListsRepository} from '../../backend/favorite-lists-repository';

@Component({
  selector: 'app-list-overview',
  templateUrl: './list-overview.component.html',
  styles: []
})
export class ListOverviewComponent implements OnInit, AfterViewInit {
  favoriteLists: FavoriteList[] = [];
  searchListName = '';
  listFilter: 'all' | 'active' | 'finished' = 'all';
  @ViewChild('searchTextBox') searchTextBox: ElementRef;

  constructor(private router: Router,
              private favoriteListsRepository: FavoriteListsRepository,
              private modalService: NgbModal,
              private cdRef: ChangeDetectorRef) {
    this.navigateToList = this.navigateToList.bind(this);
  }

  shortcuts: ShortcutInput[] = [];

  ngAfterViewInit(): void {
    this.shortcuts.push(
      {
        key: ['n'],
        label: 'New item',
        description: 'New item',
        command: () => this.openAddNewListModal(),
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
    this.searchListName = '';
  }

  toggleSearchTextBox(): void {
    this.cdRef.detectChanges();
    if (this.searchTextBox) {
      this.searchTextBox.nativeElement.focus();
      this.searchTextBox.nativeElement.select();
    }
  }

  ngOnInit(): void {
    this.favoriteListsRepository.getFavoriteLists().subscribe((favoriteLists) => {
      this.favoriteLists = favoriteLists;
    });
  }

  openAddNewListModal(): void {
    this.modalService.open(ListFormModalComponent);
  }

  deleteList(listId: number): void {
    const modalRef = this.modalService.open(AreYouSureModalComponent);
    modalRef.result.then((result) => {
      if (result) {
        this.favoriteListsRepository.deleteFavoriteList(listId);
      }
    }, () => {
    });
  }

  navigateToList(listId: number): void {
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate(['/list/' + listId]);
  }

  setListFilter(listFilter: 'all' | 'active' | 'finished'): void {
    this.listFilter = listFilter;
  }

  sortedAndFiltered(favoriteLists: FavoriteList[]): FavoriteList[] {
    // Newest lists must be on top.
    let sortedList = [...favoriteLists].sort((a, b) => {
      return new Date(b.tsCreated).getTime() - new Date(a.tsCreated).getTime();
    });

    if (this.listFilter === 'active') {
      sortedList = sortedList.filter((list) => list.status !== FavoriteListStatus.FINISHED);
    } else if (this.listFilter === 'finished') {
      sortedList = sortedList.filter((list) => list.status === FavoriteListStatus.FINISHED);
    }

    if (this.searchListName.trim().length > 0) {
      const searchListName = this.searchListName.toLowerCase();
      sortedList = sortedList.filter((list) => list.name.toLowerCase().indexOf(searchListName) >= 0);
    }

    return sortedList;
  }

  statusBadgeClass(favoriteList: FavoriteList): string {
    if (favoriteList.status === FavoriteListStatus.FINISHED) {
      return 'text-bg-success';
    } else if (favoriteList.status === FavoriteListStatus.ONGOING) {
      return 'text-bg-primary';
    }

    return 'text-bg-secondary';
  }

  determineNumberOfFavoriteItemsPicked(favoriteList: FavoriteList): number {
    return favoriteList.items.filter((item) => !!item.favoritePosition).length;
  }
}
