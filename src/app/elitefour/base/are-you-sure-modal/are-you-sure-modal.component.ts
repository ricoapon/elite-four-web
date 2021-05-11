import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-are-you-sure-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Are you sure?</h4>
    </div>
    <div class="modal-body" *ngIf="!!body">
      {{body}}
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-danger" (click)="activeModal.close(false)">No</button>
      <button class="btn btn-success" (click)="activeModal.close(true)">Yes</button>
    </div>
  `,
  styles: []
})
export class AreYouSureModalComponent implements OnInit {
  @Input() body?: string

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

}
