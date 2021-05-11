import {Component, Input, OnInit} from '@angular/core';
import {FavoriteListApi} from "../../backend/favorite-list-api";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FavoriteItem, FavoriteList} from "../../backend/favorite-list-interfaces";

@Component({
  selector: 'app-export-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Export items</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>Items will be exported.</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" (click)="exportAll()">Export all items</button>
      <button ngbAutofocus type="button" class="btn btn-primary" (click)="exportOnlyFavorites()">Export only favorites
      </button>
    </div>
  `,
  styles: []
})
export class ExportModalComponent implements OnInit {
  @Input() listId: number;
  private favoriteList: FavoriteList
  private readonly FileSaver = require('file-saver');


  constructor(private favoriteListApi: FavoriteListApi,
              public activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.favoriteListApi.getFavoriteListById(this.listId).subscribe((list) => this.favoriteList = list)
  }

  exportOnlyFavorites() {
    const favoriteItems = this.favoriteList.items.filter((item) => !!item.favoritePosition)

    let blob = new Blob([this.createItemsAsString(favoriteItems)], {type: "text/plain;charset=utf-8"});
    this.FileSaver.saveAs(blob, "FavoriteItems.txt");
  }

  exportAll() {
    let blob = new Blob([this.createItemsAsString(this.favoriteList.items)], {type: "text/plain;charset=utf-8"});
    this.FileSaver.saveAs(blob, "AllItems.txt");
  }

  createItemsAsString(favoriteItems: FavoriteItem[]): string {
    return ExportModalComponent.sortItems(favoriteItems)
      .map((item) => item.name)
      .join('\r\n')
  }

  public static sortItems(favoriteItems: FavoriteItem[]): FavoriteItem[] {
    return favoriteItems.sort((a, b) => {
      // If both are favorites already, sort them by favorite.
      if (!!a.favoritePosition && !!b.favoritePosition) {
        return a.favoritePosition - b.favoritePosition;
      }

      // The item with a favorite is always larger.
      if (!!a.favoritePosition && !b.favoritePosition) {
        return -1;
      } else if (!a.favoritePosition && !!b.favoritePosition) {
        return 1;
      }

      // If neither is a favorite, sort by id.
      return a.id - b.id
    })
  }
}
