import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FormsModule} from '@angular/forms';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AlgorithmComponent} from './algorithm/algorithm.component';
import {HelpComponent} from './help/help.component';
import {ListDetailComponent} from './list-detail/list-detail.component';
import {ListOverviewComponent} from './list-overview/list-overview.component';
import {MenuComponent} from './menu/menu.component';
import {AppRoutingModule} from '../../app-routing.module';
import {ComponentsModule} from '../components/components.module';
import {KeyboardShortcutsModule} from 'ng-keyboard-shortcuts';
import {ModalModule} from '../modals/modal.module';
import {SpotifyCallbackComponent} from './spotify-callback/spotify-callback.component';

@NgModule({
  declarations: [AlgorithmComponent, HelpComponent, ListDetailComponent, ListOverviewComponent, MenuComponent, PageNotFoundComponent,
    SpotifyCallbackComponent],
  imports: [CommonModule, FormsModule, AppRoutingModule, ComponentsModule, KeyboardShortcutsModule, ModalModule],
  exports: [
    MenuComponent
  ]
})
export class PagesModule {}
