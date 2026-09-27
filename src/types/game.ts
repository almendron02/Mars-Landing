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

export interface HostedWorld {
  id: string;
  slot: 1 | 2 | 3;
  createdAt: number;
  updatedAt: number;
  snapshot: GameState;
}

export interface SharedGameSnapshot {
  discoveredElements: string[];
  achievements: string[];
  elapsedTime: number;
  hasWon: boolean;
  isActive: boolean;
}

export interface MultiplayerPlayer {
  id: string;
  name: string;
  color: string;
  isHost: boolean;
}

export interface SharedDiscovery {
  elementId: string;
  playerId: string;
  playerName: string;
  createdAt: number;
}
