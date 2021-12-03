export enum STATES {
  INIT,
  ONGOING,
}

export interface Player {
  id: string;
  name: string;
  cash: number;
  character?: string;
  new?: boolean;
  bank?: boolean;
}

export interface GameState {
  players: Array<Player>;
  startingCash: number;
  state: STATES;
}

export type Players = Array<Player>;
