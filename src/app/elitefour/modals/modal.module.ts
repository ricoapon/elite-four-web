import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AreYouSureModalComponent} from './are-you-sure-modal/are-you-sure-modal.component';
import {ExportDataModalComponent} from './export-data-modal/export-data-modal.component';

@NgModule({
  declarations: [AreYouSureModalComponent, ExportDataModalComponent],
  imports: [CommonModule],
  exports: []
})
export class ModalModule {
}