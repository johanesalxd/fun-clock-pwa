'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sun, Moon, RotateCcw, MapPin, Settings, Play, Pause, HelpCircle, Volume2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { AUDIO_URLS } from '@/lib/constants';
import { AnalogClock } from '@/components/AnalogClock';
import { DigitalClock } from '@/components/DigitalClock';
import { DateDisplay } from '@/components/DateDisplay';
import { WeatherOverlay } from '@/components/WeatherOverlay';
import { HelpOverlay } from '@/components/HelpOverlay';
import { SettingsOverlay } from '@/components/SettingsOverlay';
import { useWeather } from '@/hooks/useWeather';
import { useClock } from '@/hooks/useClock';
import { useTimer } from '@/hooks/useTimer';
import { useSpeakTime } from '@/hooks/useSpeakTime';

export default function TimeExplorerApp() {
  const [mounted, setMounted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  const [is24Hour, setIs24Hour] = useState(false);
  const [showSeconds, setShowSeconds] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [alternateMode, setAlternateMode] = useState(false);
  const [fullSecondsCircle, setFullSecondsCircle] = useState(true);

  const [stars, setStars] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    setMounted(true);
    setStars(Array.from({ length: 30 }).map(() => ({
      width: Math.random() * 5 + 2 + 'px',
      height: Math.random() * 5 + 2 + 'px',
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      animationDuration: Math.random() * 4 + 2 + 's',
      animationDelay: Math.random() * 2 + 's',
      opacity: Math.random() * 0.6 + 0.2
    })));
  }, []);

  const { weatherData, weatherCondition, locationName, timezone } = useWeather();
  const { time, isPlaying, setIsPlaying, timeOffset, handleTimeChange, togglePlay, syncToNow } = useClock(timezone);
  const { language, setLanguage, speakTime, isSupported } = useSpeakTime();

  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const roosterRef = useRef<HTMLAudioElement>(null);
  const cricketRef = useRef<HTMLAudioElement>(null);
  const prevIsDay = useRef<boolean | null>(null);
  const prevTimeRef = useRef<number | null>(null);

  const alarmRef = useRef<HTMLAudioElement>(null);
  const alarmTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const fallbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const initAudio = () => {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    };
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });
    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('touchstart', initAudio);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowLangMenu(false);
      }
    };

    if (showLangMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showLangMenu]);

  const stopAlarm = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(0);
    }
    if (alarmRef.current) {
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
    }
    if (alarmTimeoutRef.current) {
      clearTimeout(alarmTimeoutRef.current);
      alarmTimeoutRef.current = null;
    }
    if (fallbackIntervalRef.current) {
      clearInterval(fallbackIntervalRef.current);
      fallbackIntervalRef.current = null;
    }
  }, []);

  const playFallbackBeep = useCallback(() => {
    if (!audioCtxRef.current) return;
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    
    const playBeep = () => {
      if (!audioCtxRef.current) return;
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, audioCtxRef.current.currentTime);
      osc.frequency.setValueAtTime(1108.73, audioCtxRef.current.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, audioCtxRef.current.currentTime + 0.05);
      gain.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.5);
      
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      
      osc.start();
      osc.stop(audioCtxRef.current.currentTime + 0.5);
    };

    playBeep();
    fallbackIntervalRef.current = setInterval(playBeep, 1000);
  }, []);

  const playAlarmSound = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }

    if (alarmRef.current) {
      alarmRef.current.currentTime = 0;
      alarmRef.current.play().catch(e => {
        console.log("Alarm play blocked, using fallback", e);
        playFallbackBeep();
      });
      
      if (alarmTimeoutRef.current) clearTimeout(alarmTimeoutRef.current);
      alarmTimeoutRef.current = setTimeout(() => {
        stopAlarm();
      }, 15000);
    }
  }, [stopAlarm, playFallbackBeep]);

  const [appMode, setAppMode] = useState<'clock' | 'timer'>('clock');
  const {
    timerValue,
    isTimerRunning,
    resetTimer,
    toggleTimer,
    getTimerDisplayDate,
    handleTimerChange
  } = useTimer(playAlarmSound, stopAlarm);

  const playThunder = () => {
    const audio = new Audio(AUDIO_URLS.thunder);
    audio.play().catch(e => console.log(e));
  };

  const date = new Date(time);
  const hour24 = date.getHours();
  const isDay = hour24 >= 6 && hour24 < 18;
  
  const appDateStr = new Date(time).toLocaleDateString('en-US', { timeZone: timezone });
  const realDateStr = new Date().toLocaleDateString('en-US', { timeZone: timezone });
  const isCurrentDate = appDateStr === realDateStr;

  let currentAudioUrl: string | undefined = undefined;
  if (isCurrentDate) {
    if (weatherCondition === 'rain' || weatherCondition === 'thunderstorm') currentAudioUrl = AUDIO_URLS.rain;
    else if (weatherCondition === 'snow') currentAudioUrl = AUDIO_URLS.snow;
  }
  
  if (!currentAudioUrl) {
    currentAudioUrl = isDay ? AUDIO_URLS.sunny : AUDIO_URLS.night;
  }

  const effectiveIsMuted = appMode === 'timer' ? true : isMuted;

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = effectiveIsMuted;
    
    if (!effectiveIsMuted) {
       audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    } else {
       audioRef.current.pause();
    }
  }, [effectiveIsMuted, currentAudioUrl]);

  useEffect(() => {
    if (prevIsDay.current !== null && prevIsDay.current !== isDay) {
      // Only play sounds if time is moving forward
      const isMovingForward = time > (prevTimeRef.current || 0);
      if (isMovingForward && !effectiveIsMuted) {
        if (isDay) {
          if (roosterRef.current) {
            roosterRef.current.currentTime = 0;
            roosterRef.current.play().catch(e => console.log("Rooster play blocked", e));
          }
        } else {
          if (cricketRef.current) {
            cricketRef.current.currentTime = 0;
            cricketRef.current.play().catch(e => console.log("Cricket play blocked", e));
          }
        }
      }
    }
    prevIsDay.current = isDay;
    prevTimeRef.current = time;
  }, [isDay, time, effectiveIsMuted]);

  const bgClass = isDay ? 'bg-sky-300' : 'bg-indigo-950';
  const textColor = isDay ? 'text-slate-800' : 'text-slate-100';

  useEffect(() => {
    const hexColor = isDay ? '#7dd3fc' : '#1e1b4b';
    document.body.style.backgroundColor = hexColor;
    
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', hexColor);
  }, [isDay]);

  if (!mounted) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-sky-300">
        <div className="text-2xl sm:text-4xl font-black text-slate-800 animate-pulse">Loading Clock...</div>
      </main>
    );
  }

  return (
    <main className="h-[100dvh] w-full flex justify-center overflow-hidden">
      <h1 className="sr-only">Kids Time Explorer</h1>
      
      {/* Orientation Locks */}
      <div className="fixed inset-0 z-[100] bg-slate-900 text-white flex-col items-center justify-center hidden [@media(hover:none)_and_(pointer:coarse)_and_(orientation:landscape)_and_(max-height:500px)]:flex">
        <RotateCcw className="w-16 h-16 mb-6 animate-[spin_3s_linear_infinite]" />
        <h2 className="text-2xl font-black text-center px-4">Please rotate your phone to portrait mode.</h2>
      </div>
      <div className="fixed inset-0 z-[100] bg-slate-900 text-white flex-col items-center justify-center hidden [@media(min-width:768px)_and_(orientation:portrait)]:flex">
        <RotateCcw className="w-16 h-16 mb-6 animate-[spin_3s_linear_infinite]" />
        <h2 className="text-2xl font-black text-center px-4">Please rotate your tablet to landscape mode.</h2>
      </div>

      <div className={cn("h-full w-full flex flex-col relative transition-colors duration-1000 shadow-2xl", bgClass, textColor)}>
        <WeatherOverlay condition={weatherCondition} isDay={isDay} />
        
        {/* Audio Elements */}
        <audio ref={audioRef} src={currentAudioUrl} loop />
        <audio ref={roosterRef} src={AUDIO_URLS.rooster} />
        <audio ref={cricketRef} src={AUDIO_URLS.night} />
        <audio ref={alarmRef} src={AUDIO_URLS.alarm} loop preload="auto" />

        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {isDay ? (
            <>
              <div className="absolute top-20 left-10 w-64 h-64 bg-white/40 rounded-full blur-3xl" />
              <div className="absolute top-40 right-20 w-96 h-32 bg-white/50 rounded-full blur-3xl" />
              <div className="absolute bottom-20 left-1/4 w-[500px] h-64 bg-white/40 rounded-full blur-3xl" />
            </>
          ) : (
            <>
              {stars.map((style, i) => (
                <div 
                  key={i}
                  className="absolute bg-white rounded-full animate-pulse"
                  style={style}
                />
              ))}
            </>
          )}
        </div>

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 flex items-start z-20 pointer-events-none pt-[max(1rem,env(safe-area-inset-top))] md:pt-[max(1.5rem,env(safe-area-inset-top))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] md:pl-[max(1.5rem,env(safe-area-inset-left))] md:pr-[max(1.5rem,env(safe-area-inset-right))]">
          <div className="flex flex-col gap-1 pointer-events-auto flex-1 min-w-0 mr-3 items-start">
            {appMode === 'clock' && (
              <div className={cn("inline-flex items-center gap-2 backdrop-blur-md px-4 h-12 rounded-full shadow-sm border transition-colors max-w-full", isDay ? "bg-white/30 border-white/20" : "bg-black/20 border-white/10")}>
                <MapPin className={cn("w-5 h-5 shrink-0", isDay ? "text-slate-700" : "text-slate-200")} />
                <span className={cn("text-sm font-bold truncate", isDay ? "text-slate-800" : "text-slate-100")}>{locationName}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-3 pointer-events-auto shrink-0">
            <div className="flex gap-3">
              {appMode === 'clock' && isSupported && (
                <div className="relative" ref={langMenuRef}>
                  <div className={cn("flex items-stretch backdrop-blur-md rounded-full shadow-sm border transition-colors h-12", isDay ? "bg-white/30 border-white/20" : "bg-black/20 border-white/10")}>
                    <button
                      aria-label="Speak current time"
                      onClick={() => speakTime(time)}
                      className={cn("px-3 flex items-center justify-center rounded-l-full transition-colors", isDay ? "text-slate-800 hover:bg-white/50" : "text-slate-200 hover:bg-black/40")}
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <div className="flex items-center">
                      <div className={cn("w-px h-6", isDay ? "bg-white/30" : "bg-white/10")} />
                    </div>
                    <button
                      aria-label={`${language === 'en-US' ? 'EN' : language === 'en-GB' ? 'UK' : 'ID'} - Select language`}
                      aria-expanded={showLangMenu}
                      aria-haspopup="listbox"
                      onClick={() => setShowLangMenu(!showLangMenu)}
                      className={cn("px-3 flex items-center justify-center rounded-r-full transition-colors min-w-[48px]", isDay ? "text-slate-800 hover:bg-white/50" : "text-slate-200 hover:bg-black/40")}
                    >
                      <span className="text-sm font-bold">{language === 'en-US' ? 'EN' : language === 'en-GB' ? 'UK' : 'ID'}</span>
                    </button>
                  </div>
                  
                  {showLangMenu && (
                    <div 
                      role="listbox"
                      className={cn("absolute top-full right-0 mt-2 w-40 rounded-xl shadow-lg border backdrop-blur-xl overflow-hidden z-50", isDay ? "bg-white/90 border-white/50" : "bg-slate-800/90 border-slate-700")}
                    >
                      <button 
                        role="option"
                        aria-selected={language === 'en-US'}
                        onClick={() => { setLanguage('en-US'); setShowLangMenu(false); }}
                        className={cn("w-full text-left px-4 py-3 text-sm font-medium transition-colors", isDay ? "text-slate-800 hover:bg-slate-100" : "text-slate-200 hover:bg-slate-700", language === 'en-US' && (isDay ? "bg-slate-100" : "bg-slate-700"))}
                      >
                        English (US)
                      </button>
                      <button 
                        role="option"
                        aria-selected={language === 'en-GB'}
                        onClick={() => { setLanguage('en-GB'); setShowLangMenu(false); }}
                        className={cn("w-full text-left px-4 py-3 text-sm font-medium transition-colors", isDay ? "text-slate-800 hover:bg-slate-100" : "text-slate-200 hover:bg-slate-700", language === 'en-GB' && (isDay ? "bg-slate-100" : "bg-slate-700"))}
                      >
                        English (UK)
                      </button>
                      <button 
                        role="option"
                        aria-selected={language === 'id-ID'}
                        onClick={() => { setLanguage('id-ID'); setShowLangMenu(false); }}
                        className={cn("w-full text-left px-4 py-3 text-sm font-medium transition-colors", isDay ? "text-slate-800 hover:bg-slate-100" : "text-slate-200 hover:bg-slate-700", language === 'id-ID' && (isDay ? "bg-slate-100" : "bg-slate-700"))}
                      >
                        Bahasa Indonesia
                      </button>
                    </div>
                  )}
                </div>
              )}
              <button 
                aria-label="Help"
                onClick={() => setShowHelp(true)}
                className={cn("w-12 h-12 flex items-center justify-center backdrop-blur-md rounded-full shadow-sm border transition-colors", isDay ? "bg-white/30 border-white/20 text-slate-800 hover:bg-white/50" : "bg-black/20 border-white/10 text-slate-200 hover:bg-black/40")}
              >
                <HelpCircle className="w-6 h-6" />
              </button>
              <button 
                aria-label="Settings"
                onClick={() => setShowSettings(true)}
                className={cn("w-12 h-12 flex items-center justify-center backdrop-blur-md rounded-full shadow-sm border transition-colors", isDay ? "bg-white/30 border-white/20 text-slate-800 hover:bg-white/50" : "bg-black/20 border-white/10 text-slate-200 hover:bg-black/40")}
              >
                <Settings className="w-6 h-6" />
              </button>
            </div>
            <button 
              aria-label={appMode === 'timer' ? (isTimerRunning ? "Pause timer" : "Start timer") : (isPlaying ? "Pause clock" : "Play clock")}
              onClick={appMode === 'timer' ? toggleTimer : togglePlay}
              className={cn(
                "w-12 h-12 flex items-center justify-center rounded-full shadow-sm border-2 transition-colors",
                (appMode === 'timer' ? isTimerRunning : isPlaying)
                  ? "bg-amber-100/80 border-amber-300 text-amber-700 hover:bg-amber-200" 
                  : "bg-green-100/80 border-green-300 text-green-700 hover:bg-green-200"
              )}
            >
              {(appMode === 'timer' ? isTimerRunning : isPlaying) ? <Pause className="w-6 h-6" fill="currentColor" /> : <Play className="w-6 h-6" fill="currentColor" />}
            </button>
            {(appMode === 'timer' || timeOffset !== 0) && (
              <button 
                aria-label={appMode === 'timer' ? "Reset timer" : "Sync to current time"}
                onClick={appMode === 'timer' ? resetTimer : syncToNow}
                className="w-12 h-12 flex items-center justify-center bg-blue-100/80 border-blue-300 text-blue-700 rounded-full shadow-sm hover:bg-blue-200 transition-all animate-in fade-in zoom-in duration-300"
              >
                <RotateCcw className="w-6 h-6" strokeWidth={3} /> 
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-between pt-24 md:pt-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:pb-[max(2rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] md:pl-[max(2rem,env(safe-area-inset-left))] md:pr-[max(2rem,env(safe-area-inset-right))] z-10 relative overflow-hidden w-full max-w-7xl mx-auto min-h-0">
          
          {/* Analog Clock (Center) */}
          <div className="flex-1 flex items-center justify-center w-full min-h-0 mt-4 md:mt-0">
            <div className="w-full max-w-[72vmin] md:max-w-[60vmin] lg:max-w-[65vmin] aspect-square shrink-0">
              <AnalogClock 
                time={appMode === 'timer' ? getTimerDisplayDate() : time} 
                onChangeTime={appMode === 'timer' ? handleTimerChange : handleTimeChange} 
                showSeconds={appMode === 'timer' ? true : showSeconds} 
                is24Hour={appMode === 'timer' ? true : is24Hour} 
                isPlaying={appMode === 'timer' ? isTimerRunning : isPlaying}
                fullSecondsCircle={fullSecondsCircle}
                isTimerMode={appMode === 'timer'}
                timerValue={timerValue}
                alternateMode={alternateMode}
              />
            </div>
          </div>

          {/* Bottom Area: Digital Clock, Date, Weather */}
          <div className="w-full max-w-3xl mx-auto flex flex-col md:flex-row items-stretch justify-center gap-3 sm:gap-6 shrink-0 mt-2 md:mt-0">
            
            <DigitalClock 
              time={appMode === 'timer' ? getTimerDisplayDate() : time} 
              onChangeTime={appMode === 'timer' ? handleTimerChange : handleTimeChange} 
              showSeconds={appMode === 'timer' ? true : showSeconds} 
              is24Hour={appMode === 'timer' ? true : is24Hour}
              alternateMode={alternateMode}
              isTimerMode={appMode === 'timer'}
              isDay={isDay}
              className={cn("w-full", appMode === 'clock' ? "md:w-1/2 md:flex-1" : "max-w-md mx-auto")}
            />

            {appMode === 'clock' && (
              <div className="w-full md:w-1/2 md:flex-1 flex flex-col gap-3 shrink-0">
                {showDate && (
                  <DateDisplay 
                    time={time} 
                    onChangeTime={handleTimeChange}
                    className="w-full flex-1"
                  />
                )}
                
                <div className={cn("flex items-center justify-between gap-3 sm:gap-4 backdrop-blur-xl px-4 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-lg border-2 whitespace-nowrap w-full flex-1", isDay ? "bg-white/40 border-white/40" : "bg-black/20 border-white/10")}>
                  <div className="flex items-center gap-2">
                    {isDay ? <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 drop-shadow-md" fill="currentColor" /> : <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 drop-shadow-md" fill="currentColor" />}
                    <span className={cn("text-sm sm:text-base font-black tracking-tight", isDay ? "text-slate-800" : "text-slate-100")}>{isDay ? 'Day Time' : 'Night Time'}</span>
                  </div>
                  {isCurrentDate ? (
                    <div className="flex items-center gap-2">
                      <span className={cn("text-sm sm:text-base font-black capitalize", isDay ? "text-blue-600" : "text-blue-300")}>{weatherCondition}</span>
                      {weatherData && <span className={cn("text-sm sm:text-base font-bold", isDay ? "text-slate-700" : "text-slate-200")}>{weatherData.temperature}°C</span>}
                    </div>
                  ) : (
                    <span className={cn("text-sm font-bold italic", isDay ? "text-slate-500" : "text-slate-300")}>Time traveled</span>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Help Overlay */}
        <HelpOverlay showHelp={showHelp} setShowHelp={setShowHelp} />

        {/* Settings Overlay */}
        <SettingsOverlay
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          appMode={appMode}
          setAppMode={setAppMode}
          setIsPlaying={setIsPlaying}
          display={{
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
          }}
          audio={{
            isMuted,
            setIsMuted,
            weatherCondition,
            playThunder
          }}
        />
      </div>
    </main>
  );
}
