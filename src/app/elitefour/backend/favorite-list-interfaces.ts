export type FavoriteList = {
  id: number,
  name: string,
  tsCreated: Date,
  status: FavoriteListStatus,
  items: FavoriteItem[],
  nrOfItemsToBeShownOnScreen: number
};

export type SpotifyTrackReference = {
  id: string,
  externalUrl: string,
};

export type FavoriteItem = {
  id: number,
  name: string,
  favoritePosition?: number,
  eliminatedBy: number[],
  toBeChosen: boolean,
  spotify?: SpotifyTrackReference,
};

export enum FavoriteListStatus {
  CREATED = 'Created',
  ONGOING = 'Ongoing',
  FINISHED = 'Finished'
}
