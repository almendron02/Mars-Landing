import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, Trophy, Settings, X, CheckCircle2, Lock } from 'lucide-react';
import AudioControls from './AudioControls';
import { ACHIEVEMENTS } from '../data/achievements';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  unlockedAchievements: string[];
  isMutedMusic: boolean;
  isMutedSfx: boolean;
  volume: number;
  toggleMusic: () => void;
  toggleSfx: () => void;
  changeVolume: (v: number) => void;
}

export default function MenuModal({
  isOpen,
  onClose,
  onRestart,
  unlockedAchievements,
  isMutedMusic,
  isMutedSfx,
  volume,
  toggleMusic,
  toggleSfx,
  changeVolume
}: MenuModalProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'achievements'>('settings');

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
              <h2 className="text-xl font-serif font-black text-brand-ink uppercase tracking-wide">
                ✦ Mars Landing ✦
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
            <div className="flex px-6 border-b border-brand-ink/10 bg-brand-paper/50">
              <button
                id="tab-settings"
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer
                  ${activeTab === 'settings'
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-brand-ink/60 hover:text-brand-ink'
                  }
                `}
              >
                <Settings size={14} />
                Mission Info
              </button>
              <button
                id="tab-achievements"
                onClick={() => setActiveTab('achievements')}
                className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer
                  ${activeTab === 'achievements'
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-brand-ink/60 hover:text-brand-ink'
                  }
                `}
              >
                <Trophy size={14} />
                Awards ({unlockedAchievements.length})
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-brand-card">
              {activeTab === 'settings' ? (
                <div className="flex flex-col gap-6">
                  {/* Mission & Goal Section */}
                  <div className="bg-brand-paper border-2 border-brand-ink rounded-2xl p-4 flex flex-col gap-2 shadow-[1px_1.5px_0px_0px_rgba(36,33,30,1)]">
                    <span className="text-[10px] uppercase font-black tracking-widest text-brand-primary">
                      The Grand Goal
                    </span>
                    <h3 className="text-sm font-serif font-black text-brand-ink uppercase tracking-wide">
                      Find a Way to Fly to Mars!
                    </h3>
                    <p className="text-xs text-brand-ink/90 leading-relaxed font-medium">
                      In this cozy science craft game, your mission is to discover high-tech concepts from scratch. Starting with basic natural elements, combine them into life forms, then build tools, discover electricity, progress heavy industry, and finally synthesize a space rocket to transport humanity safely to Mars!
                    </p>
                  </div>

                  {/* Primary Game Controls */}
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
                  </div>

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
              ) : (
                /* Achievements List */
                <div className="flex flex-col gap-3">
                  {ACHIEVEMENTS.map((ach) => {
                    const isUnlocked = unlockedAchievements.includes(ach.id);
                    return (
                      <div
                        key={ach.id}
                        id={`achievement-item-${ach.id}`}
                        className={`flex items-start gap-3.5 p-3.5 rounded-2xl border-2 transition-all
                          ${isUnlocked
                            ? 'bg-brand-secondary/10 border-brand-secondary/40 text-brand-ink font-semibold'
                            : 'bg-brand-bg/40 border-brand-border/60 opacity-60 text-brand-ink/80'
                          }
                        `}
                      >
                        {/* Trophy Icon */}
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 shadow-sm border
                          ${isUnlocked 
                            ? 'bg-brand-secondary/20 border-brand-secondary text-brand-secondary' 
                            : 'bg-brand-bg text-brand-ink/30 border-brand-border'
                          }
                        `}>
                           {isUnlocked ? (
                             <Trophy size={18} fill="currentColor" />
                           ) : (
                             <Lock size={16} />
                           )}
                        </div>

                        {/* Title and Condition */}
                        <div className="flex-1 flex flex-col gap-0.5">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-sm text-brand-ink">
                              {ach.name}
                            </h4>
                            {isUnlocked ? (
                              <span className="text-brand-secondary flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider">
                                <CheckCircle2 size={12} /> Earned
                              </span>
                            ) : (
                              <span className="text-brand-ink/40 flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider">
                                <Lock size={10} /> Locked
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-brand-ink/70 leading-normal font-medium">
                            {ach.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Footer */}
            <div className="px-6 py-4 border-t-2 border-brand-ink/10 bg-brand-bg/80 text-center">
              <p className="text-[10px] text-brand-ink/50 font-bold uppercase tracking-widest">
                Mars Landing © 2026 • Relax, explore, and let science flourish.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
