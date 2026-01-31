import { Component } from '@angular/core';
import {SpotifySearch, Track} from '../../backend/spotify/spotify-search';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';

export type FoundUnverifiedTrack = {
  line: string,
  track: Track,
};

export type FoundIncorrectTrack = {
  line: string,
  foundTrack: Track,
  actualTrack: Track,
};

@Component({
  selector: 'app-integration-test',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './integration-test.component.html',
  styleUrl: './integration-test.component.css'
})
export class IntegrationTestComponent {
  textAreaContent: string = ''

  // Results
  didNotFindTracks: string[]
  foundTrackButDontKnowIfCorrect: FoundUnverifiedTrack[]
  foundTrackButIncorrect: FoundIncorrectTrack[]
  correct: number

  constructor(public spotifySearch: SpotifySearch) {
  }

  start() {
    this.didNotFindTracks = []
    this.foundTrackButDontKnowIfCorrect = []
    this.foundTrackButIncorrect = []
    this.correct = 0

    let items: string[] = this.textAreaContent.trim().split(/\r?\n/)
    items.forEach((value) => {
      this.spotifySearch.searchTrack(value.trim()).then(
        (track) => {
          if (track === undefined) {
            this.didNotFindTracks.push(value)
          }
          let answer = ANSWERS[value]
          if (answer === undefined) {
            this.foundTrackButDontKnowIfCorrect.push({
              line: value,
              track: track
            })
          } else if (answer !== track.externalUrl) {
            this.foundTrackButIncorrect.push({
              line: value,
              foundTrack: track,
              actualTrack: answer
            })
          } else {
            this.correct++
          }
        }
      )
    })
  }
}

let ANSWERS = {
  'Muse – New Born': 'https://open.spotify.com/track/2VrJMuLt2m9HbifGrKWHqk',
  'Shallows – Summer Sucks': 'https://open.spotify.com/track/3HKd06qhZs78WNZ22XAzPD',
  'Porcupine Tree – Sentimental': 'https://open.spotify.com/track/5pQNsm5hmOUVwgRtDGijyi'
}
