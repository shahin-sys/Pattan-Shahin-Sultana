
export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  color: string;
}

export interface GameState {
  snake: Point[];
  food: Point;
  direction: Direction;
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
  highScore: number;
}

export interface Point {
  x: number;
  y: number;
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}
