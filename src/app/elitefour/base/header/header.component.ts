import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-content-header',
  template: `
    <div class="justify-content-between d-flex">
      <div>
        <h2 class="mb-4">
          {{title}}
          <a (click)="onEdit.emit()">
            <i *ngIf="isEditUsed" class="fas fa-edit"></i>
          </a>
        </h2>
      </div>
      <div>
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class HeaderComponent implements OnInit {
  @Input() title: string
  @Output() onEdit?: EventEmitter<null> = new EventEmitter();
  isEditUsed: boolean

  ngOnInit(): void {
    this.isEditUsed = this.onEdit.observers.length > 0;
  }

}
