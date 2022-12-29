import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SpotifyAuthentication} from '../../backend/spotify/spotify-authentication';

@Component({
  selector: 'app-spotify-callback',
  templateUrl: './spotify-callback.component.html',
})
export class SpotifyCallbackComponent implements OnInit {
  error: string = undefined;

  constructor(private router: Router, private route: ActivatedRoute, private spotifyAuthentication: SpotifyAuthentication) {
  }

  ngOnInit(): void {
    // Retrieve and store information that we got back from Spotify.
    const code = this.route.snapshot.queryParamMap.get('code');
    const state = this.route.snapshot.queryParamMap.get('state');

    if (!this.spotifyAuthentication.isStateValid(state)) {
      this.error = 'Incorrect state';
    }

    this.spotifyAuthentication.requestAccessToken(code)
      .then(() => {
        this.spotifyAuthentication.navigateBack(this.router);
      })
      .catch((e) => {
        this.error = 'Log in failed with error message: ' + e;
      });
  }
}
