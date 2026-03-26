'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, RotateCcw, ChevronUp, ChevronDown, MapPin, Volume2, VolumeX, CloudLightning, Settings, X, Play, Pause, Music } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getSvgPoint = (e: React.PointerEvent | PointerEvent, svg: SVGSVGElement) => {
  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  return pt.matrixTransform(svg.getScreenCTM()!.inverse());
};

function AnalogClock({ time, onChangeTime, showSeconds, is24Hour }: any) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeHand, setActiveHand] = useState<'hour' | 'minute' | 'second' | null>(null);
  const lastAngleRef = useRef<number>(0);

  const startDrag = (e: React.PointerEvent, hand: 'hour' | 'minute' | 'second') => {
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    const pt = getSvgPoint(e, svg);
    let angle = Math.atan2(pt.y - 50, pt.x - 50) * (180 / Math.PI);
    lastAngleRef.current = angle;
    setActiveHand(hand);
  };

  useEffect(() => {
    if (!activeHand) return;

    const handleMove = (e: PointerEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const pt = getSvgPoint(e, svg);
      let angle = Math.atan2(pt.y - 50, pt.x - 50) * (180 / Math.PI);

      let delta = angle - lastAngleRef.current;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;

      lastAngleRef.current = angle;

      let msDelta = 0;
      if (activeHand === 'hour') msDelta = (delta / 360) * 12 * 60 * 60 * 1000;
      if (activeHand === 'minute') msDelta = (delta / 360) * 60 * 60 * 1000;
      if (activeHand === 'second') msDelta = (delta / 360) * 60 * 1000;

      onChangeTime((prev: number) => prev + msDelta);
    };

    const handleUp = () => {
      setActiveHand(null);
    };

    window.addEventListener('pointermove', handleMove, { passive: false });
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };
  }, [activeHand, onChangeTime]);

  const date = new Date(time);
  const ms = date.getMilliseconds();
  const s = date.getSeconds() + ms / 1000;
  const m = date.getMinutes() + s / 60;
  const h = date.getHours() % 12 + m / 60;

  const secondAngle = s * 6;
  const minuteAngle = m * 6;
  const hourAngle = h * 30;

  const drawHand = (angle: number, length: number, width: number, color: string, type: 'hour'|'minute'|'second') => {
    const rad = angle * (Math.PI / 180);
    const x2 = 50 + Math.sin(rad) * length;
    const y2 = 50 - Math.cos(rad) * length;
    const tailLength = length * 0.2;
    const x1 = 50 - Math.sin(rad) * tailLength;
    const y1 = 50 + Math.cos(rad) * tailLength;
    
    const isActive = activeHand === type;
    
    return (
      <g className="transition-opacity" style={{ opacity: activeHand && !isActive ? 0.5 : 1 }}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round" className="pointer-events-none" />
        <circle cx="50" cy="50" r={width * 0.8} fill={color} className="pointer-events-none" />
        <line 
          x1={x1} y1={y1} x2={x2} y2={y2} 
          stroke="transparent" 
          strokeWidth={Math.max(width + 8, 12)} 
          strokeLinecap="round" 
          onPointerDown={(e) => startDrag(e, type)}
          style={{ cursor: isActive ? 'grabbing' : 'grab' }}
        />
      </g>
    );
  };

  return (
    <svg ref={svgRef} viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl bg-white rounded-full" style={{ touchAction: 'none' }}>
      <defs>
        <linearGradient id="minSecGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="49" fill="none" stroke="#f8fafc" strokeWidth="2" />
      <circle cx="50" cy="50" r="48" fill="#ffffff" />
      
      {Array.from({ length: 12 }).map((_, i) => {
        const m = i === 0 ? 60 : i * 5;
        const angle = (i * 30) * (Math.PI / 180);
        const x = 50 + Math.sin(angle) * 45;
        const y = 50 - Math.cos(angle) * 45;
        return <text key={`m-${i}`} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="4" fill="url(#minSecGradient)" fontWeight="900" className="select-none pointer-events-none">{m}</text>;
      })}

      {Array.from({ length: 60 }).map((_, i) => {
        const isHour = i % 5 === 0;
        const angle = (i * 6) * (Math.PI / 180);
        const x1 = 50 + Math.sin(angle) * (isHour ? 37 : 39);
        const y1 = 50 - Math.cos(angle) * (isHour ? 37 : 39);
        const x2 = 50 + Math.sin(angle) * 41;
        const y2 = 50 - Math.cos(angle) * 41;
        return <line key={`t-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={isHour ? "#1e293b" : "#cbd5e1"} strokeWidth={isHour ? 1.5 : 0.5} strokeLinecap="round" />;
      })}

      {Array.from({ length: 12 }).map((_, i) => {
        const h = i === 0 ? 12 : i;
        const angle = (i * 30) * (Math.PI / 180);
        const x = 50 + Math.sin(angle) * 31;
        const y = 50 - Math.cos(angle) * 31;
        return <text key={`h-${i}`} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="9" fill="#ef4444" fontWeight="900" className="select-none pointer-events-none">{h}</text>;
      })}

      {is24Hour && Array.from({ length: 12 }).map((_, i) => {
        const h = i === 0 ? 24 : i + 12;
        const angle = (i * 30) * (Math.PI / 180);
        const x = 50 + Math.sin(angle) * 21;
        const y = 50 - Math.cos(angle) * 21;
        return <text key={`h24-${i}`} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="4.5" fill="#991b1b" opacity="0.8" fontWeight="800" className="select-none pointer-events-none">{h}</text>;
      })}

      {drawHand(hourAngle, 22, 3.5, '#ef4444', 'hour')}
      {drawHand(minuteAngle, 35, 2.5, '#3b82f6', 'minute')}
      {showSeconds && drawHand(secondAngle, 41, 1, '#22c55e', 'second')}
      
      <circle cx="50" cy="50" r="2" fill="#1e293b" className="pointer-events-none" />
      <circle cx="50" cy="50" r="1" fill="#ffffff" className="pointer-events-none" />
    </svg>
  );
}

const TimeColumn = ({ value, unit, colorClass, addTime }: { value: string, unit: 'hour'|'minute'|'second', colorClass: string, addTime: (amount: number, unit: 'hour'|'minute'|'second') => void }) => (
  <div className="flex flex-col items-center">
    <button onClick={() => addTime(1, unit)} className="p-1 sm:p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-400 hover:text-slate-700 active:scale-90 transition-all touch-manipulation mb-1">
      <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />
    </button>
    <div className={cn("text-3xl sm:text-4xl md:text-5xl font-black tabular-nums tracking-tighter leading-none", colorClass)}>
      {value}
    </div>
    <button onClick={() => addTime(-1, unit)} className="p-1 sm:p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-400 hover:text-slate-700 active:scale-90 transition-all touch-manipulation mt-1">
      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />
    </button>
  </div>
);

function DigitalClock({ time, onChangeTime, showSeconds, is24Hour, className }: any) {
  const date = new Date(time);
  
  const addTime = (amount: number, unit: 'hour' | 'minute' | 'second') => {
    onChangeTime((prev: number) => {
      if (unit === 'hour') return prev + amount * 3600000;
      if (unit === 'minute') return prev + amount * 60000;
      if (unit === 'second') return prev + amount * 1000;
      return prev;
    });
  };

  const toggleAmPm = () => {
    onChangeTime((prev: number) => prev + 12 * 3600000);
  };

  let h = date.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  if (!is24Hour) {
    h = h % 12;
    if (h === 0) h = 12;
  }
  const m = date.getMinutes();
  const s = date.getSeconds();

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className={cn("flex items-center justify-center gap-1 sm:gap-2 bg-white/90 backdrop-blur-xl p-2 sm:p-4 rounded-3xl shadow-2xl border-4 border-white/50", className)}>
      <TimeColumn value={is24Hour ? pad(h) : h.toString()} unit="hour" colorClass="text-red-500" addTime={addTime} />
      <div className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-300 pb-1 animate-pulse">:</div>
      <TimeColumn value={pad(m)} unit="minute" colorClass="text-blue-500" addTime={addTime} />
      {showSeconds && (
        <>
          <div className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-300 pb-1 animate-pulse" style={{ animationDelay: '500ms' }}>:</div>
          <TimeColumn value={pad(s)} unit="second" colorClass="text-green-500" addTime={addTime} />
        </>
      )}
      {!is24Hour && (
        <div className="flex flex-col ml-1 sm:ml-2">
          <button 
            onClick={toggleAmPm}
            className="text-xs sm:text-sm md:text-base font-black text-slate-500 hover:text-slate-900 active:scale-95 transition-all bg-slate-100 hover:bg-slate-200 px-2 py-1 sm:px-3 sm:py-2 rounded-xl"
          >
            {ampm}
          </button>
        </div>
      )}
    </div>
  );
}

function DateDisplay({ time, onChangeTime, className }: any) {
  const date = new Date(time);
  
  const addDays = (amount: number) => {
    onChangeTime((prev: number) => prev + amount * 24 * 3600000);
  };

  return (
    <div className={cn("flex items-center justify-between bg-white/90 backdrop-blur-xl px-3 sm:px-5 py-2 sm:py-3 rounded-2xl shadow-xl border-4 border-white/50", className)}>
      <button onClick={() => addDays(-1)} className="p-1 sm:p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-400 hover:text-slate-700 active:scale-90 transition-all touch-manipulation">
        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 rotate-90" strokeWidth={3} />
      </button>
      <div className="text-sm sm:text-base md:text-lg font-black text-slate-700 text-center flex-1 mx-2 whitespace-nowrap">
        {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
      </div>
      <button onClick={() => addDays(1)} className="p-1 sm:p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-400 hover:text-slate-700 active:scale-90 transition-all touch-manipulation">
        <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 rotate-90" strokeWidth={3} />
      </button>
    </div>
  );
}

function Toggle({ label, checked, onChange, color }: any) {
  const colorClasses = {
    red: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
  }[color as 'red'|'green'|'blue'];

  return (
    <label className="flex items-center justify-between cursor-pointer bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
      <span className="font-bold text-slate-700 text-sm select-none">{label}</span>
      <div className={cn("w-10 h-6 rounded-full flex items-center px-1 transition-colors", checked ? colorClasses : "bg-slate-300")}>
        <div className={cn("w-4 h-4 rounded-full bg-white shadow-sm transition-transform", checked ? "translate-x-4" : "translate-x-0")} />
      </div>
      <input type="checkbox" className="hidden" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

function WeatherOverlay({ condition, isDay }: { condition: string, isDay: boolean }) {
  const [rainDrops, setRainDrops] = useState<any[]>([]);
  const [snowFlakes, setSnowFlakes] = useState<any[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRainDrops(Array.from({ length: 50 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `-${Math.random() * 20 + 10}%`,
      animation: `rain ${Math.random() * 0.5 + 0.5}s linear infinite`,
      animationDelay: `${Math.random() * 2}s`
    })));

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSnowFlakes(Array.from({ length: 50 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `-${Math.random() * 20 + 10}%`,
      animation: `snow ${Math.random() * 3 + 2}s linear infinite`,
      animationDelay: `${Math.random() * 5}s`
    })));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {condition === 'clear' && isDay && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-30">
           <div className="w-[800px] h-[800px] bg-yellow-200 rounded-full blur-3xl mix-blend-overlay" style={{ animation: 'spin 60s linear infinite' }} />
        </div>
      )}
      {condition === 'cloudy' && (
        <div className="absolute inset-0 opacity-50">
           <div className="absolute top-10 left-[-20%] w-[40%] h-20 bg-white/40 rounded-full blur-xl" style={{ animation: 'clouds 20s linear infinite' }} />
           <div className="absolute top-40 left-[-40%] w-[60%] h-32 bg-white/30 rounded-full blur-2xl" style={{ animation: 'clouds 35s linear infinite 5s' }} />
        </div>
      )}
      {(condition === 'rain' || condition === 'thunderstorm') && (
        <div className="absolute inset-0">
           {rainDrops.map((style, i) => (
             <div 
               key={i} 
               className="absolute bg-blue-400/60 w-0.5 h-10 rounded-full"
               style={style}
             />
           ))}
        </div>
      )}
      {condition === 'thunderstorm' && (
        <div className="absolute inset-0 bg-white/0" style={{ animation: 'lightning 5s ease-out infinite' }} />
      )}
      {condition === 'snow' && (
        <div className="absolute inset-0">
           {snowFlakes.map((style, i) => (
             <div 
               key={i} 
               className="absolute bg-white/80 w-2 h-2 rounded-full blur-[1px]"
               style={style}
             />
           ))}
        </div>
      )}
    </div>
  );
}

const AUDIO_URLS = {
  rain: 'https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3',
  thunder: 'https://assets.mixkit.co/active_storage/sfx/2390/2390-preview.mp3',
  sunny: 'https://assets.mixkit.co/active_storage/sfx/17/17-preview.mp3',
  snow: 'https://assets.mixkit.co/active_storage/sfx/2608/2608-preview.mp3',
  rooster: 'https://assets.mixkit.co/active_storage/sfx/2462/2462-preview.mp3',
  night: 'https://assets.mixkit.co/active_storage/sfx/39/39-preview.mp3'
};

export default function TimeExplorerApp() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeOffset, setTimeOffset] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  const [is24Hour, setIs24Hour] = useState(false);
  const [showSeconds, setShowSeconds] = useState(true);
  const [showDate, setShowDate] = useState(true);

  const [stars, setStars] = useState<any[]>([]);

  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherCondition, setWeatherCondition] = useState<string>('clear');
  const [locationName, setLocationName] = useState<string>('Local');
  const [timezone, setTimezone] = useState<string>('UTC');

  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const roosterRef = useRef<HTMLAudioElement>(null);
  const cricketRef = useRef<HTMLAudioElement>(null);
  const prevIsDay = useRef<boolean | null>(null);

  // Initial time sync
  useEffect(() => {
    const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!mounted) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimezone(localTz);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMounted(true);
      const now = new Date();
      const tzDateStr = now.toLocaleString('en-US', { 
        timeZone: localTz,
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false
      });
      const tzDate = new Date(tzDateStr);
      setTime(tzDate.getTime() + now.getMilliseconds());
    }
    
    setStars(Array.from({ length: 30 }).map(() => ({
      width: Math.random() * 5 + 2 + 'px',
      height: Math.random() * 5 + 2 + 'px',
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      animationDuration: Math.random() * 4 + 2 + 's',
      animationDelay: Math.random() * 2 + 's',
      opacity: Math.random() * 0.6 + 0.2
    })));

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`);
          const data = await res.json();
          setWeatherData(data.current_weather);
          if (data.timezone) {
            setTimezone(data.timezone);
            setLocationName(data.timezone.split('/').pop().replace('_', ' '));
          }
          
          const code = data.current_weather.weathercode;
          let condition = 'clear';
          if (code >= 1 && code <= 3) condition = 'cloudy';
          if ((code >= 51 && code <= 65) || (code >= 80 && code <= 82)) condition = 'rain';
          if (code >= 71 && code <= 77) condition = 'snow';
          if (code >= 95 && code <= 99) condition = 'thunderstorm';
          setWeatherCondition(condition);
          
        } catch (e) {
          console.error("Failed to fetch weather", e);
        }
      }, (error) => {
        console.warn("Geolocation not available or denied. Using default location.");
      });
    }
  }, []);

  useEffect(() => {
    if (!isPlaying || !mounted) return;
    let frameId: number;
    const update = () => {
      const now = new Date();
      const tzDateStr = now.toLocaleString('en-US', { 
        timeZone: timezone,
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false
      });
      const tzDate = new Date(tzDateStr);
      const realTimeInTz = tzDate.getTime() + now.getMilliseconds();
      setTime(realTimeInTz + timeOffset);
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, mounted, timezone, timeOffset]);

  const handleTimeChange = (newTime: number | ((prev: number) => number)) => {
    setIsPlaying(false);
    setTime(prev => {
      const nextTime = typeof newTime === 'function' ? newTime(prev) : newTime;
      return nextTime;
    });
  };

  const togglePlay = () => {
    if (!isPlaying) {
      const now = new Date();
      const tzDateStr = now.toLocaleString('en-US', { 
        timeZone: timezone,
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false
      });
      const tzDate = new Date(tzDateStr);
      const realTimeInTz = tzDate.getTime() + now.getMilliseconds();
      setTimeOffset(time - realTimeInTz);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const syncToNow = () => {
    setTimeOffset(0);
    setIsPlaying(true);
  };

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

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = isMuted;
    if (roosterRef.current) roosterRef.current.muted = isMuted;
    if (cricketRef.current) cricketRef.current.muted = isMuted;
    
    if (!isMuted) {
       audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    } else {
       audioRef.current.pause();
    }
  }, [isMuted, currentAudioUrl]);

  useEffect(() => {
    if (prevIsDay.current !== null && prevIsDay.current !== isDay) {
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
    prevIsDay.current = isDay;
  }, [isDay]);

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
    <main className="h-[100dvh] w-full flex justify-center bg-black overflow-hidden">
      
      {/* Orientation Locks */}
      <div className="fixed inset-0 z-[100] bg-slate-900 text-white flex-col items-center justify-center hidden [@media(max-width:767px)_and_(orientation:landscape)]:flex">
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
            <div className="flex items-center gap-1.5 bg-white/30 backdrop-blur-md px-3 py-2 rounded-xl shadow-sm border border-white/20">
              <MapPin className="w-4 h-4 text-slate-700" />
              <span className="text-sm font-bold text-slate-800">{locationName}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 pointer-events-auto">
            <button 
              onClick={() => setShowSettings(true)}
              className="p-3 bg-white/30 backdrop-blur-md rounded-full shadow-sm border border-white/20 text-slate-800 hover:bg-white/50 transition-colors"
            >
              <Settings className="w-6 h-6" />
            </button>
            <button 
              onClick={togglePlay}
              className={cn(
                "p-3 rounded-full shadow-sm border-2 transition-colors",
                isPlaying 
                  ? "bg-amber-100/80 border-amber-300 text-amber-700 hover:bg-amber-200" 
                  : "bg-green-100/80 border-green-300 text-green-700 hover:bg-green-200"
              )}
            >
              {isPlaying ? <Pause className="w-6 h-6" fill="currentColor" /> : <Play className="w-6 h-6" fill="currentColor" />}
            </button>
            {timeOffset !== 0 && (
              <button 
                onClick={syncToNow}
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
                time={time} 
                onChangeTime={handleTimeChange} 
                showSeconds={showSeconds} 
                is24Hour={is24Hour} 
              />
            </div>
          </div>

          {/* Bottom Area: Digital Clock, Date, Weather */}
          <div className="w-full max-w-3xl mx-auto flex flex-col md:flex-row items-stretch justify-center gap-3 sm:gap-6 shrink-0 mt-2 md:mt-0">
            
            <DigitalClock 
              time={time} 
              onChangeTime={handleTimeChange} 
              showSeconds={showSeconds} 
              is24Hour={is24Hour}
              className="w-full md:w-1/2 md:flex-1"
            />

            <div className="w-full md:w-1/2 md:flex-1 flex flex-col gap-3 shrink-0">
              {showDate && (
                <DateDisplay 
                  time={time} 
                  onChangeTime={handleTimeChange}
                  className="w-full flex-1"
                />
              )}
              
              <div className="flex items-center justify-between gap-3 sm:gap-4 bg-white/40 backdrop-blur-xl px-4 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-lg border-2 border-white/40 whitespace-nowrap w-full flex-1">
                <div className="flex items-center gap-2">
                  {isDay ? <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 drop-shadow-md" fill="currentColor" /> : <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 drop-shadow-md" fill="currentColor" />}
                  <span className="text-sm sm:text-base font-black tracking-tight text-slate-800">{isDay ? 'Day Time' : 'Night Time'}</span>
                </div>
                {isCurrentDate && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-black text-blue-600 capitalize">{weatherCondition}</span>
                    {weatherData && <span className="text-sm sm:text-base font-bold text-slate-700">{weatherData.temperature}°C</span>}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Settings Overlay */}
        {showSettings && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-200">
            <div className="bg-white rounded-t-3xl p-6 flex flex-col gap-6 animate-in slide-in-from-bottom-full duration-300 text-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-800">Settings</h2>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {/* Sound Controls */}
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

                {/* Soundboard Controls */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Soundboard</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(AUDIO_URLS).map(([key, url]) => (
                      <button
                        key={key}
                        onClick={() => {
                          const audio = new Audio(url);
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

                {/* Display Controls */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Display</h3>
                  <div className="flex flex-col gap-2">
                    <Toggle label="24-Hour Time" checked={is24Hour} onChange={setIs24Hour} color="red" />
                    <Toggle label="Show Seconds" checked={showSeconds} onChange={setShowSeconds} color="green" />
                    <Toggle label="Show Date" checked={showDate} onChange={setShowDate} color="blue" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
