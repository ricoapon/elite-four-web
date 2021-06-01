import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FavoriteList, FavoriteListsRepository} from '../../backend/favorite-list-interfaces';

@Component({
  selector: 'app-export-data-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Export data</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      All the data for this application gets stored inside the browser. To not lose this data or to copy this over to another computer,
      you can download the data.
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.close()">Cancel</button>
      <button class="btn btn-primary" (click)="export()">Export</button>
    </div>
  `,
  styles: []
})
export class ExportDataModalComponent implements OnInit {
  private readonly FileSaver = require('file-saver');
  private favoriteLists: FavoriteList[];

  constructor(public activeModal: NgbActiveModal,
              private favoriteListsRepository: FavoriteListsRepository) { }

  ngOnInit(): void {
    this.favoriteListsRepository.getFavoriteLists().subscribe((favoriteLists) => this.favoriteLists = favoriteLists);
  }

  export(): void {
    const blob = new Blob([JSON.stringify(this.favoriteLists)], {type: 'text/plain;charset=utf-8'});
    this.FileSaver.saveAs(blob, 'EliteFour.json');
    this.activeModal.close();
  }
}
