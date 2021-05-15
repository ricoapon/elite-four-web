import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ExportDataModalComponent, ImportDataModalComponent} from '../../modals';
import {VERSION} from '../../../../environments/version';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  public version = VERSION;

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
