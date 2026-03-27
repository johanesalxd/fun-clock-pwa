import { useState, useEffect, useCallback } from 'react';

export function useClock(timezone: string) {
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeOffset, setTimeOffset] = useState(0);

  // Initial time sync
  useEffect(() => {
    if (!timezone) return;
    const now = new Date();
    const tzDateStr = now.toLocaleString('en-US', { 
      timeZone: timezone,
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false
    });
    const tzDate = new Date(tzDateStr);
    setTime(tzDate.getTime() + now.getMilliseconds() + timeOffset);
  }, [timezone, timeOffset]);

  useEffect(() => {
    if (!isPlaying || !timezone) return;
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
  }, [isPlaying, timezone, timeOffset]);

  const handleTimeChange = useCallback((newTime: number | ((prev: number) => number)) => {
    setIsPlaying(false);
    setTime(prev => {
      const nextTime = typeof newTime === 'function' ? newTime(prev) : newTime;
      const now = new Date();
      const tzDateStr = now.toLocaleString('en-US', {
        timeZone: timezone,
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false
      });
      const tzDate = new Date(tzDateStr);
      const realTimeInTz = tzDate.getTime() + now.getMilliseconds();
      setTimeOffset(nextTime - realTimeInTz);
      return nextTime;
    });
  }, [timezone]);

  const togglePlay = useCallback(() => {
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
  }, [isPlaying, time, timezone]);

  const syncToNow = useCallback(() => {
    setTimeOffset(0);
    setIsPlaying(true);
  }, []);

  return {
    time,
    isPlaying,
    setIsPlaying,
    timeOffset,
    handleTimeChange,
    togglePlay,
    syncToNow
  };
}
