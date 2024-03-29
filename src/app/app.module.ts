import 'reflect-metadata';
import '../polyfills';

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {KeyboardShortcutsModule} from 'ng-keyboard-shortcuts';
import {ModalModule} from './elitefour/modals/modal.module';
import {ComponentsModule} from './elitefour/components/components.module';
import {PagesModule} from './elitefour/pages/pages.module';
import {FavoriteListsRepositoryImpl} from './elitefour/backend/favorite-lists-repository-impl.service';
import {FavoriteListsRepository} from './elitefour/backend/favorite-lists-repository';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    KeyboardShortcutsModule.forRoot(),
    ModalModule,
    ComponentsModule,
    PagesModule,
    HttpClientModule
  ],
  providers: [{provide: FavoriteListsRepository, useClass: FavoriteListsRepositoryImpl}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
