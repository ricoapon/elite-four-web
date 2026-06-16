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
      <p class="text-muted mb-0">Download this list as a text file. Each item will be written on its own line.</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close()">Cancel</button>
      <button type="button" class="btn btn-outline-secondary" (click)="exportAll()">Export all items</button>
      <!--suppress HtmlUnknownAttribute -->
      <button ngbAutofocus type="button" class="btn btn-primary" (click)="exportOnlyFavorites()">Export favorites
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
    this.FileSaver.saveAs(blob, this.createFilename('FavoriteItems'));
  }

  exportAll(): void {
    const blob = new Blob([this.createItemsAsString(this.favoriteList.items)], {type: 'text/plain;charset=utf-8'});
    this.FileSaver.saveAs(blob, this.createFilename('AllItems'));
  }

  createItemsAsString(favoriteItems: FavoriteItem[]): string {
    return ExportModalComponent.sortItems(favoriteItems)
      .map((item) => item.name)
      .join('\r\n');
  }

  private createFilename(exportType: 'AllItems' | 'FavoriteItems'): string {
    return this.toFilenamePart(this.favoriteList.name) + '-' + exportType + '.txt';
  }

  private toFilenamePart(value: string): string {
    const result = value
      .trim()
      .replace(/[\s<>:"/\\|?*\x00-\x1F]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^[.-]+|[.-]+$/g, '');

    return result.length > 0 ? result : 'UntitledList';
  }
}
