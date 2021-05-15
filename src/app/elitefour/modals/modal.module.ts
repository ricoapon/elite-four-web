import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AreYouSureModalComponent} from './are-you-sure-modal/are-you-sure-modal.component';
import {ExportDataModalComponent} from './export-data-modal/export-data-modal.component';
import {ExportModalComponent} from './export-modal/export-modal.component';
import {ImportDataModalComponent} from './import-data-modal/import-data-modal.component';
import {ImportModalComponent} from './import-modal/import-modal.component';
import {ItemFormModalComponent} from './item-form-modal/item-form-modal.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [AreYouSureModalComponent, ItemFormModalComponent,
    ExportDataModalComponent, ExportModalComponent,
    ImportDataModalComponent, ImportModalComponent],
  imports: [CommonModule, FormsModule],
  exports: []
})
export class ModalModule {
}
