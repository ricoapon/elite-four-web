import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ExportDataModalComponent, ImportDataModalComponent} from '../../modals';
import {VERSION} from '../../../../environments/version';
import {SpotifyAuthenticationState} from '../../backend/spotify/spotify-authentication-state';
import {SpotifyAuthentication} from '../../backend/spotify/spotify-authentication';
import {Router} from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  public version = VERSION;

  constructor(private modalService: NgbModal,
              public spotifyAuthenticationState: SpotifyAuthenticationState,
              private spotifyAuthentication: SpotifyAuthentication,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  export(): void {
    this.modalService.open(ExportDataModalComponent);
  }

  import(): void {
    this.modalService.open(ImportDataModalComponent);
  }

  loginToSpotify(): void {
    if (!this.spotifyAuthenticationState.isLoggedIn()) {
      this.spotifyAuthentication.redirectToSpotify(this.router.url);
    } else {
      this.spotifyAuthentication.logout();
    }
  }
}
