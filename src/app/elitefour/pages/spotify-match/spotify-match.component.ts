import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {FavoriteList} from '../../backend/favorite-list-interfaces';
import {FavoriteListsRepository} from '../../backend/favorite-lists-repository';
import {
  SpotifyMatchingSessionService,
  SpotifyMatchingSessionState,
  SpotifyReviewTask
} from '../../backend/spotify/spotify-matching-session.service';
import {SpotifyTrackCandidate} from '../../backend/spotify/spotify-search';
import {parseSpotifyTrackUrl} from '../../backend/spotify/spotify-track-url';
import {SpotifyPlaylist} from '../../backend/spotify/spotify-playlist';
import {ExportModalComponent} from '../../modals';

@Component({
  selector: 'app-spotify-match',
  templateUrl: './spotify-match.component.html',
  styles: []
})
export class SpotifyMatchComponent implements OnInit, OnDestroy {
  favoriteList: FavoriteList = {id: 0, name: '', status: undefined, tsCreated: new Date(), items: [], nrOfItemsToBeShownOnScreen: 20};
  state: SpotifyMatchingSessionState = this.spotifyMatchingSession.state;
  selectedCandidateId = '';
  manualSpotifyUrl = '';
  decisionError = '';
  private stateSubscription: Subscription;
  private favoriteListSubscription: Subscription;
  private activeTaskId = '';
  private hasStartedSession = false;

  constructor(private route: ActivatedRoute,
              private favoriteListsRepository: FavoriteListsRepository,
              public spotifyMatchingSession: SpotifyMatchingSessionService,
              private spotifyPlaylist: SpotifyPlaylist) {
  }

  ngOnInit(): void {
    const listId = +this.route.snapshot.paramMap.get('id');
    this.stateSubscription = this.spotifyMatchingSession.state$
      .subscribe((state) => {
        this.state = state;
        const activeTask = this.activeTask;
        if (activeTask?.id !== this.activeTaskId) {
          this.activeTaskId = activeTask?.id ?? '';
          this.selectedCandidateId = '';
          this.manualSpotifyUrl = '';
          this.decisionError = '';
        }
      });
    this.favoriteListSubscription = this.favoriteListsRepository.getFavoriteListById(listId)
      .subscribe((favoriteList) => {
        this.favoriteList = favoriteList;
        if (!this.hasStartedSession && favoriteList) {
          this.spotifyMatchingSession.start(favoriteList);
          this.hasStartedSession = true;
        }
      });
  }

  ngOnDestroy(): void {
    this.stateSubscription?.unsubscribe();
    this.favoriteListSubscription?.unsubscribe();
    this.spotifyMatchingSession.abandonSession();
  }

  get activeTask(): SpotifyReviewTask | undefined {
    return this.state.reviewTasks[0];
  }

  get progressPercentage(): number {
    if (this.state.total === 0) {
      return 100;
    }

    return Math.round((this.state.processed / this.state.total) * 100);
  }

  get isProcessingComplete(): boolean {
    return this.state.total === this.state.processed && !this.state.isRunning;
  }

  get isComplete(): boolean {
    return this.isProcessingComplete && this.state.reviewTasks.length === 0;
  }

  get progressStatusLabel(): string {
    if (this.state.isRunning) {
      return 'Running';
    }

    return this.isComplete ? 'Complete' : 'Reviewing';
  }

  get progressStatusClass(): string {
    if (this.state.isRunning) {
      return 'text-bg-info';
    }

    return this.isComplete ? 'text-bg-success' : 'text-bg-warning';
  }

  get manualSelected(): boolean {
    return this.selectedCandidateId === 'manual';
  }

  selectCandidate(candidate: SpotifyTrackCandidate): void {
    this.selectedCandidateId = candidate.track.id;
    this.decisionError = '';
  }

  selectManual(): void {
    this.selectedCandidateId = 'manual';
    this.decisionError = '';
  }

  updateManualSpotifyUrl(value: string): void {
    this.manualSpotifyUrl = value;
    this.selectManual();
  }

  useSelectedTrack(task: SpotifyReviewTask): void {
    if (this.manualSelected) {
      const spotify = parseSpotifyTrackUrl(this.manualSpotifyUrl);
      if (!spotify) {
        this.decisionError = 'Enter a valid Spotify track URL.';
        return;
      }

      this.spotifyMatchingSession.chooseManualTrack(task.id, spotify);
      return;
    }

    const candidate = task.candidates.find((trackCandidate) => trackCandidate.track.id === this.selectedCandidateId);
    if (!candidate) {
      this.decisionError = 'Choose a Spotify track or enter your own track URL.';
      return;
    }

    this.spotifyMatchingSession.chooseCandidate(task.id, candidate);
  }

  skipTask(task: SpotifyReviewTask): void {
    this.spotifyMatchingSession.skipTask(task.id);
  }

  retryTask(task: SpotifyReviewTask): void {
    this.spotifyMatchingSession.retryTask(task.id);
  }

  candidateMatchPercentage(candidate: SpotifyTrackCandidate): number {
    return Math.max(0, Math.min(100, Math.round((1 - candidate.score) * 100)));
  }

  exportToSpotifyPlaylist(): void {
    const sortedFilteredItems = ExportModalComponent.sortItems(this.favoriteList.items
      .filter(item => !!item.favoritePosition)
      .filter(item => !!item.spotify));

    if (sortedFilteredItems.length == 0) {
      alert('The list contains 0 sorted items, so no Spotify playlist can be created.')
      return
    }

    this.spotifyPlaylist.create(this.favoriteList.name, sortedFilteredItems)
      .then((url) => window.open(url, '_blank').focus())
  }

  trackByCandidateId(_: number, candidate: SpotifyTrackCandidate): string {
    return candidate.track.id;
  }
}
