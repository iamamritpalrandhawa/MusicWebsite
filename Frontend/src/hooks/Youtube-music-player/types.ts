export enum PlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5,
}

export type PlayerDetails = {
  id: string;
  state: PlayerState;
  title: string;
  duration: number;
  currentTime: number;
  volume: number;
};
