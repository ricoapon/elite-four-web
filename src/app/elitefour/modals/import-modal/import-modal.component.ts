import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FavoriteList} from '../../backend/favorite-list-interfaces';
import {FavoriteListsRepository} from '../../backend/favorite-lists-repository';

@Component({
  selector: 'app-import-form-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Import items</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-group mb-0">
        <p>Import a file where each line will be parsed as an item.</p>
        <label class="btn btn-primary">
          <!--suppress TypeScriptUnresolvedVariable -->
          Browse <input type="file" hidden (change)="handleFileInput($event.target.files)">
        </label>
        <label class="pl-2">
          {{fileName}}
        </label>

        <div class="alert alert-danger" *ngIf="!!error" style="white-space: pre-line">{{error}}</div>
      </div>
    </div>
    <div class="modal-footer">
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

  importFile(): void {
    this.itemsToUpload.forEach((newItem) => {
      this.favoriteListsRepository.addItemToFavoriteList(this.favoriteList.id, newItem);
    });
    this.activeModal.close();
  }
}
