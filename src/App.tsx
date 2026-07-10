import { useState } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, Sparkles } from 'lucide-react';
import { useAudio } from './hooks/useAudio';
import { useGameState } from './hooks/useGameState';
import GameBoard from './components/GameBoard';

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
  } catch (e) {
    console.warn('Could not read saved settings', e);
  }
  return { isMutedMusic: false, isMutedSfx: false, volume: 0.5 };
};

export default function App() {
  const initialSettings = getSavedAudioSettings();
  
  // Initialize procedural audio synthesizer hook
  const audio = useAudio(
    initialSettings.isMutedMusic,
    initialSettings.isMutedSfx,
    initialSettings.volume
  );

  // Core state controller
  const gameState = useGameState(audio);
  const { isActive, hasSavedMatch, resumeMatch, startNewGame } = gameState;

  return (
    <>
      {!isActive ? (
        /* COZY START SCREEN */
        <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4 py-8 select-none">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full bg-brand-card border-2 border-brand-ink p-8 rounded-3xl shadow-[3px_4px_0px_0px_rgba(36,33,30,1)] text-center relative overflow-hidden"
          >
            {/* Ambient decorative particles */}
            <div className="absolute top-4 right-4 text-brand-primary opacity-60 animate-pulse">
              <Sparkles size={18} />
            </div>

            <h1 className="text-3xl font-serif font-black tracking-tight text-brand-ink uppercase mb-2">
              Mars Landing
            </h1>
            
            <p className="text-brand-muted text-xs font-black uppercase tracking-widest mt-1 mb-8">
              Advance civilization & land on Mars
            </p>

            {/* Action buttons */}
            <div className="flex flex-col gap-3.5 w-full">
              {hasSavedMatch ? (
                <>
                  {/* Resume existing game */}
                  <button
                    id="btn-start-resume"
                    onClick={resumeMatch}
                    className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover border-2 border-brand-ink text-white font-extrabold uppercase tracking-widest py-3.5 rounded-2xl shadow-[2px_2.5px_0px_0px_rgba(36,33,30,1)] hover:translate-y-[1px] hover:shadow-[1px_1.5px_0px_0px_rgba(36,33,30,1)] active:scale-[0.98] cursor-pointer transition-all"
                  >
                    <Play size={16} fill="currentColor" />
                    Resume Match
                  </button>

                  {/* Start new match */}
                  <button
                    id="btn-start-new"
                    onClick={() => {
                      if (confirm('Start a new match? Your previous progress will be lost.')) {
                        startNewGame();
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-brand-card hover:bg-brand-paper border-2 border-brand-ink text-brand-ink font-extrabold uppercase tracking-widest py-3 rounded-2xl shadow-[2px_2.5px_0px_0px_rgba(36,33,30,1)] hover:translate-y-[1px] hover:shadow-[1px_1.5px_0px_0px_rgba(36,33,30,1)] active:scale-[0.98] cursor-pointer transition-all"
                  >
                    <RotateCcw size={14} strokeWidth={3} />
                    Start New Match
                  </button>
                </>
              ) : (
                /* No existing save, start match */
                <button
                  id="btn-start-fresh"
                  onClick={startNewGame}
                  className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover border-2 border-brand-ink text-white font-extrabold uppercase tracking-widest py-3.5 rounded-2xl shadow-[2px_2.5px_0px_0px_rgba(36,33,30,1)] hover:translate-y-[1px] hover:shadow-[1px_1.5px_0px_0px_rgba(36,33,30,1)] active:scale-[0.98] cursor-pointer transition-all"
                >
                  <Play size={16} fill="currentColor" />
                  Start Match
                </button>
              )}
            </div>

            {/* Hint about persistence */}
            <p className="text-[10px] text-brand-muted/70 mt-8 leading-normal font-bold uppercase tracking-wider">
              Your discoveries, achievements, and time are auto-saved locally.
            </p>
          </motion.div>
        </div>
      ) : (
        /* GAME BOARD ACTIVE PANEL */
        <GameBoard gameState={gameState} />
      )}
    </>
  );
}
