import { Achievement } from '../types/game';
import PixelIcon from './PixelIcon';

interface AwardCardProps {
  key?: string | number;
  achievement: Achievement;
  isUnlocked: boolean;
  variant?: 'panel' | 'toast';
  id?: string;
  className?: string;
}

export default function AwardCard({
  achievement,
  isUnlocked,
  variant = 'panel',
  id,
  className = '',
}: AwardCardProps) {
  const iconId = isUnlocked ? achievement.iconId : 'achievement-locked';
  const statusLabel = isUnlocked ? 'Earned' : 'Locked';

  if (variant === 'toast') {
    return (
      <div id={id} className={`flex items-center gap-3 ${className}`}>
        <div className="flex items-center justify-center w-12 h-12 bg-brand-paper border-2 border-brand-secondary rounded-xl shrink-0 shadow-[1px_1.5px_0px_0px_rgba(36,33,30,1)]">
          <PixelIcon id={achievement.iconId} size={30} />
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase font-black tracking-widest text-brand-secondary">
            Award Unlocked
          </span>
          <h4 className="font-black text-sm leading-tight text-brand-ink">{achievement.name}</h4>
          <p className="text-xs text-brand-ink/75 font-semibold leading-normal">{achievement.description}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      id={id}
      className={`flex items-start gap-3 p-3 rounded-xl border transition-all
        ${isUnlocked
          ? 'bg-brand-secondary/15 border-brand-secondary text-brand-ink'
          : 'bg-brand-bg/40 border-brand-border opacity-70 text-brand-ink/80'
        }
        ${className}
      `}
    >
      <div className={`p-1 bg-brand-card border rounded-lg shrink-0 w-11 h-11 flex items-center justify-center
        ${isUnlocked ? 'border-brand-secondary/50' : 'border-brand-border'}
      `}>
        <PixelIcon id={iconId} size={28} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-brand-ink truncate">
            {achievement.name}
          </span>
          <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border shrink-0
            ${isUnlocked
              ? 'text-brand-secondary bg-white border-brand-secondary/40'
              : 'text-brand-muted bg-brand-card border-brand-border'
            }
          `}>
            {statusLabel}
          </span>
        </div>
        <p className="text-[11px] text-brand-muted mt-0.5 leading-relaxed font-semibold">
          {achievement.description}
        </p>
      </div>
    </div>
  );
}
