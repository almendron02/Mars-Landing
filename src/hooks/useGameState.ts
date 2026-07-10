import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Element, Achievement } from '../types/game';
import { ELEMENTS, STARTING_ELEMENTS } from '../data/elements';
import { getRecipeResult } from '../data/recipes';
import { ACHIEVEMENTS } from '../data/achievements';
import { useLocalStorage } from './useLocalStorage';
import { useTimer } from './useTimer';

const LOCAL_STORAGE_KEY = 'cozy_alchemy_save_v1';

const DEFAULT_STATE: GameState = {
  discoveredElements: STARTING_ELEMENTS,
  achievements: [],
  elapsedTime: 0,
  isMutedMusic: false,
  isMutedSfx: false,
  volume: 0.5,
  hasWon: false,
  isActive: false, // Wait until game starts
};

export function useGameState(audio: ReturnType<typeof import('./useAudio').useAudio>) {
  const [savedState, setSavedState] = useLocalStorage<GameState>(LOCAL_STORAGE_KEY, DEFAULT_STATE);
  
  // Game states in active memory
  const [discoveredElements, setDiscoveredElements] = useState<string[]>(savedState.discoveredElements);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(savedState.achievements);
  const [hasWon, setHasWon] = useState<boolean>(savedState.hasWon);
  const [isMutedMusic, setIsMutedMusic] = useState<boolean>(savedState.isMutedMusic);
  const [isMutedSfx, setIsMutedSfx] = useState<boolean>(savedState.isMutedSfx);
  const [volume, setVolume] = useState<number>(savedState.volume);
  const [isActive, setIsActive] = useState<boolean>(savedState.isActive);

  // Notifications
  const [newDiscoveryToast, setNewDiscoveryToast] = useState<Element | null>(null);
  const [newAchievementToast, setNewAchievementToast] = useState<Achievement | null>(null);

  // Menu modal overlay state
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Timer
  const { elapsedTime, setElapsedTime, resetTimer } = useTimer(isActive && !hasWon && !isMenuOpen, savedState.elapsedTime);

  // Sync back to local storage whenever state updates
  useEffect(() => {
    setSavedState({
      discoveredElements,
      achievements: unlockedAchievements,
      elapsedTime,
      isMutedMusic,
      isMutedSfx,
      volume,
      hasWon,
      isActive,
    });
  }, [discoveredElements, unlockedAchievements, elapsedTime, isMutedMusic, isMutedSfx, volume, hasWon, isActive, setSavedState]);

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
    try {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.warn('Could not clear localStorage cache', e);
    }
    setDiscoveredElements(STARTING_ELEMENTS);
    setUnlockedAchievements([]);
    setHasWon(false);
    resetTimer(0);
    setIsActive(true);
    setIsMenuOpen(false);
    setNewDiscoveryToast(null);
    setNewAchievementToast(null);
    setSavedState({
      discoveredElements: STARTING_ELEMENTS,
      achievements: [],
      elapsedTime: 0,
      isMutedMusic,
      isMutedSfx,
      volume,
      hasWon: false,
      isActive: true,
    });
  }, [resetTimer, setSavedState, isMutedMusic, isMutedSfx, volume]);

  const resumeMatch = useCallback(() => {
    setIsActive(true);
  }, []);

  // Check if saved match exists and has progress (i.e. more elements or time)
  const hasSavedMatch = savedState.discoveredElements.length > STARTING_ELEMENTS.length || savedState.elapsedTime > 0;

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
    hasSavedMatch,
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
  };
}
