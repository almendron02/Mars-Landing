import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Sparkles, RefreshCw, Star, ArrowRight, HelpCircle, BookOpen, 
  Briefcase, Award, Music, Volume2, ShieldCheck, Play, RotateCcw
} from 'lucide-react';
import { Element, Era, Achievement } from '../types/game';
import { ELEMENTS } from '../data/elements';
import { RECIPES } from '../data/recipes';
import { ACHIEVEMENTS } from '../data/achievements';
import ElementCard from './ElementCard';
import CombinePanel from './CombinePanel';
import MenuModal from './MenuModal';
import WinModal from './WinModal';
import AchievementToast from './AchievementToast';
import PixelIcon from './PixelIcon';

interface GameBoardProps {
  gameState: ReturnType<typeof import('../hooks/useGameState').useGameState>;
}

export default function GameBoard({ gameState }: GameBoardProps) {
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

  // Dynamic progression hint
  const dynamicHint = useMemo(() => {
    const ids = discoveredElements;
    if (!ids.includes('life')) {
      return {
        text: 'Wet earth combined with dynamic power creates the miraculous spark of life.',
        ingredients: 'Mud + Energy',
        target: 'Life'
      };
    }
    if (!ids.includes('human')) {
      return {
        text: 'Life itself mixed with wet earth shapes a clever, dreaming creature.',
        ingredients: 'Life + Mud',
        target: 'Human'
      };
    }
    if (!ids.includes('tool')) {
      return {
        text: 'The dreaming creature shapes cold stone to craft an extension of its hands.',
        ingredients: 'Human + Stone',
        target: 'Tool'
      };
    }
    if (!ids.includes('house')) {
      return {
        text: 'The clever creature constructs shelter, then elevates it to a permanent home.',
        ingredients: 'Human + Shelter',
        target: 'House'
      };
    }
    if (!ids.includes('science')) {
      return {
        text: 'Systematic learning within a shared sanctuary births the pursuit of science.',
        ingredients: 'Knowledge + School',
        target: 'Science'
      };
    }
    if (!ids.includes('rocket')) {
      return {
        text: 'Concentrated fuel ignited with advanced technology launches a vessel upwards.',
        ingredients: 'Fuel + Technology',
        target: 'Rocket'
      };
    }
    if (!ids.includes('mars')) {
      return {
        text: 'Observe a far celestial body, then color it with rusty metal dust.',
        ingredients: 'Planet + Red Dust',
        target: 'Mars'
      };
    }
    if (!ids.includes('mars-landing')) {
      return {
        text: 'Send our greatest space mission straight to the dusty red planet to land!',
        ingredients: 'Mars + Space Mission',
        target: 'Mars Landing'
      };
    }
    return {
      text: 'Congratulations! You have landed on Mars. Continue combining to discover all 85+ items!',
      ingredients: 'Explore & discover',
      target: 'Completionist'
    };
  }, [discoveredElements]);

  // Handle selection of elements
  const handleCardClick = (id: string) => {
    // Clear any previous result so player can mix fresh
    setLastResult(null);

    if (slot1 === id) {
      setSlot1(null);
    } else if (slot2 === id) {
      setSlot2(null);
    } else if (!slot1) {
      setSlot1(id);
    } else if (!slot2) {
      setSlot2(id);
    } else {
      // Replace slot 2 if both full
      setSlot2(id);
    }
    setCombineFeedback(null);
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
              ✦ Mars Landing ✦
            </h1>
            
            {/* Minimal HUD info directly under title */}
            <div className="flex items-center gap-2 mt-0.5 text-xs font-black text-brand-muted uppercase tracking-wider">
              <span className="flex items-center gap-1 text-brand-primary">
                ✦ {formatTime(elapsedTime)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-brand-secondary">
                🧪 {discoveredElements.length}/{ELEMENTS.length}
              </span>
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
              <span className="text-[9px]">🌌</span>
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
                <span className="text-xl mb-1 opacity-50">📁</span>
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
        <div className="w-full max-w-[480px] grid grid-cols-4 gap-2">
          
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
            <span className="text-[9px] font-black uppercase tracking-wider">Hints</span>
          </button>

          {/* Button 2: Recipes */}
          <button
            id="nav-btn-recipes"
            onClick={() => setActiveDrawer('recipes')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border-2 cursor-pointer transition-all active:translate-y-0.5 active:shadow-none
              ${activeDrawer === 'recipes'
                ? 'bg-brand-paper border-brand-ink text-brand-ink shadow-[1px_1.5px_0px_0px_rgba(36,33,30,1)]'
                : 'bg-brand-card hover:bg-brand-paper border-brand-border text-brand-muted'
              }
            `}
          >
            <PixelIcon id="recipes" size={18} className="mb-1" />
            <span className="text-[9px] font-black uppercase tracking-wider">Recipes</span>
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
            <span className="text-[9px] font-black uppercase tracking-wider">Bag</span>
          </button>

          {/* Button 4: Awards */}
          <button
            id="nav-btn-awards"
            onClick={() => setActiveDrawer('awards')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border-2 cursor-pointer transition-all active:translate-y-0.5 active:shadow-none
              ${activeDrawer === 'awards'
                ? 'bg-brand-paper border-brand-ink text-brand-ink shadow-[1px_1.5px_0px_0px_rgba(36,33,30,1)]'
                : 'bg-brand-card hover:bg-brand-paper border-brand-border text-brand-muted'
              }
            `}
          >
            <PixelIcon id="awards" size={18} className="mb-1" />
            <span className="text-[9px] font-black uppercase tracking-wider">Awards</span>
          </button>

        </div>
      </footer>

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
                  {activeDrawer === 'hints' && '✦ RESEARCH LAB / HINTS ✦'}
                  {activeDrawer === 'recipes' && '✦ YOUR DISCOVERED RECIPES ✦'}
                  {activeDrawer === 'bag' && '✦ TOTAL DISCOVERED ELEMENTS ✦'}
                  {activeDrawer === 'awards' && '✦ SPACE ACCOMPLISHMENTS ✦'}
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
                    <div className="bg-brand-secondary/15 border-2 border-brand-secondary/40 rounded-2xl p-4">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-brand-secondary">ACTIVE OBJECTIVE</p>
                      <h4 className="text-sm font-black text-brand-ink mt-0.5 uppercase tracking-wide">Target: {dynamicHint.target}</h4>
                      <p className="text-xs font-semibold text-brand-ink/90 mt-1 leading-relaxed">
                        "{dynamicHint.text}"
                      </p>
                      <div className="mt-3.5 inline-flex items-center gap-1 text-[9px] font-black text-brand-secondary uppercase tracking-widest bg-white/80 px-2.5 py-1 rounded-md border border-brand-secondary/30">
                        ⭐ Combination Recipe: {dynamicHint.ingredients}
                      </div>
                    </div>

                    <div className="bg-brand-paper border border-brand-border rounded-xl p-3.5 text-xs text-brand-ink/80 leading-relaxed font-semibold space-y-2">
                      <p className="font-extrabold uppercase tracking-wider text-brand-ink">💡 General Lab Guidance</p>
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
                            
                            <span className="text-xs font-black text-brand-muted">➔</span>

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
                          <div
                            key={ach.id}
                            className={`flex items-start gap-3 p-3 rounded-xl border transition-all
                              ${isUnlocked
                                ? 'bg-brand-secondary/15 border-brand-secondary text-brand-ink'
                                : 'bg-brand-bg/40 border-brand-border opacity-60 text-brand-ink/80'
                              }
                            `}
                          >
                            <div className="text-2xl p-1 bg-brand-card border border-brand-border rounded-lg shrink-0 w-11 h-11 flex items-center justify-center">
                              {ach.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black uppercase tracking-wider text-brand-ink">{ach.name}</span>
                                {isUnlocked ? (
                                  <span className="text-[8px] font-black uppercase text-brand-secondary bg-white border border-brand-secondary/40 px-1.5 py-0.5 rounded-md">
                                    EARNED
                                  </span>
                                ) : (
                                  <span className="text-[8px] font-black uppercase text-brand-muted bg-brand-card border border-brand-border px-1.5 py-0.5 rounded-md">
                                    LOCKED
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-brand-muted mt-0.5 leading-relaxed font-semibold">
                                {ach.description}
                              </p>
                            </div>
                          </div>
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
              <div className="absolute top-3 right-3 text-brand-primary animate-pulse text-sm">✨</div>
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
        unlockedAchievements={unlockedAchievements}
        isMutedMusic={isMutedMusic}
        isMutedSfx={isMutedSfx}
        volume={volume}
        toggleMusic={toggleMusic}
        toggleSfx={toggleSfx}
        changeVolume={changeVolume}
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
