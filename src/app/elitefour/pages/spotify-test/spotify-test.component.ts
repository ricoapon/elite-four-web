import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import pLimit from 'p-limit';
import {SpotifySearch} from '../../backend/spotify/spotify-search';
import type {SpotifyMatchResult, SpotifyTrackCandidate, Track} from '../../backend/spotify/spotify-search';
import {tokenizeSpotifyText} from '../../backend/spotify/spotify-search/spotify-search-text';
import {SPOTIFY_SEARCH_CONCURRENCY} from '../../backend/spotify/spotify-matching-session.service';
import {SPOTIFY_TEST_ANSWERS} from './spotify-test-answers';
import {generateSpotifyMatcherTestSnippet} from './spotify-test-snippet';

type SpotifyTrackCandidateForTest = SpotifyTrackCandidate & {
  duplicateCount: number,
};

type IntegrationStatus = 'pending' | 'running' | 'correct' | 'incorrect' | 'not-found' | 'error';

type IntegrationTestCase = {
  index: number,
  query: string,
  expectedUrl: string,
  expectedTrackId: string | undefined,
};

type IntegrationTestResult = IntegrationTestCase & {
  status: IntegrationStatus,
  foundTrack?: Track,
  acceptedEquivalentTrack?: Track,
  score?: number,
  candidateCount?: number,
  durationMs?: number,
  errorMessage?: string,
};

const NO_VALID_TRACK_ID = '__NO_VALID_SPOTIFY_TRACK__';
const DOES_NOT_EXIST = 'doesnt exist';

@Component({
  selector: 'app-spotify-test',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './spotify-test.component.html'
})
export class SpotifyTestComponent {
  readonly noValidTrackId = NO_VALID_TRACK_ID;
  readonly integrationCases = Object.entries(SPOTIFY_TEST_ANSWERS)
    .map(([query, expectedUrl], index) => ({
      index,
      query,
      expectedUrl,
      expectedTrackId: this.extractSpotifyTrackId(expectedUrl)
    }));

  searchInput = '';
  searchResult: SpotifyMatchResult | undefined;
  searchCandidates: SpotifyTrackCandidateForTest[] = [];
  selectedTrackId = '';
  duplicateCount = 0;
  generatedUnitTest = '';
  isSearching = false;
  searchErrorMessage = '';

  integrationResults: IntegrationTestResult[] = this.createPendingIntegrationResults();
  isIntegrationRunning = false;
  stopIntegrationRequested = false;
  hideCorrectIntegrationResults = false;
  integrationTextFilter = '';

  constructor(private spotifySearch: SpotifySearch) {
  }

  async search(): Promise<void> {
    this.searchResult = undefined;
    this.searchCandidates = [];
    this.selectedTrackId = '';
    this.duplicateCount = 0;
    this.generatedUnitTest = '';
    this.searchErrorMessage = '';

    if (this.searchInput.trim().length === 0) {
      return;
    }

    this.isSearching = true;
    try {
      this.searchResult = await this.spotifySearch.searchTrackCandidates(this.searchInput);
      this.searchCandidates = this.removeDuplicateTracks(this.searchResult.candidates);
      this.selectedTrackId = this.findDefaultSelectedTrackId(this.searchResult);
      this.generateUnitTest();
    } catch (error) {
      this.searchErrorMessage = error instanceof Error ? error.message : 'Could not search Spotify.';
    } finally {
      this.isSearching = false;
    }
  }

  selectTrack(trackId: string): void {
    this.selectedTrackId = trackId;
    this.generateUnitTest();
  }

  selectNoValidTrack(): void {
    this.selectedTrackId = this.noValidTrackId;
    this.generateUnitTest();
  }

  async runIntegrationTest(): Promise<void> {
    if (this.isIntegrationRunning) {
      return;
    }

    this.integrationResults = this.createPendingIntegrationResults();
    this.stopIntegrationRequested = false;
    this.isIntegrationRunning = true;
    const limit = pLimit(SPOTIFY_SEARCH_CONCURRENCY);
    const runningTests = this.integrationCases.map((testCase) => limit(() => this.runIntegrationTestCase(testCase)));

    await Promise.all(runningTests);

    this.isIntegrationRunning = false;
    this.stopIntegrationRequested = false;
  }

  stopIntegrationTest(): void {
    this.stopIntegrationRequested = true;
  }

  get visibleIntegrationResults(): IntegrationTestResult[] {
    const normalizedFilter = this.integrationTextFilter.trim().toLowerCase();

    return this.integrationResults
      .filter((result) => !this.hideCorrectIntegrationResults || result.status !== 'correct')
      .filter((result) => {
        if (normalizedFilter.length === 0) {
          return true;
        }

        return [
          result.query,
          result.expectedUrl,
          result.foundTrack?.name ?? '',
          result.foundTrack?.artists.join(', ') ?? '',
          result.foundTrack?.id ?? '',
          result.acceptedEquivalentTrack?.id ?? ''
        ].join(' ').toLowerCase().includes(normalizedFilter);
      });
  }

  get completedIntegrationCount(): number {
    return this.integrationResults
      .filter((result) => !['pending', 'running'].includes(result.status))
      .length;
  }

  get correctIntegrationCount(): number {
    return this.countIntegrationStatus('correct');
  }

  get incorrectIntegrationCount(): number {
    return this.countIntegrationStatus('incorrect');
  }

  get notFoundIntegrationCount(): number {
    return this.countIntegrationStatus('not-found');
  }

  get errorIntegrationCount(): number {
    return this.countIntegrationStatus('error');
  }

  get integrationProgress(): number {
    if (this.integrationResults.length === 0) {
      return 0;
    }

    return Math.round((this.completedIntegrationCount / this.integrationResults.length) * 100);
  }

  statusLabel(status: IntegrationStatus): string {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'running':
        return 'Running';
      case 'correct':
        return 'Correct';
      case 'incorrect':
        return 'Wrong';
      case 'not-found':
        return 'Not found';
      case 'error':
        return 'Error';
    }
  }

  statusBadgeClass(status: IntegrationStatus): string {
    switch (status) {
      case 'pending':
        return 'text-bg-light';
      case 'running':
        return 'text-bg-info';
      case 'correct':
        return 'text-bg-success';
      case 'incorrect':
        return 'text-bg-danger';
      case 'not-found':
        return 'text-bg-warning';
      case 'error':
        return 'text-bg-dark';
    }
  }

  trackByCandidateId(_: number, candidate: SpotifyTrackCandidateForTest): string {
    return candidate.track.id;
  }

  trackByIntegrationIndex(_: number, result: IntegrationTestResult): number {
    return result.index;
  }

  private createPendingIntegrationResults(): IntegrationTestResult[] {
    return this.integrationCases.map((testCase) => ({
      ...testCase,
      status: 'pending'
    }));
  }

  private updateIntegrationResult(index: number, result: IntegrationTestResult): void {
    const results = this.integrationResults.slice();
    results[index] = result;
    this.integrationResults = results;
  }

  private async runIntegrationTestCase(testCase: IntegrationTestCase): Promise<void> {
    if (this.stopIntegrationRequested) {
      return;
    }

    this.updateIntegrationResult(testCase.index, {
      ...this.integrationResults[testCase.index],
      status: 'running'
    });

    const startedAt = Date.now();
    try {
      const result = await this.spotifySearch.searchTrackCandidates(testCase.query);
      const autoMatch = result.autoMatch;
      const acceptedEquivalentTrack = this.findAcceptedEquivalentTrack(testCase, autoMatch?.track, result.candidates);
      this.updateIntegrationResult(testCase.index, {
        ...this.integrationResults[testCase.index],
        status: this.determineIntegrationStatus(testCase, autoMatch?.track, acceptedEquivalentTrack),
        foundTrack: autoMatch?.track,
        acceptedEquivalentTrack,
        score: autoMatch?.score,
        candidateCount: result.candidates.length,
        durationMs: Date.now() - startedAt
      });
    } catch (error) {
      this.updateIntegrationResult(testCase.index, {
        ...this.integrationResults[testCase.index],
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Could not search Spotify.',
        durationMs: Date.now() - startedAt
      });
    }
  }

  private determineIntegrationStatus(
    testCase: IntegrationTestCase,
    foundTrack: Track | undefined,
    acceptedEquivalentTrack: Track | undefined
  ): IntegrationStatus {
    if (foundTrack === undefined) {
      return testCase.expectedTrackId === undefined ? 'correct' : 'not-found';
    }

    if (testCase.expectedTrackId === undefined) {
      return 'incorrect';
    }

    return foundTrack.id === testCase.expectedTrackId || acceptedEquivalentTrack !== undefined ? 'correct' : 'incorrect';
  }

  private findAcceptedEquivalentTrack(
    testCase: IntegrationTestCase,
    foundTrack: Track | undefined,
    candidates: SpotifyTrackCandidate[]
  ): Track | undefined {
    if (foundTrack === undefined || testCase.expectedTrackId === undefined || foundTrack.id === testCase.expectedTrackId) {
      return undefined;
    }

    return candidates
      .map((candidate) => candidate.track)
      .find((track) => track.id === testCase.expectedTrackId && this.hasSameNameAndArtists(track, foundTrack));
  }

  private hasSameNameAndArtists(firstTrack: Track, secondTrack: Track): boolean {
    return firstTrack.name === secondTrack.name
      && firstTrack.artists.length === secondTrack.artists.length
      && firstTrack.artists.every((artist, index) => artist === secondTrack.artists[index]);
  }

  private countIntegrationStatus(status: IntegrationStatus): number {
    return this.integrationResults
      .filter((result) => result.status === status)
      .length;
  }

  private removeDuplicateTracks(candidates: SpotifyTrackCandidate[]): SpotifyTrackCandidateForTest[] {
    const candidatesByTrackText = new Map<string, SpotifyTrackCandidateForTest>();
    candidates.forEach((candidate) => {
      const key = this.createTrackTextKey(candidate.track);
      const existingCandidate = candidatesByTrackText.get(key);
      if (existingCandidate) {
        existingCandidate.duplicateCount++;
        this.duplicateCount++;
      } else {
        candidatesByTrackText.set(key, {
          ...candidate,
          duplicateCount: 1
        });
      }
    });

    return Array.from(candidatesByTrackText.values());
  }

  private findDefaultSelectedTrackId(result: SpotifyMatchResult): string {
    const autoMatch = result.autoMatch;
    if (!autoMatch) {
      return '';
    }

    const exactCandidate = this.searchCandidates.find((candidate) => candidate.track.id === autoMatch.track.id);
    if (exactCandidate) {
      return exactCandidate.track.id;
    }

    const autoMatchTextKey = this.createTrackTextKey(autoMatch.track);
    const duplicateCandidate = this.searchCandidates.find((candidate) => this.createTrackTextKey(candidate.track) === autoMatchTextKey);
    return duplicateCandidate?.track.id ?? '';
  }

  private generateUnitTest(): void {
    const tracks = this.searchCandidates.map((candidate) => candidate.track);
    if (this.selectedTrackId === this.noValidTrackId) {
      this.generatedUnitTest = generateSpotifyMatcherTestSnippet(this.searchInput, tracks, {type: 'noMatch'});
      return;
    }

    const selectedCandidate = this.searchCandidates.find((candidate) => candidate.track.id === this.selectedTrackId);
    if (!selectedCandidate) {
      this.generatedUnitTest = '';
      return;
    }

    this.generatedUnitTest = generateSpotifyMatcherTestSnippet(
      this.searchInput,
      tracks,
      {type: 'autoMatch', trackId: selectedCandidate.track.id}
    );
  }

  private createTrackTextKey(track: Track): string {
    return [
      tokenizeSpotifyText(track.name),
      ...track.artists.map((artist) => tokenizeSpotifyText(artist))
    ].join('|');
  }

  private extractSpotifyTrackId(url: string): string | undefined {
    if (url === DOES_NOT_EXIST) {
      return undefined;
    }

    return /\/track\/([^?]+)/.exec(url)?.[1];
  }
}
