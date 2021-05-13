import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ExportDataModalComponent} from '../base/export-data-modal/export-data-modal.component';
import {ImportDataModalComponent} from '../base/import-data-modal/import-data-modal.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  public version = environment.version;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  export(): void {
    this.modalService.open(ExportDataModalComponent);
  }

  import(): void {
    this.modalService.open(ImportDataModalComponent);
  }
}
