import React from 'react';
import { motion } from 'motion/react';
import { Element } from '../types/game';
import PixelIcon from './PixelIcon';

interface ElementCardProps {
  key?: string | number;
  element: Element;
  isSelected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export default function ElementCard({ element, isSelected = false, onClick, disabled = false }: ElementCardProps) {
  return (
    <motion.button
      id={`element-card-${element.id}`}
      whileHover={disabled ? {} : { y: -1, scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative flex flex-col items-center justify-center p-1 sm:p-1.5 rounded-xl border transition-all duration-200 text-center select-none w-full aspect-square cursor-pointer
        ${isSelected 
          ? 'bg-brand-paper border-brand-ink border-2 shadow-[1px_1.5px_0px_0px_rgba(36,33,30,1)]' 
          : 'bg-brand-card hover:bg-brand-paper border-brand-border hover:border-brand-muted/60 shadow-[0.5px_1px_0px_0px_rgba(217,195,170,1)]'
        }
      `}
      title={element.description}
    >
      {/* Icon Area */}
      <div className="flex-1 flex items-center justify-center mb-0.5">
        <PixelIcon id={element.id} size={24} className="filter drop-shadow-sm" />
      </div>

      {/* Name */}
      <div className="w-full text-center px-0.5">
        <p className="text-[8px] sm:text-[9px] font-black text-brand-ink truncate w-full uppercase tracking-wider">
          {element.name}
        </p>
      </div>
    </motion.button>
  );
}
