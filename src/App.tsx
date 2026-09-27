import { useEffect, useMemo, useState } from 'react';
import { useAudio } from './hooks/useAudio';
import { useGameState } from './hooks/useGameState';
import { useMultiplayer } from './hooks/useMultiplayer';
import GameBoard from './components/GameBoard';
import ExpeditionSetup from './components/ExpeditionSetup';
import type { SharedGameSnapshot } from './types/game';

interface SavedSettings {
  isMutedMusic: boolean;
  isMutedSfx: boolean;
  volume: number;
}

const getSavedAudioSettings = (): SavedSettings => {
  try {
    const item = window.localStorage.getItem('cozy_alchemy_save_v1');
    if (item) {
      const parsed = JSON.parse(item);
      return {
        isMutedMusic: parsed.isMutedMusic ?? false,
        isMutedSfx: parsed.isMutedSfx ?? false,
        volume: parsed.volume ?? 0.5,
      };
    }
  } catch (error) {
    console.warn('Could not read saved settings', error);
  }
  return { isMutedMusic: false, isMutedSfx: false, volume: 0.5 };
};

export default function App() {
  const initialSettings = useMemo(getSavedAudioSettings, []);
  const [hasEnteredGame, setHasEnteredGame] = useState(false);
  const audio = useAudio(initialSettings.isMutedMusic, initialSettings.isMutedSfx, initialSettings.volume);
  const gameState = useGameState(audio);
  const multiplayer = useMultiplayer({ onSnapshot: gameState.applySharedSnapshot });

  const sharedSnapshot: SharedGameSnapshot = useMemo(() => ({
    discoveredElements: gameState.discoveredElements,
    achievements: gameState.unlockedAchievements,
    elapsedTime: gameState.elapsedTime,
    hasWon: gameState.hasWon,
    isActive: gameState.isActive,
  }), [
    gameState.discoveredElements,
    gameState.unlockedAchievements,
    gameState.elapsedTime,
    gameState.hasWon,
    gameState.isActive,
  ]);

  useEffect(() => {
    if (multiplayer.roomStarted) setHasEnteredGame(true);
  }, [multiplayer.roomStarted]);

  useEffect(() => {
    if (!multiplayer.roomCode || !multiplayer.roomStarted) return;
    multiplayer.syncState(sharedSnapshot);
  }, [
    gameState.discoveredElements,
    gameState.unlockedAchievements,
    gameState.hasWon,
    multiplayer.roomCode,
    multiplayer.roomStarted,
  ]);

  useEffect(() => {
    if (!multiplayer.isHost || !multiplayer.roomStarted || gameState.elapsedTime % 5 !== 0) return;
    multiplayer.syncState(sharedSnapshot);
  }, [gameState.elapsedTime, multiplayer.isHost, multiplayer.roomStarted]);

  if (hasEnteredGame && gameState.isActive) {
    return (
      <GameBoard
        gameState={gameState}
        multiplayer={multiplayer.roomCode ? multiplayer : undefined}
        onLeaveShared={() => {
          multiplayer.leaveRoom();
          gameState.exitToMenu();
          setHasEnteredGame(false);
        }}
      />
    );
  }

  return (
    <ExpeditionSetup
      hasSavedMatch={gameState.hasSavedMatch}
      multiplayer={multiplayer}
      onCreateRoom={(name) => multiplayer.createRoom(name, sharedSnapshot)}
      isMutedMusic={gameState.isMutedMusic}
      isMutedSfx={gameState.isMutedSfx}
      volume={gameState.volume}
      toggleMusic={gameState.toggleMusic}
      toggleSfx={gameState.toggleSfx}
      changeVolume={gameState.changeVolume}
    />
  );
}
