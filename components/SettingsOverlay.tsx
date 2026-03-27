import React from 'react';
import { X, Volume2, VolumeX, CloudLightning, Music } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Toggle } from './Toggle';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function SettingsOverlay({
  showSettings,
  setShowSettings,
  appMode,
  setAppMode,
  setIsPlaying,
  isMuted,
  setIsMuted,
  weatherCondition,
  playThunder,
  AUDIO_URLS,
  is24Hour,
  setIs24Hour,
  showSeconds,
  setShowSeconds,
  showDate,
  setShowDate,
  alternateMode,
  setAlternateMode,
  fullSecondsCircle,
  setFullSecondsCircle
}: any) {
  if (!showSettings) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl p-6 flex flex-col gap-6 animate-in slide-in-from-bottom-full duration-300 text-slate-800 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-800">Settings</h2>
          <button 
            aria-label="Close settings"
            onClick={() => setShowSettings(false)}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* App Mode */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">App Mode</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setAppMode('clock')}
                className={cn("flex-1 py-2 rounded-xl font-bold transition-all", appMode === 'clock' ? "bg-indigo-500 text-white shadow-md" : "bg-slate-100 text-slate-500 hover:bg-slate-200")}
              >
                Clock
              </button>
              <button
                onClick={() => {
                  setAppMode('timer');
                  setIsPlaying(false);
                }}
                className={cn("flex-1 py-2 rounded-xl font-bold transition-all", appMode === 'timer' ? "bg-indigo-500 text-white shadow-md" : "bg-slate-100 text-slate-500 hover:bg-slate-200")}
              >
                Timer
              </button>
            </div>
          </div>

          {/* Sound Controls */}
          {appMode !== 'timer' && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Audio</h3>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className={cn("flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm border-2 transition-all active:scale-95", isMuted ? "bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200" : "bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200")}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span className="text-sm font-bold">{isMuted ? 'Unmute Sounds' : 'Mute Sounds'}</span>
                </button>

                {weatherCondition === 'thunderstorm' && !isMuted && (
                  <button 
                    onClick={playThunder}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-100 border-2 border-purple-300 text-purple-700 rounded-xl shadow-sm hover:bg-purple-200 transition-all active:scale-95"
                  >
                    <CloudLightning className="w-4 h-4" />
                    <span className="text-sm font-bold">Play Thunder</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Soundboard Controls */}
          {appMode !== 'timer' && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Soundboard</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(AUDIO_URLS).map(([key, url]) => (
                  <button
                    key={key}
                    onClick={() => {
                      const audio = new Audio(url as string);
                      audio.play().catch(e => console.log("Soundboard play blocked", e));
                      setTimeout(() => {
                        audio.pause();
                        audio.currentTime = 0;
                      }, 5000);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-amber-100 border-2 border-amber-300 text-amber-700 rounded-xl shadow-sm hover:bg-amber-200 transition-all active:scale-95 capitalize"
                  >
                    <Music className="w-4 h-4" />
                    <span className="text-sm font-bold">{key}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Display Controls */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Display</h3>
            <div className="flex flex-col gap-2">
              {appMode !== 'timer' && (
                <>
                  <Toggle label="24-Hour Time" checked={is24Hour} onChange={setIs24Hour} color="green" />
                  <Toggle label="Show Seconds" checked={showSeconds} onChange={setShowSeconds} color="blue" />
                  <Toggle label="Show Date" checked={showDate} onChange={setShowDate} color="yellow" />
                  <Toggle label="Alternate Mode (00-60)" checked={alternateMode} onChange={setAlternateMode} color="yellow" />
                </>
              )}
              <Toggle label="Full Seconds Circle" checked={fullSecondsCircle} onChange={setFullSecondsCircle} color="yellow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
