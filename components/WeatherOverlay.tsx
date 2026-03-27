import React, { useState, useEffect } from 'react';

export function WeatherOverlay({ condition, isDay }: { condition: string, isDay: boolean }) {
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
