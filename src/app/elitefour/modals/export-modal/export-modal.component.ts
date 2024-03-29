import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FavoriteItem, FavoriteList} from '../../backend/favorite-list-interfaces';
import {FavoriteListsRepository} from '../../backend/favorite-lists-repository';

@Component({
  selector: 'app-export-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Export items</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
    </div>
    <div class="modal-body">
      <p>Items will be exported.</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" (click)="exportAll()">Export all items</button>
      <!--suppress HtmlUnknownAttribute -->
      <button ngbAutofocus type="button" class="btn btn-primary" (click)="exportOnlyFavorites()">Export only favorites
      </button>
    </div>
  `,
  styles: []
})
export class ExportModalComponent implements OnInit {

  constructor(private favoriteListsRepository: FavoriteListsRepository,
              public activeModal: NgbActiveModal) {
  }

  @Input() listId: number;
  private favoriteList: FavoriteList;
  private readonly FileSaver = require('file-saver');

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
      return a.id - b.id;
    });
  }

  ngOnInit(): void {
    this.favoriteListsRepository.getFavoriteListById(this.listId).subscribe((list) => this.favoriteList = list);
  }

  exportOnlyFavorites(): void {
    const favoriteItems = this.favoriteList.items.filter((item) => !!item.favoritePosition);

    const blob = new Blob([this.createItemsAsString(favoriteItems)], {type: 'text/plain;charset=utf-8'});
    this.FileSaver.saveAs(blob, 'FavoriteItems.txt');
  }

  exportAll(): void {
    const blob = new Blob([this.createItemsAsString(this.favoriteList.items)], {type: 'text/plain;charset=utf-8'});
    this.FileSaver.saveAs(blob, 'AllItems.txt');
  }

  createItemsAsString(favoriteItems: FavoriteItem[]): string {
    return ExportModalComponent.sortItems(favoriteItems)
      .map((item) => item.name)
      .join('\r\n');
  }
}
