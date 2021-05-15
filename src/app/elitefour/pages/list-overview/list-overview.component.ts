import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AreYouSureModalComponent, ListFormModalComponent} from '../../modals';
import {FavoriteListApi} from '../../backend/favorite-list-api';
import {FavoriteList} from '../../backend/favorite-list-interfaces';
import {ShortcutInput} from 'ng-keyboard-shortcuts';

@Component({
  selector: 'app-list-overview',
  template: `
    <app-content-header title="Lists">
      <div class="form-inline">
        <input type="text" class="form-control" style="display: inline!important; width: 200px;"
               *ngIf="showSearchTextBox" [(ngModel)]="searchListName"
               (keydown.esc)="onPressEscape()" #searchTextBox>
        <app-content-header-button class="" (click)="openAddNewListModal()"><u>N</u>ew</app-content-header-button>
      </div>
    </app-content-header>

    <ng-keyboard-shortcuts [shortcuts]="shortcuts"></ng-keyboard-shortcuts>

    <app-card-list *ngFor="let favoriteList of sortedAndFiltered(favoriteLists)"
                   [title]="favoriteList.name"
                   (delete)="deleteList(favoriteList.id)"
                   (info)="navigateToList(favoriteList.id)">{{favoriteList.status}}</app-card-list>
  `,
  styles: []
})
export class ListOverviewComponent implements OnInit, AfterViewInit {
  favoriteLists: FavoriteList[] = [];
  showSearchTextBox = false;
  searchListName = '';
  @ViewChild('searchTextBox') searchTextBox: ElementRef;

  constructor(private router: Router,
              private favoriteListApi: FavoriteListApi,
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
    this.showSearchTextBox = false;
    this.searchListName = '';
  }

  toggleSearchTextBox(): void {
    this.showSearchTextBox = !this.showSearchTextBox;
    if (!this.showSearchTextBox) {
      this.searchListName = '';
    } else {
      this.cdRef.detectChanges();
      this.searchTextBox.nativeElement.focus();
    }
  }

  ngOnInit(): void {
    this.favoriteListApi.getFavoriteLists().subscribe((favoriteLists) => {
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
        this.favoriteListApi.deleteFavoriteList(listId);
      }
    }, () => {
    });
  }

  navigateToList(listId: number): void {
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate(['/list/' + listId]);
  }

  sortedAndFiltered(favoriteLists: FavoriteList[]): FavoriteList[] {
    // Newest lists must be on top.
    const sortedList = favoriteLists.sort((a, b) => {
      return new Date(b.tsCreated).getTime() - new Date(a.tsCreated).getTime();
    });

    // If we have our search enabled, filter the result.
    if (this.showSearchTextBox) {
      return sortedList.filter((list) => list.name.indexOf(this.searchListName) >= 0);
    }

    return sortedList;
  }

}
