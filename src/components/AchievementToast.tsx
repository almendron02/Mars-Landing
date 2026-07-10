import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, X } from 'lucide-react';
import { Achievement } from '../types/game';

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export default function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          id={`achievement-toast-${achievement.id}`}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-4 bg-brand-card text-brand-ink p-4 pr-10 rounded-2xl shadow-xl border-2 border-brand-secondary max-w-sm select-none"
        >
          {/* Trophy Badge */}
          <div className="flex items-center justify-center w-12 h-12 bg-brand-secondary text-white rounded-full text-2xl shrink-0 shadow-sm">
            {achievement.icon}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-secondary flex items-center gap-1">
              <Award size={10} /> Achievement Unlocked!
            </span>
            <h4 className="font-bold text-sm leading-tight text-brand-ink">{achievement.name}</h4>
            <p className="text-xs text-brand-ink/75 font-medium leading-normal">{achievement.description}</p>
          </div>

          {/* Dismiss button */}
          <button
            id="btn-close-achievement-toast"
            onClick={onClose}
            className="absolute top-2.5 right-2.5 p-1 bg-brand-bg hover:bg-brand-border text-brand-ink rounded-full transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
