import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './shared/components';
import {ListOverviewComponent} from "./elitefour/pages/list-overview/list-overview.component";
import {ListDetailComponent} from "./elitefour/pages/list-detail/list-detail.component";
import {SettingsComponent} from "./elitefour/pages/settings/settings.component";
import {AlgorithmComponent} from "./elitefour/pages/algorithm/algorithm.component";
import {HelpComponent} from "./elitefour/pages/help/help.component";

const routes: Routes = [
  { path: '', redirectTo: '/list', pathMatch: 'full'},
  { path: 'list', component: ListOverviewComponent },
  { path: 'list/:id', component: ListDetailComponent },
  { path: 'list/:id/algorithm', component: AlgorithmComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'help', component: HelpComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
