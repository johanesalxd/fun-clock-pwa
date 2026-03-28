import { useState, useEffect, useCallback } from 'react';

/** Manages countdown timer state: start, pause, reset, and alarm triggering. */
export function useTimer(playAlarmSound: () => void, stopAlarm: () => void) {
  const [timerValue, setTimerValue] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerEndTime, setTimerEndTime] = useState<number | null>(null);

  const resetTimer = useCallback(() => {
    setIsTimerRunning(false);
    setTimerEndTime(null);
    setTimerValue(0);
    stopAlarm();
  }, [stopAlarm]);

  const toggleTimer = useCallback(() => {
    if (isTimerRunning) {
      if (timerEndTime) {
        const remaining = Math.max(0, timerEndTime - Date.now());
        setTimerValue(remaining);
      }
      setTimerEndTime(null);
      setIsTimerRunning(false);
    } else {
      if (timerValue > 0) {
        setTimerEndTime(Date.now() + timerValue);
        setIsTimerRunning(true);
      }
    }
  }, [isTimerRunning, timerEndTime, timerValue]);

  const getTimerDisplayDate = useCallback(() => {
    const d = new Date();
    d.setHours(
      Math.floor(timerValue / 3600000),
      Math.floor((timerValue % 3600000) / 60000),
      Math.floor((timerValue % 60000) / 1000),
      Math.floor(timerValue % 1000)
    );
    return d.getTime();
  }, [timerValue]);

  const handleTimerChange = useCallback((updater: number | ((prev: number) => number)) => {
    stopAlarm();
    setIsTimerRunning(false);
    setTimerEndTime(null);
    
    setTimerValue(prev => {
      const baseDate = new Date();
      baseDate.setHours(
        Math.floor(prev / 3600000),
        Math.floor((prev % 3600000) / 60000),
        Math.floor((prev % 60000) / 1000),
        Math.floor(prev % 1000)
      );
      const prevTime = baseDate.getTime();
      const nextTime = typeof updater === 'function' ? updater(prevTime) : updater;
      
      // Use delta from prevTime rather than (nextDate - zeroDate).
      // zeroDate subtraction breaks when setHours(24) wraps baseDate to the
      // next calendar day, causing nextDate to land on a different day than
      // zeroDate and producing a negative or wrong duration.
      let newTimerValue = prev + (nextTime - prevTime);
      if (newTimerValue < 0) newTimerValue = 0;
      if (newTimerValue > 86400000) newTimerValue = 86400000;
      
      return newTimerValue;
    });
  }, [stopAlarm]);

  useEffect(() => {
    if (isTimerRunning && timerEndTime) {
      const checkTimer = () => {
        const remaining = Math.max(0, timerEndTime - Date.now());
        setTimerValue(remaining);
        if (remaining === 0) {
          setIsTimerRunning(false);
          setTimerEndTime(null);
          playAlarmSound();
        }
      };

      const interval = setInterval(checkTimer, 50);

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          checkTimer();
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        clearInterval(interval);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [isTimerRunning, timerEndTime, playAlarmSound]);

  return {
    timerValue,
    isTimerRunning,
    resetTimer,
    toggleTimer,
    getTimerDisplayDate,
    handleTimerChange
  };
}
