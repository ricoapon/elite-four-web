import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AreYouSureModalComponent} from './are-you-sure-modal/are-you-sure-modal.component';
import {ExportDataModalComponent} from './export-data-modal/export-data-modal.component';
import {ExportModalComponent} from './export-modal/export-modal.component';
import {ImportDataModalComponent} from './import-data-modal/import-data-modal.component';
import {ImportModalComponent} from './import-modal/import-modal.component';
import {ItemFormModalComponent} from './item-form-modal/item-form-modal.component';
import {ListFormModalComponent} from './list-form-modal/list-form-modal.component';
import {CustomMinValidatorDirective} from './list-form-modal/custom-min-validator.directive';
import {ForbiddenListNameValidatorDirective} from './list-form-modal/forbidden-list-name-validator.directive';

@NgModule({
  declarations: [AreYouSureModalComponent, ItemFormModalComponent,
    ListFormModalComponent, CustomMinValidatorDirective, ForbiddenListNameValidatorDirective,
    ExportDataModalComponent, ExportModalComponent,
    ImportDataModalComponent, ImportModalComponent],
  imports: [CommonModule, FormsModule],
  exports: []
})
export class ModalModule {
}
