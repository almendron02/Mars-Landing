export type Era = 'Nature' | 'Life' | 'Human' | 'Civilization' | 'Industry' | 'Space';

export interface Element {
  id: string;
  name: string;
  era: Era;
  description?: string;
}

export interface Recipe {
  id: string; // Typically "element1-element2" in alphabetical order
  element1: string;
  element2: string;
  result: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconId: string;
}

export interface GameState {
  discoveredElements: string[]; // List of element IDs
  achievements: string[]; // List of achievement IDs
  elapsedTime: number; // in seconds
  isMutedMusic: boolean;
  isMutedSfx: boolean;
  volume: number; // 0 to 1
  hasWon: boolean;
  isActive: boolean; // false when paused
}
