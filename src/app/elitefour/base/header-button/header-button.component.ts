import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-content-header-button',
  template: `
    <button class="btn ml-2" [ngClass]="btnClass" [disabled]="disabled">
      <ng-content></ng-content>
    </button>
  `,
  styles: [
  ]
})
export class HeaderButtonComponent implements OnInit {
  // Cannot be named 'class', since that would add the class to the component itself as well.
  @Input() btnClass: string = 'btn-primary'
  @Input() disabled: boolean

  // Note that "click" callback can be used on any element, so we don't need to explicitly define it.
  constructor() { }

  ngOnInit(): void {
  }

}
