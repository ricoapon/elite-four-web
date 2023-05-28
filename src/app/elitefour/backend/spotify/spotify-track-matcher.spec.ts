import {findBestMatchingTrack} from './spotify-track-matcher';

describe('SpotifyTrackMatcher#findBestMatchingTrack', () => {
  it('happy flow', () => {
    // Given
    const search = 'Billy Talent - Fallen Leaves';
    const foundTracks = [
      {
        name: 'Fallen Leaves',
        artists: ['Billy Talent'],
        id: 'correct',
        externalUrl: '',
      },
      {
        name: 'Fallen Leaves - Live',
        artists: ['Billy Talent'],
        id: 'incorrect1',
        externalUrl: '',
      },
      {
        name: 'Fallen Leaves - Radio Edit',
        artists: ['Billy Talent'],
        id: 'incorrect2',
        externalUrl: '',
      }];

    // When
    const selectedTrack = findBestMatchingTrack(search, foundTracks);

    // Then
    expect(selectedTrack.id).toEqual('correct');
  });

  it('select track with best number of matching words', () => {
    // Given
    const search = 'Billy Talent - Fallen Leaves Live';
    const foundTracks = [
      {
        name: 'Fallen Leaves - Live with too many words',
        artists: ['Billy Talent'],
        id: 'incorrect1',
        externalUrl: '',
      },
      {
        name: 'Fallen Leaves - Live',
        artists: ['Billy Talent'],
        id: 'correct',
        externalUrl: '',
      },
      {
        name: 'Fallen Leaves - Live at MTV Campus Invasion Germany',
        artists: ['Billy Talent'],
        id: 'incorrect2',
        externalUrl: '',
      }];

    // When
    const selectedTrack = findBestMatchingTrack(search, foundTracks);

    // Then
    expect(selectedTrack.id).toEqual('correct');
  });

  it('ignore diacritics', () => {
    // Given
    const search = 'Sexion d\'Assaut - desole';
    const foundTracks = [
      {
        name: 'Désolé',
        artists: ['Sexion d\'Assaut'],
        id: 'correct',
        externalUrl: '',
      },
      {
        name: 'Desole',
        artists: ['Sexion d\'Assaut'],
        id: 'incorrect1',
        externalUrl: '',
      }];

    // When
    const selectedTrack = findBestMatchingTrack(search, foundTracks);

    // Then
    expect(selectedTrack.id).toEqual('correct');
  });

  it('ignore casing', () => {
    // Given
    const search = 'BILLY TALENT FALLEN LEAVES';
    const foundTracks = [
      {
        name: 'fallen leaves',
        artists: ['billy talent'],
        id: 'correct',
        externalUrl: '',
      },
      {
        name: 'FALLEN LEAVES',
        artists: ['BILLY TALENT'],
        id: 'incorrect1',
        externalUrl: '',
      }];

    // When
    const selectedTrack = findBestMatchingTrack(search, foundTracks);

    // Then
    expect(selectedTrack.id).toEqual('correct');
  });

  it('return undefined if no proper match', () => {
    // Given
    const search = 'Krystal Harris - Super Girl';
    const foundTracks = [
      {
        name: 'Super girl',
        artists: ['Reamonn'],
        id: 'incorrect1',
        externalUrl: '',
      },
      {
        name: 'Super girl',
        artists: ['Anna Naklab'],
        id: 'incorrect2',
        externalUrl: '',
      },
      {
        name: 'Super Freaky Girl',
        artists: ['Nicki Minaj'],
        id: 'incorrect3',
        externalUrl: '',
      },
      {
        name: 'Goodby',
        artists: ['Krystal Harris'],
        id: 'incorrect4',
        externalUrl: '',
      },
    ];

    // When
    const selectedTrack = findBestMatchingTrack(search, foundTracks);

    // Then
    expect(selectedTrack).toBeUndefined();
  })

  it('return radio edit if no matches would occur with the radio edit', () => {
    // Given
    const search = 'Avicii - Levels';
    const foundTracks = [
      {
        name: 'Levels Radio Edit',
        artists: ['Avicii'],
        id: 'correct',
        externalUrl: '',
      },
    ];

    // When
    const selectedTrack = findBestMatchingTrack(search, foundTracks);

    // Then
    expect(selectedTrack.id).toEqual('correct');
  })
});
