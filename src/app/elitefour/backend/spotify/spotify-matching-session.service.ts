import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {FavoriteItem, FavoriteList, SpotifyTrackReference} from '../favorite-list-interfaces';
import {FavoriteListsRepository} from '../favorite-lists-repository';
import {SpotifySearch, SpotifyTrackCandidate, Track} from './spotify-search';

export type SpotifyReviewTaskStatus = 'candidates' | 'no-candidates' | 'error';

export type SpotifyReviewTask = {
  id: string,
  listId: number,
  itemId: number,
  itemName: string,
  status: SpotifyReviewTaskStatus,
  candidates: SpotifyTrackCandidate[],
  errorMessage?: string,
};

export type SpotifyMatchingSessionState = {
  listId?: number,
  total: number,
  processed: number,
  autoMatched: number,
  skipped: number,
  errors: number,
  reviewTasks: SpotifyReviewTask[],
  isRunning: boolean,
};

const EMPTY_STATE: SpotifyMatchingSessionState = {
  total: 0,
  processed: 0,
  autoMatched: 0,
  skipped: 0,
  errors: 0,
  reviewTasks: [],
  isRunning: false
};
export const MAX_SPOTIFY_REVIEW_CANDIDATE_SCORE = 0.80;

@Injectable({providedIn: 'root'})
export class SpotifyMatchingSessionService {
  private readonly stateSubject = new BehaviorSubject<SpotifyMatchingSessionState>(EMPTY_STATE);
  readonly state$: Observable<SpotifyMatchingSessionState> = this.stateSubject.asObservable();
  private processingPromise: Promise<void> = Promise.resolve();
  private activeRunId = 0;

  constructor(private favoriteListsRepository: FavoriteListsRepository,
              private spotifySearch: SpotifySearch) {
  }

  get state(): SpotifyMatchingSessionState {
    return this.stateSubject.value;
  }

  start(favoriteList: FavoriteList): void {
    if (this.state.listId === favoriteList.id && (this.state.isRunning || this.state.reviewTasks.length > 0)) {
      return;
    }

    const runId = ++this.activeRunId;
    const itemsToMatch = favoriteList.items.filter((item) => !item.spotify);
    this.updateState({
      listId: favoriteList.id,
      total: itemsToMatch.length,
      processed: 0,
      autoMatched: 0,
      skipped: 0,
      errors: 0,
      reviewTasks: [],
      isRunning: itemsToMatch.length > 0
    });

    this.processingPromise = this.processItems(favoriteList.id, itemsToMatch, runId);
  }

  abandonSession(): void {
    this.activeRunId++;
    this.processingPromise = Promise.resolve();
    this.stateSubject.next({...EMPTY_STATE});
  }

  async whenProcessingComplete(): Promise<void> {
    await this.processingPromise;
  }

  chooseCandidate(taskId: string, candidate: SpotifyTrackCandidate): void {
    const task = this.findTask(taskId);
    if (!task) {
      return;
    }

    this.saveSpotifyTrack(task.listId, task.itemId, candidate.track, true);
    this.removeTask(taskId);
  }

  chooseManualTrack(taskId: string, spotify: SpotifyTrackReference): void {
    const task = this.findTask(taskId);
    if (!task) {
      return;
    }

    this.saveSpotifyReference(task.listId, task.itemId, spotify, true);
    this.removeTask(taskId);
  }

  skipTask(taskId: string): void {
    if (!this.findTask(taskId)) {
      return;
    }

    this.updateState({
      skipped: this.state.skipped + 1,
      reviewTasks: this.state.reviewTasks.filter((task) => task.id !== taskId)
    });
  }

  retryTask(taskId: string): void {
    const task = this.findTask(taskId);
    if (!task) {
      return;
    }

    this.removeTask(taskId);
    const runId = this.activeRunId;
    this.processingPromise = this.processingPromise
      .then(() => this.processItem({
        id: task.itemId,
        name: task.itemName,
        eliminatedBy: [],
        toBeChosen: false
      }, task.listId, runId, false));
  }

  private async processItems(listId: number, items: FavoriteItem[], runId: number): Promise<void> {
    for (const item of items) {
      if (!this.isActiveRun(listId, runId)) {
        return;
      }

      await this.processItem(item, listId, runId, true);
    }

    if (this.isActiveRun(listId, runId)) {
      this.updateState({isRunning: false});
    }
  }

  private async processItem(item: FavoriteItem, listId: number, runId: number, countProcessed: boolean): Promise<void> {
    if (!this.isActiveRun(listId, runId)) {
      return;
    }

    try {
      const result = await this.spotifySearch.searchTrackCandidates(item.name);
      if (!this.isActiveRun(listId, runId)) {
        return;
      }

      if (result.autoMatch) {
        const saved = this.saveSpotifyTrack(listId, item.id, result.autoMatch.track, false);
        if (saved) {
          this.updateState({autoMatched: this.state.autoMatched + 1});
        }
        return;
      }

      const reviewCandidates = result.candidates
        .filter((candidate) => candidate.score < MAX_SPOTIFY_REVIEW_CANDIDATE_SCORE);
      this.addReviewTask({
        id: this.createTaskId(listId, item.id),
        listId,
        itemId: item.id,
        itemName: item.name,
        status: reviewCandidates.length === 0 ? 'no-candidates' : 'candidates',
        candidates: reviewCandidates
      });
    } catch (error) {
      if (!this.isActiveRun(listId, runId)) {
        return;
      }

      this.addReviewTask({
        id: this.createTaskId(listId, item.id),
        listId,
        itemId: item.id,
        itemName: item.name,
        status: 'error',
        candidates: [],
        errorMessage: error instanceof Error ? error.message : 'Could not search Spotify.'
      });
      this.updateState({errors: this.state.errors + 1});
    } finally {
      if (countProcessed && this.isActiveRun(listId, runId)) {
        this.updateState({processed: Math.min(this.state.total, this.state.processed + 1)});
      }
    }
  }

  private addReviewTask(task: SpotifyReviewTask): void {
    const reviewTasks = this.state.reviewTasks
      .filter((existingTask) => existingTask.id !== task.id)
      .concat(task);
    this.updateState({reviewTasks});
  }

  private removeTask(taskId: string): void {
    this.updateState({
      reviewTasks: this.state.reviewTasks.filter((task) => task.id !== taskId)
    });
  }

  private findTask(taskId: string): SpotifyReviewTask | undefined {
    return this.state.reviewTasks.find((task) => task.id === taskId);
  }

  private saveSpotifyTrack(listId: number, itemId: number, track: Track, allowOverride: boolean): boolean {
    return this.saveSpotifyReference(listId, itemId, {
      id: track.id,
      externalUrl: track.externalUrl
    }, allowOverride);
  }

  private saveSpotifyReference(listId: number, itemId: number, spotify: SpotifyTrackReference, allowOverride: boolean): boolean {
    let saved = false;
    this.favoriteListsRepository.modify((favoriteLists) => {
      const favoriteList = favoriteLists.find((list) => list.id === listId);
      const item = favoriteList?.items.find((candidateItem) => candidateItem.id === itemId);
      if (!item || (!allowOverride && item.spotify)) {
        return;
      }

      item.spotify = spotify;
      saved = true;
    });
    return saved;
  }

  private updateState(update: Partial<SpotifyMatchingSessionState>): void {
    this.stateSubject.next({
      ...this.state,
      ...update
    });
  }

  private isActiveRun(listId: number, runId: number): boolean {
    return this.activeRunId === runId && this.state.listId === listId;
  }

  private createTaskId(listId: number, itemId: number): string {
    return listId + ':' + itemId;
  }
}
