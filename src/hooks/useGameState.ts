import { useState, useEffect, useCallback } from 'react';
import { GameState, Element, Achievement, SharedGameSnapshot } from '../types/game';
import { ELEMENTS, STARTING_ELEMENTS } from '../data/elements';
import { getRecipeResult } from '../data/recipes';
import { ACHIEVEMENTS } from '../data/achievements';
import { useTimer } from './useTimer';

export const DEFAULT_GAME_STATE: GameState = {
  discoveredElements: STARTING_ELEMENTS,
  achievements: [],
  elapsedTime: 0,
  isMutedMusic: false,
  isMutedSfx: false,
  volume: 0.5,
  hasWon: false,
  isActive: false, // Wait until game starts
};

const hasSameIds = (current: string[], incoming: string[]) =>
  current.length === incoming.length && current.every((id, index) => id === incoming[index]);

export function useGameState(
  audio: ReturnType<typeof import('./useAudio').useAudio>,
  initialAudio: Pick<GameState, 'isMutedMusic' | 'isMutedSfx' | 'volume'> = DEFAULT_GAME_STATE,
) {
  // Game states in active memory
  const [discoveredElements, setDiscoveredElements] = useState<string[]>(DEFAULT_GAME_STATE.discoveredElements);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(DEFAULT_GAME_STATE.achievements);
  const [hasWon, setHasWon] = useState<boolean>(DEFAULT_GAME_STATE.hasWon);
  const [isMutedMusic, setIsMutedMusic] = useState<boolean>(initialAudio.isMutedMusic);
  const [isMutedSfx, setIsMutedSfx] = useState<boolean>(initialAudio.isMutedSfx);
  const [volume, setVolume] = useState<number>(initialAudio.volume);
  const [isActive, setIsActive] = useState<boolean>(DEFAULT_GAME_STATE.isActive);
  const [hasUnseenRecipes, setHasUnseenRecipes] = useState(false);
  const [hasUnseenAwards, setHasUnseenAwards] = useState(false);

  // Notifications
  const [newDiscoveryToast, setNewDiscoveryToast] = useState<Element | null>(null);
  const [newAchievementToast, setNewAchievementToast] = useState<Achievement | null>(null);

  // Menu modal overlay state
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Timer
  const { elapsedTime, setElapsedTime, resetTimer } = useTimer(isActive && !hasWon && !isMenuOpen, 0);

  // Synchronize audio hook whenever settings change
  useEffect(() => {
    audio.updateVolume?.(volume);
  }, [volume, audio]);

  useEffect(() => {
    audio.updateMutedMusic?.(isMutedMusic);
  }, [isMutedMusic, audio]);

  useEffect(() => {
    audio.updateMutedSfx?.(isMutedSfx);
  }, [isMutedSfx, audio]);

  // Pause & Resume
  const pauseGame = useCallback(() => {
    setIsMenuOpen(true);
  }, []);

  const resumeGame = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Check achievements after discovery
  const checkAchievements = useCallback((currentDiscoveries: string[], currentSecs: number, alreadyUnlocked: string[]) => {
    const newlyUnlocked: string[] = [...alreadyUnlocked];

    const milestones: { elementId: string; achievementId: string }[] = [
      { elementId: 'life', achievementId: 'first-life' },
      { elementId: 'human', achievementId: 'first-human' },
      { elementId: 'shelter', achievementId: 'shelter-builder' },
      { elementId: 'village', achievementId: 'village-founder' },
      { elementId: 'science', achievementId: 'curious-mind' },
      { elementId: 'technology', achievementId: 'industrial-spark' },
      { elementId: 'rocket', achievementId: 'rocket-scientist' },
      { elementId: 'mars', achievementId: 'red-planet-found' },
      { elementId: 'mars-landing', achievementId: 'mars-pioneer' },
    ];

    milestones.forEach(({ elementId, achievementId }) => {
      if (currentDiscoveries.includes(elementId) && !newlyUnlocked.includes(achievementId)) {
        newlyUnlocked.push(achievementId);
        const ach = ACHIEVEMENTS.find(a => a.id === achievementId);
        if (ach) {
          setNewAchievementToast(ach);
          audio.playAchievement();
        }
      }
    });

    // Speedrunner: win in under 10 mins (600s)
    if (currentDiscoveries.includes('mars-landing') && currentSecs < 600 && !newlyUnlocked.includes('speedrunner')) {
      newlyUnlocked.push('speedrunner');
      const ach = ACHIEVEMENTS.find(a => a.id === 'speedrunner');
      if (ach) {
        setNewAchievementToast(ach);
        audio.playAchievement();
      }
    }

    // Completionist: 60+ elements
    if (currentDiscoveries.length >= 60 && !newlyUnlocked.includes('completionist')) {
      newlyUnlocked.push('completionist');
      const ach = ACHIEVEMENTS.find(a => a.id === 'completionist');
      if (ach) {
        setNewAchievementToast(ach);
        audio.playAchievement();
      }
    }

    if (newlyUnlocked.length !== alreadyUnlocked.length) {
      setUnlockedAchievements(newlyUnlocked);
      setHasUnseenAwards(true);
    }
  }, [audio]);

  // Core combine function
  const combineElements = useCallback((el1: string, el2: string): { success: boolean; isNew?: boolean; result?: Element } => {
    const resultId = getRecipeResult(el1, el2);
    if (!resultId) {
      audio.playFailedCombination();
      return { success: false };
    }

    const foundElement = ELEMENTS.find((e) => e.id === resultId);
    if (!foundElement) {
      audio.playFailedCombination();
      return { success: false };
    }

    const isNew = !discoveredElements.includes(resultId);

    if (isNew) {
      const updatedDiscoveries = [...discoveredElements, resultId];
      setDiscoveredElements(updatedDiscoveries);
      setNewDiscoveryToast(foundElement);
      setHasUnseenRecipes(true);
      audio.playNewDiscovery();

      // Check win condition
      if (resultId === 'mars-landing') {
        setHasWon(true);
        audio.playWinning();
      }

      // Check achievements
      checkAchievements(updatedDiscoveries, elapsedTime, unlockedAchievements);
    } else {
      audio.playNewDiscovery(); // Optional: play sound even if already discovered to signify success
    }

    return { success: true, isNew, result: foundElement };
  }, [discoveredElements, unlockedAchievements, elapsedTime, checkAchievements, audio]);

  // Audio adjustments
  const toggleMusic = useCallback(() => {
    setIsMutedMusic((prev) => !prev);
  }, []);

  const toggleSfx = useCallback(() => {
    setIsMutedSfx((prev) => !prev);
  }, []);

  const changeVolume = useCallback((v: number) => {
    setVolume(v);
  }, []);

  // Matches
  const startNewGame = useCallback(() => {
    setDiscoveredElements(STARTING_ELEMENTS);
    setUnlockedAchievements([]);
    setHasWon(false);
    resetTimer(0);
    setIsActive(true);
    setIsMenuOpen(false);
    setNewDiscoveryToast(null);
    setNewAchievementToast(null);
    setHasUnseenRecipes(false);
    setHasUnseenAwards(false);
  }, [resetTimer]);

  const resumeMatch = useCallback(() => {
    setIsActive(true);
  }, []);

  const exitToMenu = useCallback(() => {
    setIsActive(false);
    setIsMenuOpen(false);
  }, []);

  const loadGame = useCallback((snapshot: GameState) => {
    setDiscoveredElements(snapshot.discoveredElements);
    setUnlockedAchievements(snapshot.achievements);
    resetTimer(snapshot.elapsedTime);
    setHasWon(snapshot.hasWon);
    setIsActive(snapshot.isActive);
    setIsMenuOpen(false);
    setNewDiscoveryToast(null);
    setNewAchievementToast(null);
    setHasUnseenRecipes(false);
    setHasUnseenAwards(false);
  }, [resetTimer]);

  const applySharedSnapshot = useCallback((snapshot: SharedGameSnapshot) => {
    setDiscoveredElements((current) => {
      if (hasSameIds(current, snapshot.discoveredElements)) return current;
      if (snapshot.discoveredElements.some((id) => !current.includes(id))) setHasUnseenRecipes(true);
      return snapshot.discoveredElements;
    });
    setUnlockedAchievements((current) => {
      if (hasSameIds(current, snapshot.achievements)) return current;
      if (snapshot.achievements.some((id) => !current.includes(id))) setHasUnseenAwards(true);
      return snapshot.achievements;
    });
    setElapsedTime(snapshot.elapsedTime);
    setHasWon(snapshot.hasWon);
    setIsActive(snapshot.isActive);
  }, [setElapsedTime]);

  return {
    discoveredElements,
    unlockedAchievements,
    elapsedTime,
    isMutedMusic,
    isMutedSfx,
    volume,
    hasWon,
    isActive,
    isMenuOpen,
    hasUnseenRecipes,
    hasUnseenAwards,
    newDiscoveryToast,
    setNewDiscoveryToast,
    newAchievementToast,
    setNewAchievementToast,
    combineElements,
    toggleMusic,
    toggleSfx,
    changeVolume,
    pauseGame,
    resumeGame,
    startNewGame,
    resumeMatch,
    exitToMenu,
    loadGame,
    applySharedSnapshot,
    markRecipesSeen: () => setHasUnseenRecipes(false),
    markAwardsSeen: () => setHasUnseenAwards(false),
    playSharedDiscovery: audio.playNewDiscovery,
  };
}
