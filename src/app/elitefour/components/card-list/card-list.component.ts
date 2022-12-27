import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-card-list',
  template: `
    <div class="card" [ngClass]="addBottomMargin ? 'mb-4' : ''">
      <div class="card-body">
        <div class="justify-content-between d-flex align-items-center">
          <p class="p-0 m-0">{{title}}</p>
          <div class="d-flex align-items-center">
            <div class="me-3">
              <ng-content></ng-content>
            </div>
            <button *ngIf="isDeleteUsed" (click)="delete.emit()"
                    class="btn btn-danger ms-2"><i class="fas fa-trash-alt"></i></button>
            <button *ngIf="isInfoUsed" (click)="info.emit()"
                    class="btn btn-primary ms-2"><i class="fas fa-info"></i></button>
            <button *ngIf="isEditUsed" (click)="edit.emit()"
                    class="btn btn-primary ms-2"><i class="fas fa-edit"></i></button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    button {
      width: 40px;
      height: 40px;
    }
  `]
})
export class CardListComponent implements OnInit {
  @Input() title: string;
  @Input() addBottomMargin = true;

  @Output() delete?: EventEmitter<null> = new EventEmitter();
  isDeleteUsed: boolean;
  @Output() info?: EventEmitter<null> = new EventEmitter();
  isInfoUsed: boolean;
  @Output() edit?: EventEmitter<null> = new EventEmitter();
  isEditUsed;

  constructor() {
  }

  ngOnInit(): void {
    this.isDeleteUsed = this.delete.observers.length > 0;
    this.isInfoUsed = this.info.observers.length > 0;
    this.isEditUsed = this.edit.observers.length > 0;
  }

}
