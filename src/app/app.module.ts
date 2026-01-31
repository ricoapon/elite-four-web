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
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {Retry429Interceptor} from './elitefour/backend/spotify/retry-429-interceptor';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [BrowserModule,
    FormsModule,
    AppRoutingModule,
    KeyboardShortcutsModule.forRoot(),
    ModalModule,
    ComponentsModule,
    PagesModule],
  providers: [
    {provide: FavoriteListsRepository, useClass: FavoriteListsRepositoryImpl},
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Retry429Interceptor,
      multi: true
    }
  ]
})
export class AppModule {
}
