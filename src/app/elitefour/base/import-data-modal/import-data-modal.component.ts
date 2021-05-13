import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FavoriteListApi} from '../../backend/favorite-list-api';
import {Router} from '@angular/router';

@Component({
  selector: 'app-import-data-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Import data</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
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
              private favoriteListApi: FavoriteListApi,
              private router: Router) { }

  ngOnInit(): void {
  }

  import(): void {
    this.favoriteListApi.importFromString(this.importedData);
    this.activeModal.close();
    this.router.navigate(['/']);
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
