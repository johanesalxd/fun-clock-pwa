import { useState, useEffect, useCallback } from 'react';

function getTimezoneTimeMs(timezone: string): number {
  const now = new Date();
  const tzDateStr = now.toLocaleString('en-US', {
    timeZone: timezone,
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false,
  });
  return new Date(tzDateStr).getTime() + now.getMilliseconds();
}

/** Manages real-time clock state with timezone support and manual time offset. */
export function useClock(timezone: string) {
  const [time, setTime] = useState(() => {
    if (timezone) {
      return getTimezoneTimeMs(timezone);
    }
    return 0;
  });
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeOffset, setTimeOffset] = useState(0);

  useEffect(() => {
    if (!isPlaying || !timezone) return;
    let frameId: number;
    const update = () => {
      setTime(getTimezoneTimeMs(timezone) + timeOffset);
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, timezone, timeOffset]);

  const handleTimeChange = useCallback((newTime: number | ((prev: number) => number)) => {
    setIsPlaying(false);
    setTime(prev => {
      const nextTime = typeof newTime === 'function' ? newTime(prev) : newTime;
      setTimeOffset(nextTime - getTimezoneTimeMs(timezone));
      return nextTime;
    });
  }, [timezone]);

  const togglePlay = useCallback(() => {
    if (!isPlaying) {
      setTimeOffset(time - getTimezoneTimeMs(timezone));
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
