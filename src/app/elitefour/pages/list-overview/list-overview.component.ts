import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ListFormModalComponent} from "../../base/list-form-modal/list-form-modal.component";
import {FavoriteListApi} from "../../backend/favorite-list-api";
import {FavoriteList} from "../../backend/favorite-list-interfaces";
import {AreYouSureModalComponent} from "../../base/are-you-sure-modal/are-you-sure-modal.component";
import {ShortcutInput} from "ng-keyboard-shortcuts";

@Component({
  selector: 'app-list-overview',
  template: `
    <app-content-header title="Lists">
      <div class="form-inline">
        <input type="text" class="form-control" style="display: inline!important; width: 200px;"
               *ngIf="showSearchTextbox" [(ngModel)]="searchListName"
               (keydown.esc)="onPressEscape()" #searchTextbox>
        <app-content-header-button class="" (click)="openAddNewListModal()"><u>N</u>ew</app-content-header-button>
      </div>
    </app-content-header>

    <ng-keyboard-shortcuts [shortcuts]="shortcuts"></ng-keyboard-shortcuts>

    <app-card-list *ngFor="let favoriteList of sortedAndFiltered(favoriteLists)"
                   [title]="favoriteList.name"
                   (onDelete)="deleteList(favoriteList.id)"
                   (onInfo)="navigateToList(favoriteList.id)">{{favoriteList.status}}</app-card-list>
  `,
  styles: []
})
export class ListOverviewComponent implements OnInit, AfterViewInit {
  favoriteLists: FavoriteList[];
  showSearchTextbox: boolean = false;
  searchListName: string = ''
  @ViewChild('searchTextbox') searchTextbox: ElementRef

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
        key: ["n"],
        label: "New item",
        description: "New item",
        command: () => this.openAddNewListModal(),
        preventDefault: true
      },
      {
        key: ["cmd + f"],
        label: "Search list",
        description: "Search list",
        command: () => this.toggleSearchTextbox(),
        preventDefault: true
      },
      {
        key: ["esc"],
        label: "Escape",
        description: "Escape",
        command: () => this.onPressEscape(),
        preventDefault: true
      },
    );
  }

  onPressEscape() {
    this.showSearchTextbox = false;
    this.searchListName = ''
  }

  toggleSearchTextbox() {
    this.showSearchTextbox = !this.showSearchTextbox;
    if (!this.showSearchTextbox) {
      this.searchListName = ''
    } else {
      this.cdRef.detectChanges()
      this.searchTextbox.nativeElement.focus();
    }
  }

  ngOnInit(): void {
    this.favoriteListApi.getFavoriteLists().subscribe((favoriteLists) => {
      this.favoriteLists = favoriteLists;
    })
  }

  openAddNewListModal() {
    this.modalService.open(ListFormModalComponent);
  }

  deleteList(listId: number) {
    const modalRef = this.modalService.open(AreYouSureModalComponent)
    modalRef.result.then((result) => {
      if (result) {
        this.favoriteListApi.deleteFavoriteList(listId)
      }
    }, () => {
    })
  }

  navigateToList(listId: number) {
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate(['/list/' + listId]);
  }

  sortedAndFiltered(favoriteLists: FavoriteList[]) {
    // Newest lists must be on top.
    const sortedList = favoriteLists.sort((a, b) => {
      return new Date(b.tsCreated).getTime() - new Date(a.tsCreated).getTime()
    })

    // If we have our search enabled, filter the result.
    if (this.showSearchTextbox) {
      return sortedList.filter((list) => list.name.indexOf(this.searchListName) >= 0)
    }

    return sortedList;
  }

}
