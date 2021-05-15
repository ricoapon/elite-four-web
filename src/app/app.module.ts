import 'reflect-metadata';
import '../polyfills';

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SharedModule} from './shared/shared.module';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {CardListComponent} from './elitefour/base/card-list/card-list.component';
import {HeaderComponent} from './elitefour/base/header/header.component';
import {HeaderButtonComponent} from './elitefour/base/header-button/header-button.component';
import {ListDetailComponent} from './elitefour/pages/list-detail/list-detail.component';
import {ListOverviewComponent} from './elitefour/pages/list-overview/list-overview.component';
import {ListFormModalComponent} from './elitefour/base/list-form-modal/list-form-modal.component';
import {MenuComponent} from './elitefour/menu/menu.component';
import {AlgorithmComponent} from './elitefour/pages/algorithm/algorithm.component';
import {HelpComponent} from './elitefour/pages/help/help.component';
import {ForbiddenListNameValidatorDirective} from './elitefour/base/list-form-modal/forbidden-list-name-validator.directive';
import {CustomMinValidatorDirective} from './elitefour/base/list-form-modal/custom-min-validator.directive';
import {KeyboardShortcutsModule} from 'ng-keyboard-shortcuts';
import {ModalModule} from './elitefour/modals/modal.module';

@NgModule({
  declarations: [AppComponent, CardListComponent, HeaderComponent, HeaderButtonComponent, ListDetailComponent, ListOverviewComponent,
    ListFormModalComponent, MenuComponent, AlgorithmComponent, HelpComponent,
    ForbiddenListNameValidatorDirective, CustomMinValidatorDirective],
  imports: [
    BrowserModule,
    FormsModule,
    SharedModule,
    AppRoutingModule,
    KeyboardShortcutsModule.forRoot(),
    ModalModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
