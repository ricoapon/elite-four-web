import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SpotifySearch} from '../../backend/spotify/spotify-search';
import type {SpotifyMatchResult} from '../../backend/spotify/spotify-search';

@Component({
  selector: 'app-spotify-search-debug',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './spotify-search-debug.component.html'
})
export class SpotifySearchDebugComponent {
  searchInput = '';
  result: SpotifyMatchResult | undefined;
  isSearching = false;
  errorMessage = '';

  constructor(private spotifySearch: SpotifySearch) {
  }

  async search(): Promise<void> {
    this.result = undefined;
    this.errorMessage = '';

    if (this.searchInput.trim().length === 0) {
      return;
    }

    this.isSearching = true;
    try {
      this.result = await this.spotifySearch.searchTrackCandidates(this.searchInput);
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Could not search Spotify.';
    } finally {
      this.isSearching = false;
    }
  }
}
