import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TimeColumn = ({ value, unit, colorClass, addTime }: { value: string, unit: 'hour'|'minute'|'second', colorClass: string, addTime: (amount: number, unit: 'hour'|'minute'|'second') => void }) => (
  <div className="flex flex-col items-center">
    <button aria-label={`Increase ${unit}`} onClick={() => addTime(1, unit)} className="p-1 sm:p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-400 hover:text-slate-700 active:scale-90 transition-all touch-manipulation mb-1">
      <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />
    </button>
    <div className={cn("text-3xl sm:text-4xl md:text-5xl font-black tabular-nums tracking-tighter leading-none", colorClass)}>
      {value}
    </div>
    <button aria-label={`Decrease ${unit}`} onClick={() => addTime(-1, unit)} className="p-1 sm:p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-400 hover:text-slate-700 active:scale-90 transition-all touch-manipulation mt-1">
      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />
    </button>
  </div>
);

export function DigitalClock({ time, onChangeTime, showSeconds, is24Hour, alternateMode, isTimerMode, className }: any) {
  const date = new Date(time);
  
  const addTime = (amount: number, unit: 'hour' | 'minute' | 'second') => {
    onChangeTime((prev: number) => {
      const d = new Date(prev);
      d.setMilliseconds(0);
      if (unit === 'hour') d.setHours(d.getHours() + amount);
      if (unit === 'minute') d.setMinutes(d.getMinutes() + amount);
      if (unit === 'second') d.setSeconds(d.getSeconds() + amount);
      return d.getTime();
    });
  };

  const toggleAmPm = () => {
    onChangeTime((prev: number) => {
      const d = new Date(prev);
      d.setHours(d.getHours() + 12);
      return d.getTime();
    });
  };

  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();

  if (alternateMode && !isTimerMode) {
    if (showSeconds) {
      if (s === 0) {
        s = 60;
        m -= 1;
        if (m < 0) {
          m = 60;
          h -= 1;
          if (h < 0) {
            h = 23;
          }
        }
      }
    } else {
      if (m === 0) {
        m = 60;
        h -= 1;
        if (h < 0) {
          h = 23;
        }
      }
    }
  }

  const ampm = h >= 12 ? 'PM' : 'AM';
  
  if (!is24Hour) {
    h = h % 12;
    if (h === 0) h = 12;
  }

  const format = (v: number) => v.toString().padStart(2, '0');
  
  const displayH = format(h);
  const displayM = format(m);
  const displayS = format(s);

  return (
    <div className={cn("flex flex-col items-center justify-center bg-white/90 backdrop-blur-xl px-4 sm:px-8 py-4 sm:py-6 rounded-3xl shadow-xl border-2 border-white/50", className)}>
      <div className="flex items-center gap-2 sm:gap-4">
        <TimeColumn value={displayH} unit="hour" colorClass="text-green-500" addTime={addTime} />
        <div className="text-2xl sm:text-4xl font-black text-slate-300 pb-1 sm:pb-2">:</div>
        <TimeColumn value={displayM} unit="minute" colorClass="text-red-500" addTime={addTime} />
        
        {showSeconds && (
          <>
            <div className="text-2xl sm:text-4xl font-black text-slate-300 pb-1 sm:pb-2">:</div>
            <TimeColumn value={displayS} unit="second" colorClass="text-blue-500" addTime={addTime} />
          </>
        )}
        
        {!is24Hour && !isTimerMode && (
          <div className="flex flex-col items-center ml-2 sm:ml-4">
            <button 
              onClick={toggleAmPm}
              className="px-2 sm:px-3 py-1 sm:py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-xl font-black text-sm sm:text-lg transition-colors active:scale-95"
            >
              {ampm}
            </button>
          </div>
        )}
      </div>
      <div className="flex gap-4 sm:gap-8 text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-1">
        <span className="text-green-700">Hours</span>
        <span className="text-red-600">Minutes</span>
        {showSeconds && <span className="text-blue-600">Seconds</span>}
      </div>
    </div>
  );
}
