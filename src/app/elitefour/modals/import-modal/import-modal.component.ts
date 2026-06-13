import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FavoriteList} from '../../backend/favorite-list-interfaces';
import {FavoriteListsRepository} from '../../backend/favorite-lists-repository';

@Component({
  selector: 'app-import-form-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Import items</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
    </div>
    <div class="modal-body">
      <div class="mb-3">
        <p class="text-muted pb-2">Import a text file where each non-empty line becomes one item.</p>
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
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close()">Cancel</button>
      <!--suppress HtmlUnknownAttribute -->
      <button ngbAutofocus type="button" class="btn btn-primary" (click)="importFile()" [disabled]="!!error || itemsToUpload.length == 0">Import</button>
    </div>
  `,
  styles: []
})
export class ImportModalComponent implements OnInit {
  @Input() listId: number;
  private favoriteList: FavoriteList;
  itemsToUpload: string[] = [];
  fileName = '';
  error: string;

  constructor(public activeModal: NgbActiveModal,
              private favoriteListsRepository: FavoriteListsRepository) {
  }

  ngOnInit(): void {
    this.favoriteListsRepository.getFavoriteListById(this.listId).subscribe((list) => this.favoriteList = list);
  }

  handleFileInput(files: FileList): void {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.itemsToUpload = fileReader.result.toString()
        .replace('\r', '')
        .split('\n')
        .map((name) => name.trim())
        .filter((name) => name.length > 0);
      this.checkImportFile();
    };

    const fileToUpload = files.item(0);
    this.fileName = fileToUpload.name;
    fileReader.readAsText(fileToUpload);
  }

  private checkImportFile(): void {
    const errorMessages: string[] = [];
    this.itemsToUpload.forEach((newItem) => {
      if (!!this.favoriteList.items.find((item) => item.name === newItem)) {
        errorMessages.push('"' + newItem + '" already exists');
      }
    });

    this.error = errorMessages.join('\n');
  }

  errorLines(): string[] {
    return this.error.split('\n');
  }

  importFile(): void {
    this.itemsToUpload.forEach((newItem) => {
      this.favoriteListsRepository.addItemToFavoriteList(this.favoriteList.id, newItem);
    });
    this.activeModal.close();
  }
}
