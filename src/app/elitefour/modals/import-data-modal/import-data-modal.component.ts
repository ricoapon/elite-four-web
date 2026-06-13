import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {FavoriteListsRepository} from '../../backend/favorite-lists-repository';

@Component({
  selector: 'app-import-data-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Import data</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
    </div>
    <div class="modal-body">
      <p class="text-muted pb-2">
        Import a previously exported Elite Four data file. This replaces the data stored in this browser.
      </p>
      <label class="btn btn-outline-secondary">
        <!--suppress TypeScriptUnresolvedVariable -->
        Browse <input type="file" hidden (change)="handleFileInput($event.target.files)">
      </label>
      <label class="ps-2 text-muted">
        {{fileName}}
      </label>

      <div class="alert alert-danger mt-2 mb-0" *ngIf="!!error">
        <div *ngFor="let errorLine of errorLines()">{{errorLine}}</div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close()">Cancel</button>
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

  errorLines(): string[] {
    return this.error.split('\n');
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
