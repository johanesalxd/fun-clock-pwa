import React from 'react';

import { cn } from '@/lib/utils';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  color: 'red' | 'green' | 'blue' | 'yellow';
}

/** Accessible toggle switch with color-coded visual state. */
export function Toggle({ label, checked, onChange, color }: ToggleProps) {
  const colorClasses = {
    red: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
  }[color];

  return (
    <label className="flex items-center justify-between cursor-pointer bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
      <span className="font-bold text-slate-700 text-sm select-none">{label}</span>
      <div className={cn("w-10 h-6 rounded-full flex items-center px-1 transition-colors", checked ? colorClasses : "bg-slate-300")}>
        <div className={cn("w-4 h-4 rounded-full bg-white shadow-sm transition-transform", checked ? "translate-x-4" : "translate-x-0")} />
      </div>
      <input type="checkbox" role="switch" aria-checked={checked} className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}
