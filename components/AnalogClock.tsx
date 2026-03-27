import React, { useState, useEffect, useRef } from 'react';

const getSvgPoint = (e: React.PointerEvent | PointerEvent, svg: SVGSVGElement) => {
  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  return pt.matrixTransform(svg.getScreenCTM()!.inverse());
};

interface AnalogClockProps {
  time: number;
  onChangeTime: (updater: number | ((prev: number) => number)) => void;
  showSeconds: boolean;
  is24Hour: boolean;
  isPlaying: boolean;
  fullSecondsCircle: boolean;
  isTimerMode: boolean;
  timerValue: number;
  alternateMode: boolean;
}

/** SVG analog clock with draggable hands and 12/24-hour display. */
export function AnalogClock({ time, onChangeTime, showSeconds, is24Hour, isPlaying, fullSecondsCircle, isTimerMode, timerValue, alternateMode }: AnalogClockProps) {
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
      if (activeHand) {
        onChangeTime((prev: number) => {
          const d = new Date(prev);
          d.setMilliseconds(0);
          return d.getTime();
        });
      }
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
  const s = activeHand === 'second' ? date.getSeconds() + ms / 1000 : date.getSeconds();
  const m = activeHand === 'minute' ? date.getMinutes() + date.getSeconds() / 60 + ms / 60000 : date.getMinutes() + s / 60;
  const h = activeHand === 'hour' ? date.getHours() % 12 + date.getMinutes() / 60 + date.getSeconds() / 3600 + ms / 3600000 : date.getHours() % 12 + m / 60;

  // Ensure second hand points exactly to 0 when seconds are 0
  const secondAngle = s === 60 || s === 0 ? 0 : s * 6;
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
    <svg aria-hidden="true" ref={svgRef} viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl bg-white rounded-full" style={{ touchAction: 'none' }}>
      <defs>
        <linearGradient id="minSecGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="49" fill="none" stroke="#f8fafc" strokeWidth="2" />
      <circle cx="50" cy="50" r="48" fill="#ffffff" />
      
      {fullSecondsCircle ? (
        Array.from({ length: 60 }).map((_, i) => {
          const m = i === 0 ? (alternateMode && !isTimerMode ? 60 : 0) : i;
          const angle = (i * 6) * (Math.PI / 180);
          const x = 50 + Math.sin(angle) * 45;
          const y = 50 - Math.cos(angle) * 45;
          const isFive = i % 5 === 0;
          return <text key={`m-${i}`} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={isFive ? "3" : "2"} fill="url(#minSecGradient)" fontWeight={isFive ? "900" : "600"} className="select-none pointer-events-none">{m === 0 ? '00' : m}</text>;
        })
      ) : (
        Array.from({ length: 12 }).map((_, i) => {
          const m = i === 0 ? (alternateMode && !isTimerMode ? 60 : 0) : i * 5;
          const angle = (i * 30) * (Math.PI / 180);
          const x = 50 + Math.sin(angle) * 45;
          const y = 50 - Math.cos(angle) * 45;
          return <text key={`m-${i}`} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="4" fill="url(#minSecGradient)" fontWeight="900" className="select-none pointer-events-none">{m === 0 ? '00' : m}</text>;
        })
      )}

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
        return <text key={`h-${i}`} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="9" fill="#22c55e" fontWeight="900" className="select-none pointer-events-none">{h}</text>;
      })}

      {is24Hour && Array.from({ length: 12 }).map((_, i) => {
        const h = i === 0 ? 24 : i + 12;
        const angle = (i * 30) * (Math.PI / 180);
        const x = 50 + Math.sin(angle) * 21;
        const y = 50 - Math.cos(angle) * 21;
        return <text key={`h24-${i}`} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="4.5" fill="#166534" opacity="0.8" fontWeight="800" className="select-none pointer-events-none">{h}</text>;
      })}

      {drawHand(hourAngle, 22, 3.5, (is24Hour && date.getHours() > 12) ? '#166534' : '#22c55e', 'hour')}
      {drawHand(minuteAngle, 35, 2.5, '#ef4444', 'minute')}
      {showSeconds && drawHand(secondAngle, 41, 1, '#3b82f6', 'second')}
      
      <circle cx="50" cy="50" r="2" fill="#1e293b" className="pointer-events-none" />
      <circle cx="50" cy="50" r="1" fill="#ffffff" className="pointer-events-none" />
      
      {!isPlaying && (
        <g className="pointer-events-none" transform="translate(50, 75)">
          <rect x="-18" y="-6" width="36" height="12" rx="6" fill="rgba(255,255,255,0.8)" />
          <text x="0" y="2.5" fontSize="6" fontWeight="900" fontFamily="sans-serif" fill="#94a3b8" textAnchor="middle" letterSpacing="0.5">
            {isTimerMode ? (timerValue === 0 ? "TIMER" : "PAUSED") : "PAUSED"}
          </text>
        </g>
      )}
    </svg>
  );
}
