import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Element } from '../types/game';
import PixelIcon from './PixelIcon';

interface CombinePanelProps {
  element1: Element | null;
  element2: Element | null;
  resultElement: Element | null;
  onClearElement: (slot: 1 | 2) => void;
  onClearResult: () => void;
  onCombine: () => void;
  combineFeedback: 'success' | 'failure' | null;
}

export default function CombinePanel({
  element1,
  element2,
  resultElement,
  onClearElement,
  onClearResult,
  onCombine,
  combineFeedback,
}: CombinePanelProps) {
  const canCombine = element1 !== null && element2 !== null;

  return (
    <div id="combine-panel" className="relative flex flex-col items-center w-full select-none mt-1">
      
      {/* Triangular Workspace Container - Super Compact half-scale design */}
      <div className="relative w-full max-w-[280px] h-[190px] mx-auto">
        
        {/* SVG Background Dotted Lines with Arrows */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none">
          <defs>
            <marker
              id="arrowhead-left"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="4"
              markerHeight="4"
              orient="auto-start-reverse"
            >
              <path d="M 0 2 L 6 5 L 0 8 z" fill="#D9C3AA" />
            </marker>
            <marker
              id="arrowhead-right"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="4"
              markerHeight="4"
              orient="auto-start-reverse"
            >
              <path d="M 0 2 L 6 5 L 0 8 z" fill="#D9C3AA" />
            </marker>
            <marker
              id="arrowhead-down"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="4"
              markerHeight="4"
              orient="auto-start-reverse"
            >
              <path d="M 0 2 L 6 5 L 0 8 z" fill="#D9C3AA" />
            </marker>
          </defs>

          {/* Dotted Line from Element 1 (Top Left) to MIX Button (Center) */}
          <path
            d="M 74 50 L 112 59"
            stroke="#D9C3AA"
            strokeWidth="2"
            strokeDasharray="3,3"
            markerEnd="url(#arrowhead-left)"
          />

          {/* Dotted Line from Element 2 (Top Right) to MIX Button (Center) */}
          <path
            d="M 206 50 L 168 59"
            stroke="#D9C3AA"
            strokeWidth="2"
            strokeDasharray="3,3"
            markerEnd="url(#arrowhead-right)"
          />

          {/* Dotted Line from MIX Button (Center) to Result Slot (Bottom Center) */}
          <path
            d="M 140 104 L 140 114"
            stroke="#D9C3AA"
            strokeWidth="2"
            strokeDasharray="3,3"
            markerEnd="url(#arrowhead-down)"
          />
        </svg>

        {/* SLOT 1: Upper Left */}
        <div className="absolute top-2 left-2 w-[72px] h-[72px]">
          <AnimatePresence mode="wait">
            {element1 ? (
              <motion.div
                key={element1.id}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onClearElement(1)}
                className="relative flex flex-col items-center justify-center w-full h-full bg-brand-card border-2 border-brand-ink rounded-xl p-1 text-center cursor-pointer select-none shadow-[1px_1.5px_0px_0px_rgba(36,33,30,1)]"
                title="Tap to remove"
              >
                <button
                  id="btn-clear-slot1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearElement(1);
                  }}
                  className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-brand-card border border-brand-ink text-brand-ink rounded-full shadow hover:bg-brand-paper transition-colors z-15"
                >
                  <X size={8} strokeWidth={3} />
                </button>
                <div className="flex-1 flex items-center justify-center">
                  <PixelIcon id={element1.id} size={24} />
                </div>
                <span className="text-[8px] font-black text-brand-ink truncate max-w-full uppercase tracking-wider px-0.5">
                  {element1.name}
                </span>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-brand-border rounded-xl bg-brand-card/30 text-brand-muted/40 p-1 text-center select-none">
                <span className="text-base">➕</span>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* SLOT 2: Upper Right */}
        <div className="absolute top-2 right-2 w-[72px] h-[72px]">
          <AnimatePresence mode="wait">
            {element2 ? (
              <motion.div
                key={element2.id}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onClearElement(2)}
                className="relative flex flex-col items-center justify-center w-full h-full bg-brand-card border-2 border-brand-ink rounded-xl p-1 text-center cursor-pointer select-none shadow-[1px_1.5px_0px_0px_rgba(36,33,30,1)]"
                title="Tap to remove"
              >
                <button
                  id="btn-clear-slot2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearElement(2);
                  }}
                  className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-brand-card border border-brand-ink text-brand-ink rounded-full shadow hover:bg-brand-paper transition-colors z-15"
                >
                  <X size={8} strokeWidth={3} />
                </button>
                <div className="flex-1 flex items-center justify-center">
                  <PixelIcon id={element2.id} size={24} />
                </div>
                <span className="text-[8px] font-black text-brand-ink truncate max-w-full uppercase tracking-wider px-0.5">
                  {element2.name}
                </span>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-brand-border rounded-xl bg-brand-card/30 text-brand-muted/40 p-1 text-center select-none">
                <span className="text-base">➕</span>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* CENTER: MIX Button */}
        <div className="absolute top-[44px] left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
          <motion.button
            id="btn-combine"
            whileHover={canCombine ? { scale: 1.05 } : {}}
            whileTap={canCombine ? { scale: 0.95 } : {}}
            onClick={onCombine}
            disabled={!canCombine}
            className={`
              relative flex items-center justify-center w-11 h-11 rounded-full border-2 border-brand-ink transition-all duration-150 shadow-[1px_1.5px_0px_0px_rgba(36,33,30,1)]
              ${canCombine
                ? 'bg-brand-ink hover:bg-brand-ink/90 cursor-pointer text-white'
                : 'bg-brand-border/60 text-brand-muted/30 cursor-not-allowed shadow-none border-brand-border'
              }
            `}
            title="Combine selected elements"
          >
            {/* White star icon in center */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={canCombine ? "text-white" : "text-brand-muted/40"}>
              <path d="M12 2l2.5 7.5 7.5 2.5-7.5 2.5-2.5 7.5-2.5-7.5-6.5-2.5 6.5-2.5z" fill="currentColor" />
            </svg>
          </motion.button>
          
          {/* Black "MIX" pill under the button */}
          <div className={`mt-0.5 px-2.5 py-0.5 rounded-full border border-brand-ink text-[8px] font-extrabold tracking-widest select-none shadow-[0.5px_1px_0px_0px_rgba(36,33,30,1)]
            ${canCombine ? 'bg-brand-ink text-white' : 'bg-brand-border/60 text-brand-muted/40 border-brand-border shadow-none'}
          `}>
            MIX
          </div>
        </div>

        {/* SLOT 3: Result Slot Bottom Center */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[72px] h-[72px]">
          <AnimatePresence mode="wait">
            {resultElement ? (
              <motion.div
                key={resultElement.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClearResult}
                className="relative flex flex-col items-center justify-center w-full h-full bg-brand-paper border-2 border-brand-ink rounded-xl p-1 text-center cursor-pointer select-none shadow-[1px_1.5px_0px_0px_rgba(36,33,30,1)]"
                title="Tap to clear"
              >
                <button
                  id="btn-clear-result"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearResult();
                  }}
                  className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-brand-paper border border-brand-ink text-brand-ink rounded-full shadow hover:bg-brand-card transition-colors z-15"
                >
                  <X size={8} strokeWidth={3} />
                </button>
                
                {/* Result Element Icon */}
                <div className="flex-1 flex items-center justify-center">
                  <PixelIcon id={resultElement.id} size={26} className="animate-bounce" />
                </div>
                
                <span className="text-[8px] font-black text-brand-primary truncate max-w-full uppercase tracking-wider px-0.5">
                  {resultElement.name}
                </span>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-brand-border rounded-xl bg-brand-card/20 text-brand-muted/30 p-1 text-center select-none">
                <span className="text-[10px] font-bold text-brand-muted/30 tracking-wider">RESULT</span>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Failure/Success Feedback text */}
      <div className="h-5 mt-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {combineFeedback === 'failure' && (
            <motion.span
              key="fail-text"
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 3 }}
              className="text-[10px] text-brand-primary font-black uppercase tracking-widest"
            >
              💨 No reaction
            </motion.span>
          )}
          {combineFeedback === 'success' && resultElement && (
            <motion.span
              key="success-text"
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 3 }}
              className="text-[10px] text-brand-secondary font-black uppercase tracking-widest flex items-center gap-1"
            >
              ✨ Discovered {resultElement.name}!
            </motion.span>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
