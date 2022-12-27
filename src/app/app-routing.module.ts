import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AlgorithmComponent, HelpComponent, ListDetailComponent, ListOverviewComponent, PageNotFoundComponent} from './elitefour/pages';
import {SpotifyCallbackComponent} from './elitefour/pages/spotify-callback/spotify-callback.component';

const routes: Routes = [
  {path: '', component: ListOverviewComponent},
  {path: 'list/:id', component: ListDetailComponent},
  {path: 'list/:id/algorithm', component: AlgorithmComponent},
  {path: 'help', component: HelpComponent},
  {path: 'spotify-callback', component: SpotifyCallbackComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
