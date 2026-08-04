import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Achievement } from '../types/game';
import AwardCard from './AwardCard';
import PixelIcon from './PixelIcon';

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
          className="fixed bottom-6 right-6 z-50 bg-brand-card text-brand-ink p-4 pr-10 rounded-2xl shadow-xl border-2 border-brand-secondary max-w-sm select-none"
        >
          <AwardCard achievement={achievement} isUnlocked variant="toast" />

          {/* Dismiss button */}
          <button
            id="btn-close-achievement-toast"
            onClick={onClose}
            className="absolute top-2.5 right-2.5 p-1 bg-brand-bg hover:bg-brand-border text-brand-ink rounded-full transition-colors cursor-pointer"
          >
            <PixelIcon id="close" size={12} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
