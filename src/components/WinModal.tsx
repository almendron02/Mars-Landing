import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Clock, Sparkles, RotateCcw } from 'lucide-react';

interface WinModalProps {
  isOpen: boolean;
  finalTime: number;
  totalElements: number;
  totalAchievements: number;
  onRestart: () => void;
}

export default function WinModal({
  isOpen,
  finalTime,
  totalElements,
  totalAchievements,
  onRestart
}: WinModalProps) {
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="win-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative flex flex-col items-center max-w-md w-full bg-brand-card p-8 rounded-3xl border-2 border-brand-primary shadow-2xl text-center select-none overflow-hidden"
          >
            {/* Little sparkles */}
            <div className="absolute top-4 left-4 text-brand-primary opacity-60 animate-pulse">
              <Sparkles size={16} />
            </div>
            <div className="absolute bottom-4 right-4 text-brand-secondary opacity-60 animate-pulse">
              <Sparkles size={16} />
            </div>

            {/* Huge planetary celebrate icon */}
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: [0.8, 1.1, 1] }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-7xl mb-4"
            >
              🚀🔴
            </motion.div>

            <h1 className="text-3xl font-black tracking-tight text-brand-ink mb-2">
              You reached Mars!
            </h1>
            <p className="text-brand-ink/75 font-medium text-sm mb-6 leading-relaxed px-2">
              Against all odds, you advanced civilization from basic elements, sparked life, unlocked the secrets of science, and landed humanity safely on the Red Planet. Amazing work, Pioneer!
            </p>

            {/* Stats list */}
            <div className="grid grid-cols-3 gap-3 w-full mb-8">
              {/* Stat: Time */}
              <div className="flex flex-col items-center justify-center p-3 bg-brand-bg/50 border-2 border-brand-border rounded-2xl">
                <Clock className="text-brand-primary mb-1" size={18} />
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-ink/50">Time</span>
                <span className="text-base font-bold font-mono text-brand-ink">
                  {formatTime(finalTime)}
                </span>
              </div>

              {/* Stat: Elements */}
              <div className="flex flex-col items-center justify-center p-3 bg-brand-bg/50 border-2 border-brand-border rounded-2xl">
                <Sparkles className="text-brand-secondary mb-1" size={18} />
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-ink/50">Elements</span>
                <span className="text-base font-bold text-brand-ink">
                  {totalElements}
                </span>
              </div>

              {/* Stat: Achievements */}
              <div className="flex flex-col items-center justify-center p-3 bg-brand-bg/50 border-2 border-brand-border rounded-2xl">
                <Trophy className="text-amber-500 mb-1" size={18} />
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-ink/50">Trophies</span>
                <span className="text-base font-bold text-brand-ink">
                  {totalAchievements}
                </span>
              </div>
            </div>

            {/* Restart Button */}
            <motion.button
              id="btn-win-restart"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onRestart}
              className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:brightness-105 active:translate-y-[2px] border-b-4 border-brand-primary-hover text-white font-bold py-3.5 px-6 rounded-2xl shadow-md cursor-pointer transition-all"
            >
              <RotateCcw size={16} />
              Start New Match
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
