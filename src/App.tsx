import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAudio } from './hooks/useAudio';
import { DEFAULT_GAME_STATE, useGameState } from './hooks/useGameState';
import { useMultiplayer } from './hooks/useMultiplayer';
import GameBoard from './components/GameBoard';
import ExpeditionSetup from './components/ExpeditionSetup';
import { createHostedWorld, deleteHostedWorld, migrateLegacyWorld, updateHostedWorld } from './lib/hostedWorlds';
import type { GameState, HostedWorld, SharedGameSnapshot } from './types/game';

const WORLDS_KEY = 'mars_hosted_worlds_v1';
const AUDIO_KEY = 'mars_audio_settings_v1';
const LEGACY_KEY = 'cozy_alchemy_save_v1';

type SessionKind = 'host' | 'guest' | null;
type AudioSettings = Pick<GameState, 'isMutedMusic' | 'isMutedSfx' | 'volume'>;

const readJson = <T,>(key: string): T | null => {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) as T : null;
  } catch (error) {
    console.warn(`Could not read ${key}`, error);
    return null;
  }
};

const getSavedAudioSettings = (): AudioSettings => {
  const saved = readJson<AudioSettings>(AUDIO_KEY) ?? readJson<GameState>(LEGACY_KEY);
  return {
    isMutedMusic: saved?.isMutedMusic ?? false,
    isMutedSfx: saved?.isMutedSfx ?? false,
    volume: saved?.volume ?? 0.5,
  };
};

const getInitialWorlds = () => {
  const worlds = readJson<HostedWorld[]>(WORLDS_KEY) ?? [];
  const migrated = migrateLegacyWorld(worlds, readJson<GameState>(LEGACY_KEY));
  if (migrated !== worlds) window.localStorage.setItem(WORLDS_KEY, JSON.stringify(migrated));
  return migrated;
};

const toSharedSnapshot = (state: GameState): SharedGameSnapshot => ({
  discoveredElements: state.discoveredElements,
  achievements: state.achievements,
  elapsedTime: state.elapsedTime,
  hasWon: state.hasWon,
  isActive: state.isActive,
});

export default function App() {
  const initialSettings = useMemo(getSavedAudioSettings, []);
  const [hostedWorlds, setHostedWorlds] = useState<HostedWorld[]>(getInitialWorlds);
  const [activeWorldId, setActiveWorldId] = useState<string | null>(null);
  const [sessionKind, setSessionKind] = useState<SessionKind>(null);
  const [hasEnteredGame, setHasEnteredGame] = useState(false);
  const [shouldAutoStart, setShouldAutoStart] = useState(false);
  const audio = useAudio(initialSettings.isMutedMusic, initialSettings.isMutedSfx, initialSettings.volume);
  const gameState = useGameState(audio, initialSettings);
  const multiplayer = useMultiplayer({ onSnapshot: gameState.applySharedSnapshot });

  const currentGameState: GameState = useMemo(() => ({
    discoveredElements: gameState.discoveredElements,
    achievements: gameState.unlockedAchievements,
    elapsedTime: gameState.elapsedTime,
    isMutedMusic: gameState.isMutedMusic,
    isMutedSfx: gameState.isMutedSfx,
    volume: gameState.volume,
    hasWon: gameState.hasWon,
    isActive: gameState.isActive,
  }), [
    gameState.discoveredElements, gameState.unlockedAchievements, gameState.elapsedTime,
    gameState.isMutedMusic, gameState.isMutedSfx, gameState.volume, gameState.hasWon, gameState.isActive,
  ]);

  const sharedSnapshot = useMemo(() => toSharedSnapshot(currentGameState), [currentGameState]);

  useEffect(() => {
    window.localStorage.setItem(WORLDS_KEY, JSON.stringify(hostedWorlds));
  }, [hostedWorlds]);

  useEffect(() => {
    window.localStorage.setItem(AUDIO_KEY, JSON.stringify({
      isMutedMusic: gameState.isMutedMusic,
      isMutedSfx: gameState.isMutedSfx,
      volume: gameState.volume,
    }));
  }, [gameState.isMutedMusic, gameState.isMutedSfx, gameState.volume]);

  useEffect(() => {
    if (sessionKind !== 'host' || !activeWorldId) return;
    setHostedWorlds((worlds) => updateHostedWorld(worlds, activeWorldId, currentGameState));
  }, [activeWorldId, currentGameState, sessionKind]);

  useEffect(() => {
    if (!shouldAutoStart || !multiplayer.roomCode || !multiplayer.isHost || multiplayer.roomStarted) return;
    multiplayer.startRoom();
    setShouldAutoStart(false);
  }, [multiplayer.isHost, multiplayer.roomCode, multiplayer.roomStarted, shouldAutoStart]);

  useEffect(() => {
    if (multiplayer.roomStarted) setHasEnteredGame(true);
  }, [multiplayer.roomStarted]);

  useEffect(() => {
    if (sessionKind !== 'guest' || !multiplayer.roomClosed) return;
    gameState.exitToMenu();
    setHasEnteredGame(false);
    setSessionKind(null);
  }, [gameState.exitToMenu, multiplayer.roomClosed, sessionKind]);

  useEffect(() => {
    if (!multiplayer.roomCode || !multiplayer.roomStarted) return;
    multiplayer.syncState(sharedSnapshot);
  }, [gameState.discoveredElements, gameState.unlockedAchievements, gameState.hasWon, multiplayer.roomCode, multiplayer.roomStarted]);

  useEffect(() => {
    if (!multiplayer.isHost || !multiplayer.roomStarted || gameState.elapsedTime % 5 !== 0) return;
    multiplayer.syncState(sharedSnapshot);
  }, [gameState.elapsedTime, multiplayer.isHost, multiplayer.roomStarted]);

  const beginHosting = useCallback((world: HostedWorld, explorerName: string) => {
    multiplayer.leaveRoom();
    const activeSnapshot = { ...world.snapshot, isActive: true };
    gameState.loadGame(activeSnapshot);
    setActiveWorldId(world.id);
    setSessionKind('host');
    setShouldAutoStart(true);
    multiplayer.createRoom(explorerName, toSharedSnapshot(activeSnapshot));
  }, [gameState.loadGame, multiplayer]);

  const createWorld = useCallback((explorerName: string) => {
    const initialWorldState: GameState = {
      ...DEFAULT_GAME_STATE,
      discoveredElements: [...DEFAULT_GAME_STATE.discoveredElements],
      achievements: [],
      isMutedMusic: gameState.isMutedMusic,
      isMutedSfx: gameState.isMutedSfx,
      volume: gameState.volume,
      isActive: true,
    };
    const result = createHostedWorld(hostedWorlds, initialWorldState);
    if (!result.ok) return false;
    setHostedWorlds(result.worlds);
    beginHosting(result.world, explorerName);
    return true;
  }, [beginHosting, gameState.isMutedMusic, gameState.isMutedSfx, gameState.volume, hostedWorlds]);

  const selectWorld = useCallback((worldId: string, explorerName: string) => {
    const world = hostedWorlds.find((candidate) => candidate.id === worldId);
    if (world) beginHosting(world, explorerName);
  }, [beginHosting, hostedWorlds]);

  const joinWorld = useCallback((explorerName: string, code: string) => {
    multiplayer.leaveRoom();
    gameState.loadGame({
      ...DEFAULT_GAME_STATE,
      discoveredElements: [...DEFAULT_GAME_STATE.discoveredElements],
      achievements: [],
      isMutedMusic: gameState.isMutedMusic,
      isMutedSfx: gameState.isMutedSfx,
      volume: gameState.volume,
    });
    setActiveWorldId(null);
    setSessionKind('guest');
    multiplayer.joinRoom(explorerName, code);
  }, [gameState, multiplayer]);

  const leaveSession = useCallback(() => {
    multiplayer.leaveRoom();
    gameState.exitToMenu();
    setActiveWorldId(null);
    setSessionKind(null);
    setHasEnteredGame(false);
    setShouldAutoStart(false);
  }, [gameState.exitToMenu, multiplayer]);

  if (hasEnteredGame && gameState.isActive) {
    return (
      <GameBoard
        gameState={gameState}
        multiplayer={multiplayer.roomCode ? multiplayer : undefined}
        onLeaveShared={leaveSession}
        isWorldOwner={sessionKind === 'host'}
      />
    );
  }

  return (
    <ExpeditionSetup
      hostedWorlds={hostedWorlds}
      multiplayer={multiplayer}
      onCreateWorld={createWorld}
      onSelectWorld={selectWorld}
      onDeleteWorld={(worldId) => setHostedWorlds((worlds) => deleteHostedWorld(worlds, worldId))}
      onJoinWorld={joinWorld}
      isMutedMusic={gameState.isMutedMusic}
      isMutedSfx={gameState.isMutedSfx}
      volume={gameState.volume}
      toggleMusic={gameState.toggleMusic}
      toggleSfx={gameState.toggleSfx}
      changeVolume={gameState.changeVolume}
    />
  );
}
