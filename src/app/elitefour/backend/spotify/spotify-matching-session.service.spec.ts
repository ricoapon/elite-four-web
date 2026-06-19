import {SpotifyMatchingSessionService} from './spotify-matching-session.service';
import {FavoriteListsRepositorySpec} from '../spec-helper-mocks.spec';
import {SpotifyMatchResult, Track} from './spotify-search';

describe('SpotifyMatchingSessionService', () => {
  let repository: FavoriteListsRepositorySpec;
  let searchTrackCandidates: jasmine.Spy;
  let service: SpotifyMatchingSessionService;

  beforeEach(() => {
    repository = new FavoriteListsRepositorySpec();
    searchTrackCandidates = jasmine.createSpy('searchTrackCandidates');
    service = new SpotifyMatchingSessionService(repository, {searchTrackCandidates} as any);
  });

  it('auto-matches items and saves the Spotify reference', async () => {
    repository.addFavoriteList('some-list', 20);
    repository.addItemToFavoriteList(1, 'Billy Talent - Fallen Leaves');
    searchTrackCandidates.and.returnValue(Promise.resolve(autoMatchResult(track('Fallen Leaves', 'track-id'))));

    service.start(repository.getValue()[0]);
    await service.whenProcessingComplete();

    expect(repository.getValue()[0].items[0].spotify).toEqual({
      id: 'track-id',
      externalUrl: 'https://open.spotify.com/track/track-id'
    });
    expect(service.state.autoMatched).toEqual(1);
  });

  it('queues non-auto matches and continues with later songs', async () => {
    repository.addFavoriteList('some-list', 20);
    repository.addItemToFavoriteList(1, 'Needs review');
    repository.addItemToFavoriteList(1, 'Auto match');
    searchTrackCandidates.and.returnValues(
      Promise.resolve({candidates: [{track: track('Candidate', 'candidate-id'), score: 0.2}]}),
      Promise.resolve(autoMatchResult(track('Auto match', 'auto-id')))
    );

    service.start(repository.getValue()[0]);
    await service.whenProcessingComplete();

    expect(service.state.reviewTasks).toHaveSize(1);
    expect(service.state.reviewTasks[0].itemName).toEqual('Needs review');
    expect(repository.getValue()[0].items[1].spotify.id).toEqual('auto-id');
  });

  it('filters weak candidates from review tasks', async () => {
    repository.addFavoriteList('some-list', 20);
    repository.addItemToFavoriteList(1, 'Needs review');
    searchTrackCandidates.and.returnValue(Promise.resolve({
      candidates: [
        {track: track('Good candidate', 'good-id'), score: 0.2},
        {track: track('Weak candidate', 'weak-id'), score: 0.8},
        {track: track('Bad candidate', 'bad-id'), score: 0.95}
      ]
    }));

    service.start(repository.getValue()[0]);
    await service.whenProcessingComplete();

    expect(service.state.reviewTasks[0].status).toEqual('candidates');
    expect(service.state.reviewTasks[0].candidates.map((candidate) => candidate.track.id)).toEqual(['good-id']);
  });

  it('creates a no-candidates review task when every candidate is weak', async () => {
    repository.addFavoriteList('some-list', 20);
    repository.addItemToFavoriteList(1, 'Needs manual URL');
    searchTrackCandidates.and.returnValue(Promise.resolve({
      candidates: [
        {track: track('Weak candidate', 'weak-id'), score: 0.8},
        {track: track('Bad candidate', 'bad-id'), score: 0.95}
      ]
    }));

    service.start(repository.getValue()[0]);
    await service.whenProcessingComplete();

    expect(service.state.reviewTasks[0].status).toEqual('no-candidates');
    expect(service.state.reviewTasks[0].candidates).toEqual([]);
  });

  it('saves a selected candidate and removes the review task', async () => {
    repository.addFavoriteList('some-list', 20);
    repository.addItemToFavoriteList(1, 'Needs review');
    const candidate = {track: track('Candidate', 'candidate-id'), score: 0.2};
    searchTrackCandidates.and.returnValue(Promise.resolve({candidates: [candidate]}));

    service.start(repository.getValue()[0]);
    await service.whenProcessingComplete();
    service.chooseCandidate(service.state.reviewTasks[0].id, candidate);

    expect(repository.getValue()[0].items[0].spotify.id).toEqual('candidate-id');
    expect(service.state.reviewTasks).toHaveSize(0);
  });

  it('saves a manual Spotify reference and removes the review task', async () => {
    repository.addFavoriteList('some-list', 20);
    repository.addItemToFavoriteList(1, 'Needs manual URL');
    searchTrackCandidates.and.returnValue(Promise.resolve({candidates: []}));

    service.start(repository.getValue()[0]);
    await service.whenProcessingComplete();
    service.chooseManualTrack(service.state.reviewTasks[0].id, {
      id: 'manual-id',
      externalUrl: 'https://open.spotify.com/track/manual-id'
    });

    expect(repository.getValue()[0].items[0].spotify.id).toEqual('manual-id');
    expect(service.state.reviewTasks).toHaveSize(0);
  });

  it('skips only the current session and leaves the item unmatched', async () => {
    repository.addFavoriteList('some-list', 20);
    repository.addItemToFavoriteList(1, 'Not on Spotify');
    searchTrackCandidates.and.returnValue(Promise.resolve({candidates: []}));

    service.start(repository.getValue()[0]);
    await service.whenProcessingComplete();
    service.skipTask(service.state.reviewTasks[0].id);

    expect(repository.getValue()[0].items[0].spotify).toBeUndefined();
    expect(service.state.skipped).toEqual(1);
    expect(service.state.reviewTasks).toHaveSize(0);
  });

  it('does not overwrite existing Spotify links during auto-matching', async () => {
    repository.addFavoriteList('some-list', 20);
    repository.addItemToFavoriteList(1, 'Existing item');
    repository.addItemToFavoriteList(1, 'Open item');
    repository.getValue()[0].items[1].spotify = {
      id: 'existing-id',
      externalUrl: 'https://open.spotify.com/track/existing-id'
    };
    searchTrackCandidates.and.returnValue(Promise.resolve(autoMatchResult(track('Existing item', 'new-id'))));

    service.start(repository.getValue()[0]);
    await service.whenProcessingComplete();

    expect(repository.getValue()[0].items[0].spotify.id).toEqual('new-id');
    expect(repository.getValue()[0].items[1].spotify.id).toEqual('existing-id');
    expect(searchTrackCandidates).toHaveBeenCalledTimes(1);
  });

  it('turns errors into review tasks and keeps processing later songs', async () => {
    repository.addFavoriteList('some-list', 20);
    repository.addItemToFavoriteList(1, 'Broken search');
    repository.addItemToFavoriteList(1, 'Auto match');
    searchTrackCandidates.and.returnValues(
      Promise.reject(new Error('Spotify failed')),
      Promise.resolve(autoMatchResult(track('Auto match', 'auto-id')))
    );

    service.start(repository.getValue()[0]);
    await service.whenProcessingComplete();

    expect(service.state.reviewTasks).toHaveSize(1);
    expect(service.state.reviewTasks[0].status).toEqual('error');
    expect(service.state.errors).toEqual(1);
    expect(repository.getValue()[0].items[1].spotify.id).toEqual('auto-id');
  });

  it('ignores an abandoned run when its Spotify request resolves later', async () => {
    repository.addFavoriteList('first-list', 20);
    repository.addItemToFavoriteList(1, 'Old request');
    const abandonedResult = createDeferred<SpotifyMatchResult>();
    searchTrackCandidates.and.returnValues(
      abandonedResult.promise,
      Promise.resolve(autoMatchResult(track('New request', 'new-id')))
    );

    service.start(repository.getValue()[0]);
    service.abandonSession();
    repository.addFavoriteList('second-list', 20);
    repository.addItemToFavoriteList(2, 'New request');
    service.start(repository.getValue()[1]);
    await service.whenProcessingComplete();

    abandonedResult.resolve(autoMatchResult(track('Old request', 'old-id')));
    await abandonedResult.promise;
    await Promise.resolve();

    expect(service.state.listId).toEqual(2);
    expect(service.state.total).toEqual(1);
    expect(service.state.processed).toEqual(1);
    expect(repository.getValue()[0].items[0].spotify).toBeUndefined();
    expect(repository.getValue()[1].items[0].spotify.id).toEqual('new-id');
  });

  function autoMatchResult(foundTrack: Track): SpotifyMatchResult {
    return {
      candidates: [{track: foundTrack, score: 0.01}],
      autoMatch: {track: foundTrack, score: 0.01}
    };
  }

  function track(name: string, id: string): Track {
    return {
      name,
      artists: ['Some Artist'],
      id,
      externalUrl: 'https://open.spotify.com/track/' + id
    };
  }

  function createDeferred<T>(): {promise: Promise<T>, resolve: (value: T) => void} {
    let resolve: (value: T) => void = () => {};
    const promise = new Promise<T>((promiseResolve) => {
      resolve = promiseResolve;
    });

    return {promise, resolve};
  }
});
