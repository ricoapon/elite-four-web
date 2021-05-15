import {NgModule} from '@angular/core';
import {CardListComponent} from './card-list/card-list.component';
import {HeaderComponent} from './header/header.component';
import {HeaderButtonComponent} from './header-button/header-button.component';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [CardListComponent, HeaderComponent, HeaderButtonComponent],
  imports: [
    CommonModule
  ],
  exports: [CardListComponent, HeaderComponent, HeaderButtonComponent]
})

export class ComponentsModule {
}
