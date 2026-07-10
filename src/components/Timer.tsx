import { Clock } from 'lucide-react';

interface TimerProps {
  elapsedTime: number;
}

export default function Timer({ elapsedTime }: TimerProps) {
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => String(num).padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <div id="game-timer" className="flex items-center gap-1.5 px-4 py-1.5 bg-brand-ink text-white rounded-full font-mono font-bold text-sm tracking-widest select-none shadow-sm">
      <Clock size={14} className="text-brand-primary animate-pulse" />
      <span>{formatTime(elapsedTime)}</span>
    </div>
  );
}
