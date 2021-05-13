import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FavoriteListDatabase} from '../../backend/favorite-list-database';

@Component({
  selector: 'app-export-data-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Are you sure?</h4>
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

  constructor(public activeModal: NgbActiveModal,
              private favoriteListDatabase: FavoriteListDatabase) { }

  ngOnInit(): void {
  }

  export(): void {
    const blob = new Blob([this.favoriteListDatabase.getExportAsString()], {type: 'text/plain;charset=utf-8'});
    this.FileSaver.saveAs(blob, 'EliteFour.json');
    this.activeModal.close();
  }
}
