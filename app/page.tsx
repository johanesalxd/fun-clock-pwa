'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sun, Moon, RotateCcw, MapPin, Settings, Play, Pause, HelpCircle } from 'lucide-react';

import { cn } from '../lib/utils';
import { AUDIO_URLS } from '../lib/constants';

import { AnalogClock } from '../components/AnalogClock';
import { DigitalClock } from '../components/DigitalClock';
import { DateDisplay } from '../components/DateDisplay';
import { WeatherOverlay } from '../components/WeatherOverlay';
import { HelpOverlay } from '../components/HelpOverlay';
import { SettingsOverlay } from '../components/SettingsOverlay';

import { useWeather } from '../hooks/useWeather';
import { useClock } from '../hooks/useClock';
import { useTimer } from '../hooks/useTimer';

export default function TimeExplorerApp() {
  const [mounted, setMounted] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  const [is24Hour, setIs24Hour] = useState(false);
  const [showSeconds, setShowSeconds] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [alternateMode, setAlternateMode] = useState(false);
  const [fullSecondsCircle, setFullSecondsCircle] = useState(true);

  const [stars, setStars] = useState<any[]>(() => {
    if (typeof window === 'undefined') return [];
    return Array.from({ length: 30 }).map(() => ({
      width: Math.random() * 5 + 2 + 'px',
      height: Math.random() * 5 + 2 + 'px',
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      animationDuration: Math.random() * 4 + 2 + 's',
      animationDelay: Math.random() * 2 + 's',
      opacity: Math.random() * 0.6 + 0.2
    }));
  });

  const { weatherData, weatherCondition, locationName, timezone } = useWeather();
  const { time, isPlaying, setIsPlaying, timeOffset, handleTimeChange, togglePlay, syncToNow } = useClock(timezone);

  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const roosterRef = useRef<HTMLAudioElement>(null);
  const cricketRef = useRef<HTMLAudioElement>(null);
  const prevIsDay = useRef<boolean | null>(null);
  const prevTimeRef = useRef<number | null>(null);

  const alarmRef = useRef<HTMLAudioElement>(null);
  const alarmTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stopAlarm = useCallback(() => {
    if (alarmRef.current) {
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
    }
    if (alarmTimeoutRef.current) {
      clearTimeout(alarmTimeoutRef.current);
      alarmTimeoutRef.current = null;
    }
  }, []);

  const playAlarmSound = useCallback(() => {
    if (alarmRef.current) {
      alarmRef.current.currentTime = 0;
      alarmRef.current.play().catch(e => console.log("Alarm play blocked", e));
      
      if (alarmTimeoutRef.current) clearTimeout(alarmTimeoutRef.current);
      alarmTimeoutRef.current = setTimeout(() => {
        stopAlarm();
      }, 15000);
    }
  }, [stopAlarm]);

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
    if (!mounted) return;
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
  }, [isDay, mounted, time, effectiveIsMuted]);

  const bgClass = isDay ? 'bg-sky-300' : 'bg-indigo-950';
  const textColor = isDay ? 'text-slate-800' : 'text-slate-100';

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
        <audio ref={alarmRef} src={AUDIO_URLS.alarm} loop />

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
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-start z-20 pointer-events-none">
          <div className="flex flex-col gap-1 pointer-events-auto">
            {appMode === 'clock' && (
              <div className={cn("flex items-center gap-1.5 backdrop-blur-md px-3 py-2 rounded-xl shadow-sm border", isDay ? "bg-white/30 border-white/20" : "bg-black/20 border-white/10")}>
                <MapPin className={cn("w-4 h-4", isDay ? "text-slate-700" : "text-slate-200")} />
                <span className={cn("text-sm font-bold", isDay ? "text-slate-800" : "text-slate-100")}>{locationName}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-3 pointer-events-auto">
            <div className="flex gap-3">
              <button 
                aria-label="Help"
                onClick={() => setShowHelp(true)}
                className={cn("p-3 backdrop-blur-md rounded-full shadow-sm border transition-colors", isDay ? "bg-white/30 border-white/20 text-slate-800 hover:bg-white/50" : "bg-black/20 border-white/10 text-slate-200 hover:bg-black/40")}
              >
                <HelpCircle className="w-6 h-6" />
              </button>
              <button 
                aria-label="Settings"
                onClick={() => setShowSettings(true)}
                className={cn("p-3 backdrop-blur-md rounded-full shadow-sm border transition-colors", isDay ? "bg-white/30 border-white/20 text-slate-800 hover:bg-white/50" : "bg-black/20 border-white/10 text-slate-200 hover:bg-black/40")}
              >
                <Settings className="w-6 h-6" />
              </button>
            </div>
            <button 
              aria-label={appMode === 'timer' ? (isTimerRunning ? "Pause timer" : "Start timer") : (isPlaying ? "Pause clock" : "Play clock")}
              onClick={appMode === 'timer' ? toggleTimer : togglePlay}
              className={cn(
                "p-3 rounded-full shadow-sm border-2 transition-colors",
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
                className="p-3 bg-blue-100/80 border-blue-300 text-blue-700 rounded-full shadow-sm hover:bg-blue-200 transition-all animate-in fade-in zoom-in duration-300"
              >
                <RotateCcw className="w-6 h-6" strokeWidth={3} /> 
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-between pt-24 md:pt-8 pb-6 md:pb-8 px-4 md:px-8 z-10 relative overflow-hidden w-full max-w-7xl mx-auto min-h-0">
          
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
