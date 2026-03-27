import React from 'react';

import { ChevronUp, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

interface DateDisplayProps {
  time: number;
  onChangeTime: (updater: number | ((prev: number) => number)) => void;
  className?: string;
}

/** Date display with previous/next day navigation. */
export function DateDisplay({ time, onChangeTime, className }: DateDisplayProps) {
  const date = new Date(time);
  
  const addDays = (amount: number) => {
    onChangeTime((prev: number) => prev + amount * 24 * 3600000);
  };

  return (
    <div className={cn("flex items-center justify-between bg-white/90 backdrop-blur-xl px-3 sm:px-5 py-2 sm:py-3 rounded-2xl shadow-xl border-4 border-white/50", className)}>
      <button aria-label="Previous day" onClick={() => addDays(-1)} className="p-1 sm:p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-400 hover:text-slate-700 active:scale-90 transition-all touch-manipulation">
        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 rotate-90" strokeWidth={3} />
      </button>
      <div className="text-sm sm:text-base md:text-lg font-black text-slate-700 text-center flex-1 mx-2 whitespace-nowrap">
        {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
      </div>
      <button aria-label="Next day" onClick={() => addDays(1)} className="p-1 sm:p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-400 hover:text-slate-700 active:scale-90 transition-all touch-manipulation">
        <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 rotate-90" strokeWidth={3} />
      </button>
    </div>
  );
}
