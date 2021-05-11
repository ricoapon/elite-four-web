import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-card-list',
  template: `
    <div class="card" [ngClass]="addBottomMargin ? 'mb-4' : ''">
      <div class="card-body">
        <div class="justify-content-between d-flex align-items-center">
          <p class="p-0 m-0">{{title}}</p>
          <div class="d-flex align-items-center">
            <div class="mr-3">
              <ng-content></ng-content>
            </div>
            <button *ngIf="isDeleteUsed" (click)="onDelete.emit()"
                    class="btn btn-danger ml-2"><i class="fas fa-trash-alt"></i></button>
            <button *ngIf="isInfoUsed" (click)="onInfo.emit()"
                    class="btn btn-primary ml-2"><i class="fas fa-info"></i></button>
            <button *ngIf="isEditUsed" (click)="onEdit.emit()"
                    class="btn btn-primary ml-2"><i class="fas fa-edit"></i></button>
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
  @Input() title: string
  @Input() addBottomMargin: boolean = true

  @Output() onDelete?: EventEmitter<null> = new EventEmitter();
  isDeleteUsed: boolean
  @Output() onInfo?: EventEmitter<null> = new EventEmitter();
  isInfoUsed: boolean
  @Output() onEdit?: EventEmitter<null> = new EventEmitter();
  isEditUsed;

  constructor() {
  }

  ngOnInit(): void {
    this.isDeleteUsed = this.onDelete.observers.length > 0;
    this.isInfoUsed = this.onInfo.observers.length > 0;
    this.isEditUsed = this.onEdit.observers.length > 0;
  }

}
