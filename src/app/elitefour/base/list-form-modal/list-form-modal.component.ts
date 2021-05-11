import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FavoriteListApi} from "../../backend/favorite-list-api";
import {FavoriteList, FavoriteListStatus} from "../../backend/favorite-list-interfaces";

@Component({
  selector: 'app-add-list-form',
  template: `
    <form (ngSubmit)="f.form.valid && onSubmit()" #f="ngForm" [appForbiddenListName]="['listName', 'initialListName']" novalidate>
      <div class="modal-header">
        <h4 class="modal-title" *ngIf="!isEditMode">Add a new list</h4>
        <h4 class="modal-title" *ngIf="isEditMode">Edit list</h4>
        <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="listName">List name</label>
          <!--suppress HtmlUnknownAttribute -->
          <input ngbAutofocus type="text" class="form-control" id="listName" #listNameModel="ngModel"
                 [(ngModel)]="listName"
                 name="listName" [ngClass]="{ 'is-invalid': f.submitted && listNameModel.invalid }" required>
          <input type="hidden" [(ngModel)]="initialListName" #initialListNameModel="ngModel" id="initialListName"
                 name="initialListName">
          <div *ngIf="f.submitted && listNameModel.invalid" class="invalid-feedback">
            <div *ngIf="listNameModel.errors.required">Name is required</div>
            <div *ngIf="listNameModel.errors.forbiddenName">Name already exists</div>
          </div>
        </div>
        <div class="form-group">
          <label for="nrOfItemsToBeShownOnScreen">Maximal number of items to show on screen</label>
          <input type="number" class="form-control" id="nrOfItemsToBeShownOnScreen"
                 [(ngModel)]="nrOfItemsToBeShownOnScreen" name="nrOfItemsToBeShownOnScreen"
                 [ngClass]="{ 'is-invalid': f.submitted && nrOfItemsToBeShownOnScreenModel.invalid }"
                 [disabled]="isNrOfItemsToBeShownOnScreensDisabled()"
                 #nrOfItemsToBeShownOnScreenModel="ngModel" customMin="2">
          <div *ngIf="nrOfItemsToBeShownOnScreenModel.invalid" class="invalid-feedback">
            <div *ngIf="nrOfItemsToBeShownOnScreenModel.errors.customMin">Should be at least 2</div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" (click)="activeModal.close('Close click')">Cancel
        </button>
        <button class="btn btn-primary">Submit</button>
      </div>
    </form>
  `,
  styles: []
})
export class ListFormModalComponent implements OnInit {
  @Input() favoriteList: FavoriteList
  listName: string = ''
  initialListName: string = ''
  nrOfItemsToBeShownOnScreen: number = 20

  error: string
  isEditMode: boolean

  constructor(public activeModal: NgbActiveModal,
              private favoriteListApi: FavoriteListApi) {
  }

  isNrOfItemsToBeShownOnScreensDisabled() {
    // If the list is ongoing, we cannot change the configuration.
    if (!!this.favoriteList) {
      return this.favoriteList.status != FavoriteListStatus.CREATED
    }

    return false;
  }

  onSubmit() {
    if (this.listName.length == 0) {
      this.error = 'You must set a name'
      return false;
    }

    try {
      if (this.isEditMode) {
        // Create a new list so that in case the update goes wrong we didn't update the incoming list (which is shown on the screen).
        this.favoriteListApi.updateList({
          id: this.favoriteList.id,
          name: this.listName,
          items: this.favoriteList.items,
          status: this.favoriteList.status,
          tsCreated: this.favoriteList.tsCreated,
          nrOfItemsToBeShownOnScreen: this.nrOfItemsToBeShownOnScreen
        })
      } else {
        this.favoriteListApi.addNewFavoriteList(this.listName, this.nrOfItemsToBeShownOnScreen);
      }
    } catch (error) {
      this.error = error.message;
      return false;
    }

    this.activeModal.close("Submit");
  }

  ngOnInit(): void {
    this.isEditMode = !!this.favoriteList

    if (this.isEditMode) {
      this.listName = this.favoriteList.name
      this.initialListName = this.listName
      this.nrOfItemsToBeShownOnScreen = this.favoriteList.nrOfItemsToBeShownOnScreen
    }
  }
}
