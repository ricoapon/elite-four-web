import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {FavoriteListsRepository} from '../../backend/favorite-list-interfaces';

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

      <div class="alert alert-danger" *ngIf="!!error" style="white-space: pre-line">{{error}}</div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.close()">Cancel</button>
      <button class="btn btn-primary" (click)="import()" [disabled]="importedData === undefined">Import</button>
    </div>
  `,
  styles: []
})
export class ImportDataModalComponent implements OnInit {
  fileName = '';
  importedData: string | undefined;
  error: string;

  constructor(public activeModal: NgbActiveModal,
              private favoriteListsRepository: FavoriteListsRepository,
              private router: Router) { }

  ngOnInit(): void {
  }

  import(): void {
    if (!this.favoriteListsRepository.importFromString(this.importedData)) {
      this.error = 'Could not import data. If you are sure the file is correct, contact the administrator.';
      return;
    }
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
