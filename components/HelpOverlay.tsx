import React from 'react';
import { HelpCircle, X } from 'lucide-react';

export function HelpOverlay({ showHelp, setShowHelp }: any) {
  if (!showHelp) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setShowHelp(false)}>
      <div 
        className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto flex flex-col gap-6 animate-in zoom-in-95 duration-300 text-slate-800 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-blue-500" />
            How to Play
          </h2>
          <button 
            aria-label="Close help"
            onClick={() => setShowHelp(false)}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="font-bold text-lg mb-2 text-blue-600 flex items-center gap-2">
              🌟 Features
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5">
              <li>Drag the hands or use the buttons to time travel with the interactive clock.</li>
              <li>Switch to Timer Mode to set a countdown and hear an alarm when time is up.</li>
              <li>See what the real weather is like outside right now based on your location.</li>
              <li>Watch the sky change and stars appear automatically as day turns to night.</li>
              <li>Hear nature sounds like birds, crickets, rain, and thunder.</li>
            </ul>
          </section>
          
          <section>
            <h3 className="font-bold text-lg mb-2 text-green-600 flex items-center gap-2">
              🎮 How to Use
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5">
              <li>Click the Gear icon ⚙️ and select &quot;Unmute Sounds&quot; to hear the background audio.</li>
              <li>Move the clock hands to explore different times and see the sky change.</li>
              <li>Click the Rotate icon 🔄 to return to the real time or reset your timer.</li>
              <li>Open Settings to play fun sounds anytime using the soundboard.</li>
            </ul>
          </section>
          
          <section className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-xs text-slate-500 text-center">
              <strong>Tip:</strong> You can install this app on your device! On Android/Desktop, look for the install icon in your browser address bar. On iOS/iPadOS, open in Safari or Chrome and tap &quot;Share&quot; &gt; &quot;Add to Home Screen&quot;.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
