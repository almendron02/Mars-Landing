import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Clipboard, Play, RotateCcw, Settings, X } from 'lucide-react';
import AudioControls from './AudioControls';
import PixelIcon from './PixelIcon';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  isMutedMusic: boolean;
  isMutedSfx: boolean;
  volume: number;
  toggleMusic: () => void;
  toggleSfx: () => void;
  changeVolume: (v: number) => void;
  canRestart?: boolean;
  onLeave?: () => void;
  initialTab?: 'settings' | 'tutorial' | 'developer';
  context?: 'game' | 'start';
  roomCode?: string;
  playerCount?: number;
}

export default function MenuModal({
  isOpen,
  onClose,
  onRestart,
  isMutedMusic,
  isMutedSfx,
  volume,
  toggleMusic,
  toggleSfx,
  changeVolume,
  canRestart = true,
  onLeave,
  initialTab = 'settings',
  context = 'game',
  roomCode,
  playerCount,
}: MenuModalProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'tutorial' | 'developer'>(initialTab);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) setActiveTab(initialTab);
  }, [initialTab, isOpen]);
  const tutorialSteps = [
    {
      number: '01',
      icon: 'bag',
      title: 'Tap two element cards',
      cue: 'Selected elements move into the two workshop slots.',
    },
    {
      number: '02',
      icon: 'add',
      title: 'Fill both slots',
      cue: 'The mix button is ready only when both slots have an element.',
    },
    {
      number: '03',
      icon: 'energy',
      title: 'Press Mix',
      cue: 'A valid pair reacts and creates a new discovery.',
    },
    {
      number: '04',
      icon: 'recipes',
      title: 'Repeat the chain',
      cue: 'New discoveries stay in your bag and become ingredients.',
    },
  ];
  const developerLinks = [
    {
      number: '01',
      icon: 'computer',
      title: 'LinkedIn signal',
      cue: 'Professional coordinates, work history, and the cleanest route to start a conversation.',
      href: 'https://linkedin.com/in/angelgonzalez02',
      action: 'Open LinkedIn',
    },
    {
      number: '02',
      icon: 'machine',
      title: 'GitHub machine room',
      cue: 'Source code, commits, experiments, and proof that the gears actually turn.',
      href: 'https://github.com/almendron02',
      action: 'Open GitHub',
    },
    {
      number: '03',
      icon: 'energy',
      title: 'Portfolio launchpad',
      cue: 'Shipped work, polished builds, and the fastest way to inspect the mission archive.',
      href: 'https://formawebsite.com',
      action: 'Open Portfolio',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="menu-modal-overlay" className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-zinc-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="flex flex-col max-w-lg w-full bg-brand-card border-t-2 sm:border-2 border-brand-ink rounded-t-3xl sm:rounded-3xl shadow-[4px_5px_0px_0px_rgba(36,33,30,1)] h-[93vh] sm:h-[90vh] max-h-full sm:max-h-[640px] overflow-hidden select-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-brand-ink/10 bg-brand-paper">
              <h2 className="text-xl font-serif font-black text-brand-ink uppercase tracking-wide flex items-center gap-2">
                <PixelIcon id="mars" size={22} />
                Mars Landing
              </h2>
              <button
                id="btn-close-menu"
                onClick={onClose}
                className="p-1.5 border border-brand-ink/20 hover:border-brand-ink rounded-lg text-brand-ink cursor-pointer transition-all active:scale-95 bg-brand-bg hover:bg-brand-paper"
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex px-4 border-b border-brand-ink/10 bg-brand-paper/50">
              <button
                id="tab-settings"
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 py-3 px-2.5 text-xs sm:text-sm font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer
                  ${activeTab === 'settings'
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-brand-ink/60 hover:text-brand-ink'
                  }
                `}
              >
                <Settings size={14} />
                {context === 'start' ? 'Sound' : 'Pause'}
              </button>
              <button
                id="tab-tutorial"
                onClick={() => setActiveTab('tutorial')}
                className={`flex items-center gap-2 py-3 px-2.5 text-xs sm:text-sm font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer
                  ${activeTab === 'tutorial'
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-brand-ink/60 hover:text-brand-ink'
                  }
                `}
              >
                <PixelIcon id="hints" size={14} />
                Tutorial
              </button>
              <button
                id="tab-developer"
                onClick={() => setActiveTab('developer')}
                className={`flex items-center gap-2 py-3 px-2.5 text-xs sm:text-sm font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer
                  ${activeTab === 'developer'
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-brand-ink/60 hover:text-brand-ink'
                  }
                `}
              >
                <PixelIcon id="astronaut" size={14} />
                Developer
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-brand-card">
              {activeTab === 'settings' ? (
                <div className="flex flex-col gap-6">
                  {context === 'game' && roomCode && (
                    <div className="rounded-2xl border-2 border-brand-ink bg-brand-paper p-4 text-center shadow-[2px_2px_0px_0px_rgba(36,33,30,1)]">
                      <span className="text-[9px] font-black uppercase tracking-[0.18em] text-brand-muted">Live world code</span>
                      <button
                        type="button"
                        onClick={async () => {
                          await navigator.clipboard.writeText(roomCode);
                          setCopied(true);
                          window.setTimeout(() => setCopied(false), 1600);
                        }}
                        className="mt-2 mx-auto flex items-center gap-2 text-2xl font-mono font-black text-brand-ink hover:text-brand-primary cursor-pointer"
                        title="Copy live world code"
                      >
                        {roomCode} {copied ? <Check size={17} /> : <Clipboard size={17} />}
                      </button>
                      <p className="mt-2 text-[10px] font-bold text-brand-muted">{playerCount ?? 1} explorer{playerCount === 1 ? '' : 's'} connected · Share while you are playing</p>
                    </div>
                  )}
                  {context === 'game' && (
                  <div className="flex flex-col gap-3.5">
                    <button
                      id="btn-resume-game"
                      onClick={onClose}
                      className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover border-2 border-brand-ink text-white font-extrabold uppercase tracking-widest py-3.5 rounded-xl shadow-[2px_2.5px_0px_0px_rgba(36,33,30,1)] hover:translate-y-[1px] hover:shadow-[1px_1.5px_0px_0px_rgba(36,33,30,1)] active:scale-[0.98] cursor-pointer transition-all"
                    >
                      <Play size={16} fill="currentColor" />
                      Resume Playing
                    </button>

                    <button
                      id="btn-open-tutorial"
                      onClick={() => setActiveTab('tutorial')}
                      className="w-full flex items-center justify-center gap-2 bg-brand-paper hover:bg-brand-bg border-2 border-brand-ink text-brand-ink font-extrabold uppercase tracking-widest py-3 rounded-xl shadow-[2px_2.5px_0px_0px_rgba(36,33,30,1)] hover:translate-y-[1px] hover:shadow-[1px_1.5px_0px_0px_rgba(36,33,30,1)] active:scale-[0.98] cursor-pointer transition-all"
                    >
                      <PixelIcon id="hints" size={16} />
                      Tutorial
                    </button>

                    {canRestart && (
                      <button
                        id="btn-restart-match"
                        onClick={() => {
                          if (confirm('Are you sure you want to start a brand new match? Your current progress will be completely deleted.')) {
                            onRestart();
                            onClose();
                          }
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-brand-card hover:bg-brand-paper border-2 border-brand-ink text-brand-ink font-extrabold uppercase tracking-widest py-3 rounded-xl shadow-[2px_2.5px_0px_0px_rgba(36,33,30,1)] hover:translate-y-[1px] hover:shadow-[1px_1.5px_0px_0px_rgba(36,33,30,1)] active:scale-[0.98] cursor-pointer transition-all"
                      >
                        <RotateCcw size={14} strokeWidth={3} />
                        Start New Match
                      </button>
                    )}
                    {onLeave && (
                      <button
                        onClick={onLeave}
                        className="w-full flex items-center justify-center gap-2 bg-brand-card hover:bg-brand-paper border-2 border-brand-ink text-brand-ink font-extrabold uppercase tracking-widest py-3 rounded-xl cursor-pointer transition-all"
                      >
                        Leave Shared Expedition
                      </button>
                    )}
                  </div>
                  )}

                  {/* Audio Controls */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-brand-ink/60">
                      Sounds & Music
                    </span>
                    <AudioControls
                      isMutedMusic={isMutedMusic}
                      isMutedSfx={isMutedSfx}
                      volume={volume}
                      toggleMusic={toggleMusic}
                      toggleSfx={toggleSfx}
                      changeVolume={changeVolume}
                    />
                  </div>
                </div>
              ) : activeTab === 'tutorial' ? (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-3 border-b-2 border-brand-ink/10 pb-4">
                    <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-brand-paper border-2 border-brand-ink rounded-xl shadow-[1px_1.5px_0px_0px_rgba(36,33,30,1)]">
                      <PixelIcon id="rocket" size={30} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-black tracking-widest text-brand-primary">
                        How To Play
                      </span>
                      <h3 className="text-sm font-serif font-black text-brand-ink uppercase tracking-wide mt-0.5">
                        Follow the arrows. Build the chain.
                      </h3>
                    </div>
                  </div>

                  <div className="relative">
                    {tutorialSteps.map((step, index) => (
                      <div key={step.number} className="relative flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 flex items-center justify-center bg-brand-ink text-white border-2 border-brand-ink rounded-lg text-[10px] font-black shadow-[1px_1.5px_0px_0px_rgba(36,33,30,1)]">
                            {step.number}
                          </div>
                          {index < tutorialSteps.length - 1 && (
                            <div className="flex-1 min-h-12 w-0.5 bg-brand-border my-1" />
                          )}
                        </div>

                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-brand-paper border-2 border-brand-border rounded-xl">
                              <PixelIcon id={step.icon} size={28} />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-black uppercase tracking-wider text-brand-ink">
                                {step.title}
                              </h4>
                              <p className="text-[11px] text-brand-muted leading-relaxed font-semibold mt-0.5">
                                {step.cue}
                              </p>
                            </div>
                          </div>

                          {index < tutorialSteps.length - 1 && (
                            <div className="ml-14 mt-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-brand-primary">
                              <PixelIcon id="arrow-right" size={15} className="rotate-90" />
                              Next
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 border-t-2 border-brand-ink/10 pt-4">
                    <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-brand-secondary/20 border-2 border-brand-secondary rounded-xl">
                      <PixelIcon id="mars" size={30} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black uppercase tracking-wider text-brand-ink">
                        Final destination: Mars Landing
                      </h4>
                      <p className="text-[11px] text-brand-muted leading-relaxed font-semibold mt-0.5">
                        Keep chaining discoveries until you can build a rocket and send a space mission to Mars.
                      </p>
                    </div>
                  </div>

                  <button
                    id="btn-back-to-pause"
                    onClick={() => setActiveTab('settings')}
                    className="w-full flex items-center justify-center gap-2 bg-brand-card hover:bg-brand-paper border-2 border-brand-ink text-brand-ink font-extrabold uppercase tracking-widest py-3 rounded-xl shadow-[2px_2.5px_0px_0px_rgba(36,33,30,1)] hover:translate-y-[1px] hover:shadow-[1px_1.5px_0px_0px_rgba(36,33,30,1)] active:scale-[0.98] cursor-pointer transition-all"
                  >
                    Back to Pause
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-3 border-b-2 border-brand-ink/10 pb-4">
                    <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-brand-paper border-2 border-brand-ink rounded-xl shadow-[1px_1.5px_0px_0px_rgba(36,33,30,1)]">
                      <PixelIcon id="astronaut" size={30} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-black tracking-widest text-brand-primary">
                        Mission Architect
                      </span>
                      <h3 className="text-sm font-serif font-black text-brand-ink uppercase tracking-wide mt-0.5">
                        Angel Gonzalez
                      </h3>
                      <p className="text-[11px] text-brand-muted leading-relaxed font-semibold mt-1">
                        Combines design, code, and stubborn debugging until rough elements become shipped products.
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    {developerLinks.map((link, index) => (
                      <div key={link.number} className="relative flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 flex items-center justify-center bg-brand-ink text-white border-2 border-brand-ink rounded-lg text-[10px] font-black shadow-[1px_1.5px_0px_0px_rgba(36,33,30,1)]">
                            {link.number}
                          </div>
                          {index < developerLinks.length - 1 && (
                            <div className="flex-1 min-h-12 w-0.5 bg-brand-border my-1" />
                          )}
                        </div>

                        <div className="flex-1 pb-4">
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center gap-3 rounded-xl border-2 border-brand-border bg-brand-paper p-3 transition-all hover:border-brand-ink hover:bg-brand-bg active:scale-[0.99]"
                          >
                            <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-brand-card border border-brand-border rounded-xl">
                              <PixelIcon id={link.icon} size={28} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-black uppercase tracking-wider text-brand-ink">
                                {link.title}
                              </h4>
                              <p className="text-[11px] text-brand-muted leading-relaxed font-semibold mt-0.5">
                                {link.cue}
                              </p>
                              <span className="mt-2 inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-brand-primary">
                                {link.action}
                                <PixelIcon id="arrow-right" size={12} className="transition-transform group-hover:translate-x-0.5" />
                              </span>
                            </div>
                          </a>

                          {index < developerLinks.length - 1 && (
                            <div className="ml-14 mt-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-brand-primary">
                              <PixelIcon id="arrow-right" size={15} className="rotate-90" />
                              Next contact route
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Footer */}
            <div className="px-6 py-4 border-t-2 border-brand-ink/10 bg-brand-bg/80 text-center">
              <p className="text-[10px] text-brand-ink/50 font-bold uppercase tracking-widest">
                Mars Landing 2026 | Mission systems online.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
