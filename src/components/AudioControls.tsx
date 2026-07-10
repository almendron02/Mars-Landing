import { Volume2, VolumeX, Music, Music2 } from 'lucide-react';

interface AudioControlsProps {
  isMutedMusic: boolean;
  isMutedSfx: boolean;
  volume: number;
  toggleMusic: () => void;
  toggleSfx: () => void;
  changeVolume: (v: number) => void;
}

export default function AudioControls({
  isMutedMusic,
  isMutedSfx,
  volume,
  toggleMusic,
  toggleSfx,
  changeVolume
}: AudioControlsProps) {
  return (
    <div id="audio-controls-panel" className="flex flex-col gap-4 p-4 rounded-2xl bg-brand-bg/50 border-2 border-brand-border">
      {/* Volume Slider */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-brand-ink/75">
          <span className="flex items-center gap-1.5">
            <Volume2 size={14} /> Master Volume
          </span>
          <span className="font-mono">{Math.round(volume * 100)}%</span>
        </div>
        <input
          id="volume-slider"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => changeVolume(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-2 gap-3">
        {/* Music Toggle */}
        <button
          id="btn-toggle-music"
          onClick={toggleMusic}
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 font-bold text-sm transition-all duration-200 cursor-pointer
            ${!isMutedMusic
              ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/30'
              : 'bg-brand-card text-brand-ink/40 border-brand-border'
            }
          `}
        >
          {isMutedMusic ? <Music size={15} className="opacity-60" /> : <Music2 size={15} />}
          <span>Music: {isMutedMusic ? 'Off' : 'On'}</span>
        </button>

        {/* SFX Toggle */}
        <button
          id="btn-toggle-sfx"
          onClick={toggleSfx}
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 font-bold text-sm transition-all duration-200 cursor-pointer
            ${!isMutedSfx
              ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/30'
              : 'bg-brand-card text-brand-ink/40 border-brand-border'
            }
          `}
        >
          {isMutedSfx ? <VolumeX size={15} className="opacity-60" /> : <Volume2 size={15} />}
          <span>SFX: {isMutedSfx ? 'Off' : 'On'}</span>
        </button>
      </div>
    </div>
  );
}
