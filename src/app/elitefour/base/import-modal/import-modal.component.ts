import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FavoriteListApi} from "../../backend/favorite-list-api";
import {FavoriteList} from "../../backend/favorite-list-interfaces";
import {ElectronService} from "../../../core/services";

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
      <button ngbAutofocus type="button" class="btn btn-primary" (click)="importFile()" [disabled]="!!error || itemsToUpload.length == 0">Import</button>
    </div>
  `,
  styles: []
})
export class ImportModalComponent implements OnInit {
  @Input() listId: number;
  private favoriteList: FavoriteList
  private fs: any;
  itemsToUpload: string[] = [];
  fileName: string = ''
  error: string;

  constructor(public activeModal: NgbActiveModal,
              private favoriteListApi: FavoriteListApi,
              private electronService: ElectronService) {
    this.fs = electronService.fs
  }

  ngOnInit(): void {
    this.favoriteListApi.getFavoriteListById(this.listId).subscribe((list) => this.favoriteList = list)
  }

  handleFileInput(files: FileList) {
    let fileToUpload = files.item(0);
    this.fileName = fileToUpload.name
    this.itemsToUpload = this.fs.readFileSync(fileToUpload.path).toString('utf8')
      .replace('\r', '')
      .split('\n')
      .map((name) => name.trim())
      .filter((name) => name.length > 0)
    this.checkImportFile();
  }

  private checkImportFile() {
    let errorMessages: string[] = []
    this.itemsToUpload.forEach((newItem) => {
      if (!!this.favoriteList.items.find((item) => item.name == newItem)) {
        errorMessages.push('"' + newItem + '" already exists')
      }
    })

    this.error = errorMessages.join('\n');
  }

  importFile() {
    this.itemsToUpload.forEach((newItem) => {
      this.favoriteListApi.addItemToFavoriteList(this.favoriteList.id, newItem);
    })
    this.activeModal.close()
  }
}
