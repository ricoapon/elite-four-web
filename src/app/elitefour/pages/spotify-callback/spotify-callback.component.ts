import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-spotify-callback',
  templateUrl: './spotify-callback.component.html',
})
export class SpotifyCallbackComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Retrieve and store information that we got back from Spotify.
    // TODO

    // Navigate to the URL the user came from.
    const redirectTo = this.route.snapshot.queryParamMap.get('url');
    this.router.navigate([redirectTo]);
  }

}
