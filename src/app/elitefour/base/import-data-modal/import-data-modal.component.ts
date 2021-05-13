import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FavoriteListDatabase} from '../../backend/favorite-list-database';

@Component({
  selector: 'app-import-data-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Are you sure?</h4>
    </div>
    <div class="modal-body">
      <p>All the data for this application gets stored inside the browser. To not lose this data or to copy this over to another computer,
        you can download the data.</p>
      <label class="btn btn-primary">
        <!--suppress TypeScriptUnresolvedVariable -->
        Browse <input type="file" hidden (change)="handleFileInput($event.target.files)">
      </label>
      <label class="pl-2">
        {{fileName}}
      </label>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.close()">Cancel</button>
      <button class="btn btn-primary" (click)="import()">Import</button>
    </div>
  `,
  styles: []
})
export class ImportDataModalComponent implements OnInit {
  fileName = '';
  importedData: string;

  constructor(public activeModal: NgbActiveModal,
              private favoriteListDatabase: FavoriteListDatabase) { }

  ngOnInit(): void {
  }

  import(): void {
    this.favoriteListDatabase.importDataAsString(this.importedData);
    this.activeModal.close();
  }

  handleFileInput(files: FileList): void {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.importedData = fileReader.result.toString();
    };

    const fileToUpload = files.item(0);
    this.fileName = fileToUpload.name;
    fileReader.readAsText(fileToUpload);
  }
}
