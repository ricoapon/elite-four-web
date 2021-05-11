import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FavoriteListApi} from "../../backend/favorite-list-api";
import {FavoriteItem, FavoriteList} from "../../backend/favorite-list-interfaces";

@Component({
  selector: 'app-add-item-form-modal',
  template: `
    <form (ngSubmit)="checkValidation() && f.form.valid && onSubmit()" #f="ngForm">
      <div class="modal-header">
        <h4 class="modal-title" *ngIf="!isEditMode">Add a new item</h4>
        <h4 class="modal-title" *ngIf="isEditMode">Edit item</h4>
        <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <!--suppress HtmlUnknownAttribute -->
          <input ngbAutofocus type="text" class="form-control" id="itemName" [(ngModel)]="itemName" name="itemName"
                 #itemNameModel="ngModel" [ngClass]="{ 'is-invalid': f.submitted && itemNameModel.invalid }"
                 required (ngModelChange)="checkValidation()">
          <div *ngIf="f.submitted && itemNameModel.invalid" class="invalid-feedback">
            <div *ngIf="itemNameModel.errors.required">Name is required</div>
            <div *ngIf="itemNameModel.errors.forbiddenName">Name already exists</div>
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
export class ItemFormModalComponent implements OnInit {
  @Input() listId: number
  favoriteList: FavoriteList
  @Input() favoriteItem: FavoriteItem
  itemName: string = ''
  initialItemName: string = ''
  isEditMode: boolean

  constructor(public activeModal: NgbActiveModal,
              private favoriteListApi: FavoriteListApi) {
  }

  @ViewChild('itemNameModel') itemNameModel;
  checkValidation(): boolean {
    // Validation cannot happen the list is not initialized or if the itemName is empty.
    if (!this.favoriteList || this.itemName == '') {
      return false
    }

    // If the name equals the initial name, it is valid.
    if (this.initialItemName == this.itemName) {
      this.itemNameModel.control.setErrors(null)
      return true;
    }

    // If the name exists in the list of items, return false.
    if (this.favoriteList.items.find((item) => item.name == this.itemName)) {
      console.log(this.itemNameModel)
      this.itemNameModel.control.setErrors({ forbiddenName: true })
      return false;
    }

    this.itemNameModel.control.setErrors(null)
    return true;
  }

  onSubmit() {
    if (this.itemName.length == 0) {
      return false;
    }

    try {
      if (this.isEditMode) {
        // Create a new item so that in case the update goes wrong we didn't update the incoming item (which is shown on the screen).
        this.favoriteListApi.updateItemForFavoriteList(this.listId, {
          id: this.favoriteItem.id,
          name: this.itemName,
          eliminatedBy: [],
          toBeChosen: false
        });
      } else {
        this.favoriteListApi.addItemToFavoriteList(this.listId, this.itemName);
      }
    } catch (error) {
      console.log(error);
      // Do not close form if we could not submit properly.
      return false;
    }
    this.activeModal.close("Submit");
  }

  ngOnInit() {
    this.favoriteListApi.getFavoriteListById(this.listId).subscribe((list) => this.favoriteList = list)
    this.isEditMode = !!this.favoriteItem

    if (this.isEditMode) {
      this.itemName = this.favoriteItem.name;
      this.initialItemName = this.itemName
    }
  }

}
