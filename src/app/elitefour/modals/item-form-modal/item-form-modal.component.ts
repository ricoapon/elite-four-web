import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FavoriteItem, FavoriteList} from '../../backend/favorite-list-interfaces';
import {FavoriteListsRepository} from '../../backend/favorite-lists-repository';

@Component({
  selector: 'app-add-item-form-modal',
  template: `
    <form (ngSubmit)="checkValidationItemName() && checkValidationSpotifyUrl() && f.form.valid && onSubmit()" #f="ngForm">
      <div class="modal-header">
        <h4 class="modal-title" *ngIf="!isEditMode">Add a new item</h4>
        <h4 class="modal-title" *ngIf="isEditMode">Edit item</h4>
        <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
      </div>
      <div class="modal-body">
        <div class="mb-3">
          <label class="form-label" for="itemName">Item name</label>
          <!--suppress HtmlUnknownAttribute -->
          <input ngbAutofocus type="text" class="form-control" id="itemName" [(ngModel)]="itemName" name="itemName"
                 #itemNameModel="ngModel" [ngClass]="{ 'is-invalid': f.submitted && itemNameModel.invalid }"
                 required (ngModelChange)="checkValidationItemName()">
          <div *ngIf="f.submitted && itemNameModel.invalid" class="invalid-feedback">
            <div *ngIf="itemNameModel.errors.required">Name is required</div>
            <div *ngIf="itemNameModel.errors.forbiddenName">Name already exists</div>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="itemName">Spotify link</label>
          <input type="text" class="form-control" id="spotifyUrl" [(ngModel)]="spotifyUrl" name="spotifyUrl"
                 #spotifyUrlModel="ngModel" [ngClass]="{ 'is-invalid': f.submitted && spotifyUrlModel.invalid }"
                 (ngModelChange)="checkValidationSpotifyUrl()">
          <div *ngIf="f.submitted && spotifyUrlModel.invalid" class="invalid-feedback">
            <div *ngIf="spotifyUrlModel.errors.incorrectFormat">Format is incorrect. It should look like
              "https://open.spotify.com/track/...".
            </div>
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
  static readonly SPOTIFY_REGEXP = new RegExp('https:\\/\\/open\\.spotify\\.com\\/track\\/(\\w+)');
  @Input() listId: number;
  favoriteList: FavoriteList;
  @Input() favoriteItem: FavoriteItem;
  itemName = '';
  initialItemName = '';
  spotifyUrl = '';
  isEditMode: boolean;

  constructor(public activeModal: NgbActiveModal,
              private favoriteListsRepository: FavoriteListsRepository) {
  }

  @ViewChild('itemNameModel') itemNameModel;
  checkValidationItemName(): boolean {
    // Validation cannot happen the list is not initialized or if the itemName is empty.
    if (!this.favoriteList || this.itemName === '') {
      return false;
    }

    // If the name equals the initial name, it is valid.
    if (this.initialItemName === this.itemName) {
      this.itemNameModel.control.setErrors(null);
      return true;
    }

    // If the name exists in the list of items, return false.
    if (this.favoriteList.items.find((item) => item.name === this.itemName)) {
      this.itemNameModel.control.setErrors({forbiddenName: true});
      return false;
    }

    this.itemNameModel.control.setErrors(null);
    return true;
  }

  @ViewChild('spotifyUrlModel') spotifyUrlModel;
  checkValidationSpotifyUrl(): boolean {
    // The value is optional.
    if (this.spotifyUrl === '') {
      this.spotifyUrlModel.control.setErrors(null);
      return true;
    }

    // The URL should be in the correct format.
    if (!ItemFormModalComponent.SPOTIFY_REGEXP.test(this.spotifyUrl)) {
      this.spotifyUrlModel.control.setErrors({incorrectFormat: true});
      return false;
    }

    this.spotifyUrlModel.control.setErrors(null);
    return true;
  }

  onSubmit(): boolean {
    if (this.itemName.length === 0) {
      return false;
    }

    try {
      if (this.isEditMode) {
        let spotify = null;
        if (this.spotifyUrl !== '') {
          const id = ItemFormModalComponent.SPOTIFY_REGEXP.exec(this.spotifyUrl)[1]
          spotify = {
            id,
            externalUrl: this.spotifyUrl
          }
        }

        // Create a new item so that in case the update goes wrong we didn't update the incoming item (which is shown on the screen).
        this.favoriteListsRepository.updateItemForFavoriteList(this.listId, {
          id: this.favoriteItem.id,
          name: this.itemName,
          eliminatedBy: [],
          toBeChosen: false,
          spotify
        });
      } else {
        this.favoriteListsRepository.addItemToFavoriteList(this.listId, this.itemName);
      }
    } catch (error) {
      console.error(error);
      // Do not close form if we could not submit properly.
      return false;
    }
    this.activeModal.close('Submit');
  }

  ngOnInit(): void {
    this.favoriteListsRepository.getFavoriteListById(this.listId).subscribe((list) => this.favoriteList = list);
    this.isEditMode = !!this.favoriteItem;

    if (this.isEditMode) {
      this.itemName = this.favoriteItem.name;
      this.initialItemName = this.itemName;
      if (this.favoriteItem.spotify) {
        this.spotifyUrl = this.favoriteItem.spotify.externalUrl;
      }
    }
  }

}
