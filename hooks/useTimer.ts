import { useState, useEffect, useCallback, useRef } from 'react';

export function useTimer(playAlarmSound: () => void, stopAlarm: () => void) {
  const [appMode, setAppMode] = useState<'clock' | 'timer'>('clock');
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
      
      const nextDate = new Date(nextTime);
      const zeroDate = new Date(baseDate);
      zeroDate.setHours(0, 0, 0, 0);
      
      let newTimerValue = nextDate.getTime() - zeroDate.getTime();
      if (newTimerValue < 0) newTimerValue = 0;
      if (newTimerValue > 86399000) newTimerValue = 86399000;
      
      return newTimerValue;
    });
  }, [stopAlarm]);

  useEffect(() => {
    if (appMode === 'timer' && isTimerRunning && timerEndTime) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, timerEndTime - Date.now());
        setTimerValue(remaining);
        if (remaining === 0) {
          setIsTimerRunning(false);
          setTimerEndTime(null);
          playAlarmSound();
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [appMode, isTimerRunning, timerEndTime, playAlarmSound]);

  return {
    appMode,
    setAppMode,
    timerValue,
    isTimerRunning,
    resetTimer,
    toggleTimer,
    getTimerDisplayDate,
    handleTimerChange
  };
}
