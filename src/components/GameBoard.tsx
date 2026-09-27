import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Users } from 'lucide-react';
import { Element, Era } from '../types/game';
import { ELEMENTS } from '../data/elements';
import { RECIPES } from '../data/recipes';
import { ACHIEVEMENTS } from '../data/achievements';
import ElementCard from './ElementCard';
import CombinePanel from './CombinePanel';
import MenuModal from './MenuModal';
import WinModal from './WinModal';
import AchievementToast from './AchievementToast';
import PixelIcon from './PixelIcon';
import AwardCard from './AwardCard';
import CivilizationMap from './CivilizationMap';
import type { MultiplayerSession } from '../hooks/useMultiplayer';

interface GameBoardProps {
  gameState: ReturnType<typeof import('../hooks/useGameState').useGameState>;
  multiplayer?: MultiplayerSession;
  onLeaveShared?: () => void;
  isWorldOwner?: boolean;
}

interface DiscoveryHint {
  target: string;
  prerequisites: string[];
  quote: string;
}

const DISCOVERY_HINTS: DiscoveryHint[] = [
  { target: 'life', prerequisites: [], quote: 'A living spark begins when the world has both a body that can hold shape and a force that can wake it.' },
  { target: 'human', prerequisites: ['life'], quote: 'The next leap is not larger life. It is life shaped into intent, hands, and choice.' },
  { target: 'tool', prerequisites: ['human'], quote: 'The first real upgrade is an object that lets clever hands change harder things.' },
  { target: 'village', prerequisites: ['house'], quote: 'A community appears when one settled home becomes a pattern.' },
  { target: 'knowledge', prerequisites: ['language'], quote: 'Ideas become powerful only after people can preserve and pass them forward.' },
  { target: 'school', prerequisites: ['knowledge', 'village'], quote: 'Learning becomes a system when stored ideas get a shared place.' },
  { target: 'science', prerequisites: ['school'], quote: 'Real science begins when teaching turns curiosity into repeatable proof.' },
  { target: 'ore', prerequisites: ['stone'], quote: 'Look for value hidden inside ordinary rock, not on its surface.' },
  { target: 'metal', prerequisites: ['ore'], quote: 'A useful material is waiting inside the raw mineral, but it needs a harsher transformation.' },
  { target: 'machine', prerequisites: ['metal', 'tool'], quote: 'Work becomes repeatable when a crafted helper meets a stronger material.' },
  { target: 'factory', prerequisites: ['machine', 'energy'], quote: 'Scale begins when one machine gains steady power and a place to multiply work.' },
  { target: 'technology', prerequisites: ['factory', 'science'], quote: 'Advanced invention needs organized learning and production that can keep up.' },
  { target: 'coal', prerequisites: ['pressure'], quote: 'Old growth can become stored fire after the planet presses it long enough.' },
  { target: 'fuel', prerequisites: ['coal'], quote: 'The launch path needs energy that is not just bright, but concentrated and ready to burn.' },
  { target: 'rocket', prerequisites: ['fuel', 'technology'], quote: 'A vessel that escapes the ground needs advanced systems and serious stored energy.' },
  { target: 'computer', prerequisites: ['electricity', 'technology'], quote: 'Information becomes hardware when electricity learns to follow instructions.' },
  { target: 'mission-control', prerequisites: ['computer', 'science'], quote: 'A skybound mission needs a grounded brain before it trusts the vehicle.' },
  { target: 'launch', prerequisites: ['mission-control', 'rocket'], quote: 'A finished vessel becomes a launch only when guidance and ignition agree.' },
  { target: 'orbit', prerequisites: ['launch', 'space'], quote: 'Escaping upward is only half the job; the path must become stable.' },
  { target: 'astronaut', prerequisites: ['human', 'rocket'], quote: 'The mission becomes human when a traveler can survive inside the machine.' },
  { target: 'space-mission', prerequisites: ['astronaut', 'orbit'], quote: 'A real operation begins when crew, path, and control move as one.' },
  { target: 'lens', prerequisites: ['glass'], quote: 'Clear material becomes a better eye after craft gives it focus.' },
  { target: 'telescope', prerequisites: ['lens'], quote: 'A focused eye becomes powerful when it is built to look far past the horizon.' },
  { target: 'astronomy', prerequisites: ['telescope', 'science'], quote: 'Seeing distant objects is not enough; the sky needs a discipline.' },
  { target: 'planet', prerequisites: ['astronomy'], quote: 'The far object becomes understandable only after the sky is studied with intent.' },
  { target: 'red-dust', prerequisites: ['dust', 'metal'], quote: 'The red signature comes from dry particles touched by stronger material.' },
  { target: 'mars', prerequisites: ['planet', 'red-dust'], quote: 'The destination reveals itself when a world and its rusty signature finally match.' },
  { target: 'mars-landing', prerequisites: ['mars', 'space-mission'], quote: 'The final step is not finding the destination; it is sending a complete mission there.' },
];

export default function GameBoard({ gameState, multiplayer, onLeaveShared, isWorldOwner = false }: GameBoardProps) {
  const {
    discoveredElements,
    unlockedAchievements,
    elapsedTime,
    isMutedMusic,
    isMutedSfx,
    volume,
    hasWon,
    isMenuOpen,
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
    hasUnseenRecipes,
    hasUnseenAwards,
    markRecipesSeen,
    markAwardsSeen,
    playSharedDiscovery,
  } = gameState;

  // Selected slots
  const [slot1, setSlot1] = useState<string | null>(null);
  const [slot2, setSlot2] = useState<string | null>(null);

  // Track the actual combined result for the bottom slot
  const [lastResult, setLastResult] = useState<Element | null>(null);

  // Filters
  const [selectedEra, setSelectedEra] = useState<Era | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Recipe Feedback ('success' | 'failure' | null)
  const [combineFeedback, setCombineFeedback] = useState<'success' | 'failure' | null>(null);

  // Track last combination attempt for the cozy message card
  const [lastAttempt, setLastAttempt] = useState<{
    el1: { name: string; id: string };
    el2: { name: string; id: string };
    success: boolean;
    result?: { name: string; id: string };
  } | null>(null);

  // Bottom drawer control: 'hints' | 'recipes' | 'bag' | 'awards' | null
  const [activeDrawer, setActiveDrawer] = useState<'hints' | 'recipes' | 'bag' | 'awards' | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const hintCarouselRef = useRef<HTMLDivElement | null>(null);

  // Format playing time helper
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Map IDs to actual elements
  const discoveredObjects = useMemo(() => {
    return discoveredElements
      .map((id) => ELEMENTS.find((e) => e.id === id))
      .filter((e): e is Element => !!e);
  }, [discoveredElements]);

  // Filtered elements
  const filteredElements = useMemo(() => {
    return discoveredObjects.filter((el) => {
      const matchesEra = selectedEra === 'All' || el.era === selectedEra;
      const matchesSearch = el.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesEra && matchesSearch;
    });
  }, [discoveredObjects, selectedEra, searchQuery]);

  // Do not limit elements for the main preview grid
  const previewElements = filteredElements;

  const hasMoreThan12 = false;

  const activeHints = useMemo(() => {
    const ids = new Set(discoveredElements);

    return DISCOVERY_HINTS
      .filter((hint) => !ids.has(hint.target))
      .map((hint, index) => ({
        ...hint,
        index,
        missingPrerequisites: hint.prerequisites.filter((prerequisite) => !ids.has(prerequisite)).length,
      }))
      .sort((a, b) => a.missingPrerequisites - b.missingPrerequisites || a.index - b.index)
      .slice(0, 3);
  }, [discoveredElements]);

  const activeHintTargets = activeHints.map((hint) => hint.target).join('|');

  useEffect(() => {
    setHintIndex(0);
    hintCarouselRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  }, [activeHintTargets]);

  useEffect(() => {
    const carousel = hintCarouselRef.current;
    const card = carousel?.children[hintIndex] as HTMLElement | undefined;

    if (!carousel || !card) return;

    carousel.scrollTo({
      left: card.offsetLeft - carousel.offsetLeft,
      behavior: 'smooth',
    });
  }, [hintIndex, activeHintTargets]);

  useEffect(() => {
    if (!multiplayer?.lastDiscovery || multiplayer.lastDiscovery.playerId === multiplayer.playerId) return;
    playSharedDiscovery();
    const timer = window.setTimeout(multiplayer.clearDiscovery, 6500);
    return () => window.clearTimeout(timer);
  }, [multiplayer?.lastDiscovery, multiplayer?.playerId, playSharedDiscovery]);

  const moveHintCarousel = (direction: -1 | 1) => {
    setHintIndex((current) => {
      if (activeHints.length === 0) return 0;

      const nextIndex = Math.min(Math.max(current + direction, 0), activeHints.length - 1);
      return nextIndex;
    });
  };

  // Handle selection of elements
  const handleCardClick = (id: string) => {
    // Clear any previous result so player can mix fresh
    setLastResult(null);
    setCombineFeedback(null);

    const current: string[] = [];
    if (slot1) current.push(slot1);
    if (slot2) current.push(slot2);

    const count = current.filter((x) => x === id).length;

    if (count === 0) {
      if (current.length < 2) {
        current.push(id);
      } else {
        // Both slots are full. Shift Slot 2 into Slot 1 and place the new element in Slot 2.
        current[0] = current[1];
        current[1] = id;
      }
    } else if (count === 1) {
      if (current.length === 1) {
        // Only 1 slot is occupied, and it is this element. Select it twice.
        current.push(id);
      } else {
        // 2 slots are occupied, one is the tapped element, and the other is a different element.
        // Replace the other element so both slots become this element.
        current[0] = id;
        current[1] = id;
      }
    } else if (count === 2) {
      // Already selected twice. Third tap fully clears this element from the workshop.
      current.length = 0;
    }

    setSlot1(current[0] || null);
    setSlot2(current[1] || null);
  };

  const handleClearSlot = (slot: 1 | 2) => {
    if (slot === 1) setSlot1(null);
    if (slot === 2) setSlot2(null);
    setCombineFeedback(null);
    setLastResult(null);
  };

  const handleClearResult = () => {
    setLastResult(null);
    setCombineFeedback(null);
  };

  // Perform combination
  const handleCombineAction = () => {
    if (!slot1 || !slot2) return;
    const el1Obj = ELEMENTS.find((e) => e.id === slot1);
    const el2Obj = ELEMENTS.find((e) => e.id === slot2);
    if (!el1Obj || !el2Obj) return;

    const res = combineElements(slot1, slot2);
    if (res.success && res.result) {
      setCombineFeedback('success');
      const resultObj = res.result;
      setLastResult(resultObj);
      setLastAttempt({
        el1: { name: el1Obj.name, id: el1Obj.id },
        el2: { name: el2Obj.name, id: el2Obj.id },
        success: true,
        result: { name: resultObj.name, id: resultObj.id },
      });
      setSlot1(null);
      setSlot2(null);
    } else {
      setCombineFeedback('failure');
      setLastResult(null);
      setLastAttempt({
        el1: { name: el1Obj.name, id: el1Obj.id },
        el2: { name: el2Obj.name, id: el2Obj.id },
        success: false,
      });
    }
  };

  // Discovered recipes list mapping
  const discoveredRecipes = useMemo(() => {
    return RECIPES.filter((r) => discoveredElements.includes(r.result)).map((r) => {
      const e1 = ELEMENTS.find((e) => e.id === r.element1);
      const e2 = ELEMENTS.find((e) => e.id === r.element2);
      const res = ELEMENTS.find((e) => e.id === r.result);
      return { r, e1, e2, res };
    });
  }, [discoveredElements]);

  const ERAS: Era[] = ['Nature', 'Life', 'Human', 'Civilization', 'Industry', 'Space'];

  // Map Era names to cute pixel icon or clean identifier
  const getEraIcon = (era: Era) => {
    switch (era) {
      case 'Nature': return 'plant';
      case 'Life': return 'life';
      case 'Human': return 'human';
      case 'Civilization': return 'house';
      case 'Industry': return 'machine';
      case 'Space': return 'planet';
      default: return 'science';
    }
  };

  const getDrawerMeta = (drawer: 'hints' | 'recipes' | 'bag' | 'awards') => {
    switch (drawer) {
      case 'hints': return { iconId: 'hints', title: 'Research Lab / Hints' };
      case 'recipes': return { iconId: 'recipes', title: 'Your Discovered Recipes' };
      case 'bag': return { iconId: 'bag', title: 'Total Discovered Elements' };
      case 'awards': return { iconId: 'awards', title: 'Space Accomplishments' };
    }
  };

  const drawerMeta = activeDrawer ? getDrawerMeta(activeDrawer) : null;

  const handleRestart = () => {
    startNewGame();
    setSlot1(null);
    setSlot2(null);
    setLastResult(null);
    setLastAttempt(null);
    setCombineFeedback(null);
    setActiveDrawer(null);
  };

  return (
    <div id="game-board" className="h-screen w-screen overflow-hidden bg-brand-bg text-brand-ink flex flex-col items-center">
      <div className="w-full max-w-[480px] h-full flex flex-col overflow-hidden">
        
        {/* TOP BAR - Always Visible */}
        <header className="shrink-0 z-30 flex items-center justify-between bg-brand-bg px-4 py-2.5 border-b-2 border-brand-ink/10 select-none">
          <div className="flex flex-col">
            <h1 className="text-2xl font-serif font-black tracking-tight text-brand-ink flex items-center gap-1">
              <PixelIcon id="mars" size={22} />
              <span>Mars Landing</span>
            </h1>
            
            {/* Minimal HUD info directly under title */}
            <div className="flex items-center gap-2 mt-0.5 text-xs font-black text-brand-muted uppercase tracking-wider">
              <span className="flex items-center gap-1 text-brand-primary">
                <PixelIcon id="achievement-speedrunner" size={11} />
                {formatTime(elapsedTime)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-brand-secondary">
                <PixelIcon id="science" size={11} />
                {discoveredElements.length}/{ELEMENTS.length}
              </span>
              {multiplayer && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-brand-tertiary" title={`Shared world ${multiplayer.roomCode}`}>
                    <Users size={11} /> {multiplayer.players.length}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Compact Pause/Menu button */}
          <button
            id="btn-open-menu"
            onClick={pauseGame}
            className="flex items-center justify-center w-10 h-10 bg-brand-card hover:bg-brand-paper border-2 border-brand-ink rounded-xl text-brand-ink shadow-[1.5px_2px_0px_0px_rgba(36,33,30,1)] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title="Pause and Settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="4" y1="18" x2="20" y2="18"></line>
            </svg>
          </button>
        </header>

        {/* WORKSHOP MIXING AREA - Fixed / Static at the top */}
        <section id="workshop-section" className="shrink-0 flex flex-col items-center w-full px-4 pb-1 border-b border-brand-ink/5">
          <CombinePanel
            element1={slot1 ? ELEMENTS.find((e) => e.id === slot1) || null : null}
            element2={slot2 ? ELEMENTS.find((e) => e.id === slot2) || null : null}
            resultElement={lastResult}
            onClearElement={handleClearSlot}
            onClearResult={handleClearResult}
            onCombine={handleCombineAction}
            combineFeedback={combineFeedback}
          />
        </section>

        {/* SCROLLABLE INVENTORY PREVIEW & GALLERY */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-24 pt-2 flex flex-col gap-3">
          <section id="inventory-preview" className="flex flex-col gap-3 w-full">
          <div className="flex items-center justify-between border-b border-brand-ink/10 pb-1">
            <h2 className="text-sm font-black uppercase tracking-widest text-brand-ink font-serif">
              Your Elements ({discoveredElements.length})
            </h2>
            
            {/* Quick search button inside drawer or search query string */}
            <input
              id="search-preview"
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs px-2.5 py-1 bg-brand-card border border-brand-border rounded-lg max-w-[120px] focus:outline-none focus:border-brand-ink text-brand-ink font-bold placeholder-brand-muted/50"
            />
          </div>

          {/* Era filter pills - Wrapping compact pills, no scroll */}
          <div className="flex flex-wrap items-center gap-1 select-none w-full justify-start">
            {/* All pill */}
            <button
              id="filter-era-all"
              onClick={() => setSelectedEra('All')}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider border transition-all duration-200 cursor-pointer
                ${selectedEra === 'All'
                  ? 'bg-brand-secondary/20 border-brand-secondary text-brand-ink font-black shadow-[0.5px_1px_0px_0px_rgba(141,174,105,1)]'
                  : 'bg-brand-card hover:bg-brand-paper border-brand-border text-brand-muted'
                }
              `}
            >
              <PixelIcon id="space" size={10} />
              <span>All</span>
            </button>

            {ERAS.map((era) => {
              const iconId = getEraIcon(era);
              return (
                <button
                  key={era}
                  id={`filter-era-${era.toLowerCase()}`}
                  onClick={() => setSelectedEra(era)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider border transition-all duration-200 cursor-pointer
                    ${selectedEra === era
                      ? 'bg-brand-secondary/20 border-brand-secondary text-brand-ink font-black shadow-[0.5px_1px_0px_0px_rgba(141,174,105,1)]'
                      : 'bg-brand-card hover:bg-brand-paper border-brand-border text-brand-muted'
                    }
                  `}
                >
                  <PixelIcon id={iconId} size={10} />
                  <span>{era}</span>
                </button>
              );
            })}
          </div>

          {/* Collection Grid - exactly 3 columns on mobile, up to 12 items */}
          <div className="w-full">
            {previewElements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 bg-brand-card/40 rounded-2xl border-2 border-dashed border-brand-border text-center">
                <PixelIcon id="bag" size={28} className="mb-1 opacity-40" />
                <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">No elements discovered here yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                {previewElements.map((el) => {
                  const isSelected = slot1 === el.id || slot2 === el.id;
                  return (
                    <ElementCard
                      key={el.id}
                      element={el}
                      isSelected={isSelected}
                      onClick={() => handleCardClick(el.id)}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* View all elements -> link at the bottom */}
          {hasMoreThan12 && (
            <button
              id="btn-view-all"
              onClick={() => {
                setActiveDrawer('bag');
              }}
              className="text-center font-black uppercase text-[10px] tracking-widest text-brand-primary hover:underline mt-2 self-center flex items-center gap-1 cursor-pointer bg-transparent border-none"
            >
              View all elements ({filteredElements.length}) <ArrowRight size={10} />
            </button>
          )}
        </section>
      </div>
    </div>

    {/* FIXED BOTTOM NAVIGATION BAR */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-brand-bg/95 backdrop-blur-md border-t-2 border-brand-ink/10 px-4 py-3 select-none flex justify-center">
        <div className="w-full max-w-[480px] grid grid-cols-5 gap-1.5">
          <button
            id="nav-btn-map"
            onClick={() => setIsMapOpen(true)}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl border-2 cursor-pointer transition-all active:translate-y-0.5 active:shadow-none bg-brand-card hover:bg-brand-paper border-brand-border text-brand-muted"
          >
            <PixelIcon id="map" size={18} className="mb-1" />
            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider">Map</span>
          </button>
          
          {/* Button 1: Hints */}
          <button
            id="nav-btn-hints"
            onClick={() => setActiveDrawer('hints')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border-2 cursor-pointer transition-all active:translate-y-0.5 active:shadow-none
              ${activeDrawer === 'hints'
                ? 'bg-brand-paper border-brand-ink text-brand-ink shadow-[1px_1.5px_0px_0px_rgba(36,33,30,1)]'
                : 'bg-brand-card hover:bg-brand-paper border-brand-border text-brand-muted'
              }
            `}
          >
            <PixelIcon id="hints" size={18} className="mb-1" />
            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider">Hints</span>
          </button>

          {/* Button 2: Recipes */}
          <button
            id="nav-btn-recipes"
            onClick={() => {
              setActiveDrawer('recipes');
              markRecipesSeen();
            }}
            className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl border-2 cursor-pointer transition-all active:translate-y-0.5 active:shadow-none
              ${activeDrawer === 'recipes'
                ? 'bg-brand-paper border-brand-ink text-brand-ink shadow-[1px_1.5px_0px_0px_rgba(36,33,30,1)]'
                : 'bg-brand-card hover:bg-brand-paper border-brand-border text-brand-muted'
              }
            `}
          >
            {hasUnseenRecipes && <span aria-label="New recipes" className="absolute top-1.5 right-2 w-2.5 h-2.5 rounded-full bg-brand-primary border border-white shadow-sm" />}
            <PixelIcon id="recipes" size={18} className="mb-1" />
            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider">Recipes</span>
          </button>

          {/* Button 3: Bag */}
          <button
            id="nav-btn-bag"
            onClick={() => setActiveDrawer('bag')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border-2 cursor-pointer transition-all active:translate-y-0.5 active:shadow-none
              ${activeDrawer === 'bag'
                ? 'bg-brand-paper border-brand-ink text-brand-ink shadow-[1px_1.5px_0px_0px_rgba(36,33,30,1)]'
                : 'bg-brand-card hover:bg-brand-paper border-brand-border text-brand-muted'
              }
            `}
          >
            <PixelIcon id="bag" size={18} className="mb-1" />
            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider">Bag</span>
          </button>

          {/* Button 4: Awards */}
          <button
            id="nav-btn-awards"
            onClick={() => {
              setActiveDrawer('awards');
              markAwardsSeen();
            }}
            className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl border-2 cursor-pointer transition-all active:translate-y-0.5 active:shadow-none
              ${activeDrawer === 'awards'
                ? 'bg-brand-paper border-brand-ink text-brand-ink shadow-[1px_1.5px_0px_0px_rgba(36,33,30,1)]'
                : 'bg-brand-card hover:bg-brand-paper border-brand-border text-brand-muted'
              }
            `}
          >
            {hasUnseenAwards && <span aria-label="New awards" className="absolute top-1.5 right-2 w-2.5 h-2.5 rounded-full bg-brand-primary border border-white shadow-sm" />}
            <PixelIcon id="awards" size={18} className="mb-1" />
            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider">Awards</span>
          </button>

        </div>
      </footer>

      <AnimatePresence>
        {isMapOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CivilizationMap
              discoveredElements={discoveredElements}
              onClose={() => setIsMapOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {multiplayer?.lastDiscovery && multiplayer.lastDiscovery.playerId !== multiplayer.playerId && (
          <motion.button
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            onClick={() => {
              setIsMapOpen(true);
              multiplayer.clearDiscovery();
            }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[65] w-[min(360px,calc(100vw-2rem))] bg-brand-card text-brand-ink border-2 border-brand-ink rounded-2xl shadow-[3px_4px_0px_0px_rgba(36,33,30,1)] p-3 flex items-center gap-3 text-left cursor-pointer"
          >
            <span className="w-10 h-10 rounded-xl bg-brand-paper border border-brand-border grid place-items-center"><PixelIcon id={multiplayer.lastDiscovery.elementId} size={27} /></span>
            <span className="flex-1"><strong className="block text-[10px] uppercase tracking-wider text-brand-primary">New shared discovery</strong><span className="text-xs font-bold">{multiplayer.lastDiscovery.playerName} discovered {ELEMENTS.find((element) => element.id === multiplayer.lastDiscovery!.elementId)?.name}</span></span>
            <span className="text-[9px] font-black uppercase tracking-wider">View map</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* POPOUT DRAWERS OVERLAY SYSTEM */}
      <AnimatePresence>
        {activeDrawer && (
          <div id="drawer-overlay" className="fixed inset-0 z-50 flex items-end justify-center p-0 bg-brand-ink/50 backdrop-blur-sm">
            
            {/* Click outside to close */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setActiveDrawer(null)} />

            {/* Content card */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 290 }}
              className="relative flex flex-col w-full max-w-[480px] bg-brand-card border-t-4 border-brand-ink rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden select-none z-10"
            >
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-brand-ink/10 bg-brand-paper">
                <h3 className="text-sm font-black uppercase tracking-widest text-brand-ink font-serif flex items-center gap-2">
                  {drawerMeta && (
                    <>
                      <PixelIcon id={drawerMeta.iconId} size={16} />
                      {drawerMeta.title}
                    </>
                  )}
                </h3>
                <button
                  id="btn-close-drawer"
                  onClick={() => setActiveDrawer(null)}
                  className="w-8 h-8 flex items-center justify-center bg-brand-card hover:bg-brand-bg border border-brand-ink rounded-full text-brand-ink cursor-pointer transition-all"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>

              {/* Drawer Scroll Area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-brand-card">
                
                {/* 1. HINTS DRAWER CONTENT */}
                {activeDrawer === 'hints' && (
                  <div className="space-y-4">
                    {activeHints.length > 0 ? (
                      <div className="flex items-stretch gap-2">
                        <button
                          type="button"
                          onClick={() => moveHintCarousel(-1)}
                          disabled={hintIndex === 0}
                          aria-label="Previous hint"
                          className={`w-9 min-h-[112px] shrink-0 flex items-center justify-center rounded-xl border-2 border-brand-ink bg-brand-paper text-brand-ink shadow-sm transition-all ${
                            hintIndex === 0
                              ? 'opacity-35 cursor-not-allowed'
                              : 'hover:-translate-y-0.5 hover:bg-brand-secondary/15 active:translate-y-0 cursor-pointer'
                          }`}
                        >
                          <PixelIcon id="arrow-right" size={18} className="rotate-180" />
                        </button>

                        <div
                          ref={hintCarouselRef}
                          className="flex-1 flex gap-3 overflow-x-auto no-scrollbar px-1 pb-1 snap-x snap-mandatory scroll-smooth"
                        >
                          {activeHints.map((hint) => (
                            <div
                              key={hint.target}
                              className="min-w-full sm:min-w-[86%] snap-start bg-brand-secondary/15 border-2 border-brand-secondary/40 rounded-2xl p-4 flex items-center"
                            >
                              <p className="text-sm font-serif font-black text-brand-ink leading-relaxed">
                                "{hint.quote}"
                              </p>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => moveHintCarousel(1)}
                          disabled={hintIndex >= activeHints.length - 1}
                          aria-label="Next hint"
                          className={`w-9 min-h-[112px] shrink-0 flex items-center justify-center rounded-xl border-2 border-brand-ink bg-brand-paper text-brand-ink shadow-sm transition-all ${
                            hintIndex >= activeHints.length - 1
                              ? 'opacity-35 cursor-not-allowed'
                              : 'hover:-translate-y-0.5 hover:bg-brand-secondary/15 active:translate-y-0 cursor-pointer'
                          }`}
                        >
                          <PixelIcon id="arrow-right" size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="bg-brand-secondary/15 border-2 border-brand-secondary/40 rounded-2xl p-4">
                        <p className="text-sm font-serif font-black text-brand-ink leading-relaxed">
                          "Priority queue clear. Keep experimenting to map the quiet branches."
                        </p>
                      </div>
                    )}

                    <div className="bg-brand-paper border border-brand-border rounded-xl p-3.5 text-xs text-brand-ink/80 leading-relaxed font-semibold space-y-2">
                      <p className="font-extrabold uppercase tracking-wider text-brand-ink flex items-center gap-1.5">
                        <PixelIcon id="hints" size={14} />
                        General Lab Guidance
                      </p>
                      <p>• Discovered elements can be combined repeatedly to spark higher tiers of materials.</p>
                      <p>• Tap cards in the inventory grid to mount them onto Slot 1 and Slot 2 in the workshop.</p>
                      <p>• Tap an active card in the mixing slots to safely return it to your pouch.</p>
                    </div>
                  </div>
                )}

                {/* 2. RECIPES DRAWER CONTENT */}
                {activeDrawer === 'recipes' && (
                  <div className="space-y-3">
                    {discoveredRecipes.length === 0 ? (
                      <div className="text-center py-12 text-xs text-brand-muted/70 font-bold uppercase tracking-wider">
                        No recipes discovered yet. Start mixing to fill this textbook!
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2">
                        {discoveredRecipes.map(({ r, e1, e2, res }) => (
                          <div
                            key={r.id}
                            className="flex items-center justify-between p-3 bg-brand-paper border border-brand-border rounded-xl shadow-sm"
                          >
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col items-center justify-center p-1.5 border border-brand-border rounded-lg bg-brand-card w-12 text-center">
                                <PixelIcon id={e1?.id || ''} size={16} />
                                <span className="text-[8px] font-black uppercase text-brand-ink truncate max-w-full mt-0.5">{e1?.name}</span>
                              </div>
                              <span className="text-xs font-black text-brand-muted">+</span>
                              <div className="flex flex-col items-center justify-center p-1.5 border border-brand-border rounded-lg bg-brand-card w-12 text-center">
                                <PixelIcon id={e2?.id || ''} size={16} />
                                <span className="text-[8px] font-black uppercase text-brand-ink truncate max-w-full mt-0.5">{e2?.name}</span>
                              </div>
                            </div>
                            
                            <PixelIcon id="arrow-right" size={16} className="opacity-60" />

                            <div className="flex items-center gap-2 bg-brand-secondary/10 px-3 py-1.5 border border-brand-secondary/30 rounded-xl">
                              <PixelIcon id={res?.id || ''} size={18} />
                              <span className="text-xs font-extrabold text-brand-ink uppercase tracking-wider">{res?.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. BAG DRAWER CONTENT */}
                {activeDrawer === 'bag' && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-wider text-brand-muted">Discovered ({discoveredObjects.length} / {ELEMENTS.length})</p>
                    <div className="grid grid-cols-1 gap-2 max-h-[50vh] overflow-y-auto pr-1">
                      {discoveredObjects.map((el) => (
                        <button
                          key={el.id}
                          onClick={() => {
                            handleCardClick(el.id);
                            setActiveDrawer(null);
                          }}
                          className="w-full text-left flex items-start gap-3 p-2.5 bg-brand-paper hover:bg-brand-paper/85 border border-brand-border rounded-xl cursor-pointer active:scale-[0.99] transition-all"
                          title="Tap to select in workshop"
                        >
                          <div className="p-2 border border-brand-border rounded-lg bg-brand-card shrink-0 flex items-center justify-center w-11 h-11">
                            <PixelIcon id={el.id} size={24} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold text-brand-ink uppercase tracking-wider">{el.name}</span>
                              <span className="text-[8px] font-black uppercase text-brand-muted bg-brand-card border border-brand-border px-1.5 py-0.5 rounded-full">
                                {el.era}
                              </span>
                            </div>
                            <p className="text-[11px] text-brand-muted mt-0.5 leading-normal">
                              {el.description}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. AWARDS DRAWER CONTENT */}
                {activeDrawer === 'awards' && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-brand-muted">Unlocked ({unlockedAchievements.length} / {ACHIEVEMENTS.length})</p>
                    <div className="grid grid-cols-1 gap-2">
                      {ACHIEVEMENTS.map((ach) => {
                        const isUnlocked = unlockedAchievements.includes(ach.id);
                        return (
                          <AwardCard
                            key={ach.id}
                            achievement={ach}
                            isUnlocked={isUnlocked}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

              {/* Drawer Bottom Footer info */}
              <div className="px-5 py-3 border-t border-brand-ink/10 bg-brand-paper text-center">
                <span className="text-[9px] text-brand-muted uppercase tracking-widest font-bold">
                  Alchemy to Mars Lab Pouch
                </span>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NEW DISCOVERY OVERLAY POPUP */}
      <AnimatePresence>
        {newDiscoveryToast && (
          <div id="new-discovery-toast-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative flex flex-col items-center max-w-xs w-full bg-brand-card border-2 border-brand-ink p-6 rounded-3xl shadow-xl text-center select-none"
            >
              <div className="absolute top-3 right-3 text-brand-primary animate-pulse">
                <PixelIcon id="energy" size={14} />
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest text-brand-primary">New Discovery!</span>
              
              <div className="my-5 p-3.5 bg-brand-paper border border-brand-border rounded-2xl">
                <PixelIcon id={newDiscoveryToast.id} size={64} className="animate-bounce" />
              </div>

              <h4 className="text-xl font-black text-brand-ink uppercase tracking-wider">{newDiscoveryToast.name}</h4>
              <p className="text-xs text-brand-muted font-bold mt-1.5 leading-relaxed">
                "{newDiscoveryToast.description}"
              </p>
              
              <span className="inline-block mt-3 text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider bg-brand-secondary/20 text-brand-ink border border-brand-secondary/40">
                Era: {newDiscoveryToast.era}
              </span>

              <button
                id="btn-close-new-discovery"
                onClick={() => setNewDiscoveryToast(null)}
                className="mt-6 w-full bg-brand-ink hover:bg-brand-ink/90 active:translate-y-0.5 text-white font-bold py-2.5 px-4 rounded-xl shadow-[1.5px_2px_0px_0px_rgba(36,33,30,1)] active:shadow-none transition-all cursor-pointer text-xs uppercase tracking-wider"
              >
                Wonderful!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ACHIEVEMENT TOAST NOTIFIER */}
      <AnimatePresence>
        {newAchievementToast && (
          <AchievementToast
            achievement={newAchievementToast}
            onClose={() => setNewAchievementToast(null)}
          />
        )}
      </AnimatePresence>

      {/* PAUSE MENU MODAL */}
      <MenuModal
        isOpen={isMenuOpen}
        onClose={resumeGame}
        onRestart={handleRestart}
        isMutedMusic={isMutedMusic}
        isMutedSfx={isMutedSfx}
        volume={volume}
        toggleMusic={toggleMusic}
        toggleSfx={toggleSfx}
        changeVolume={changeVolume}
        canRestart={!multiplayer}
        onLeave={multiplayer ? onLeaveShared : undefined}
        roomCode={isWorldOwner ? multiplayer?.roomCode : undefined}
        playerCount={isWorldOwner ? multiplayer?.players.length : undefined}
      />

      {/* WIN MODAL */}
      <WinModal
        isOpen={hasWon}
        onRestart={handleRestart}
        finalTime={elapsedTime}
        totalElements={discoveredElements.length}
        totalAchievements={unlockedAchievements.length}
      />

    </div>
  );
}
