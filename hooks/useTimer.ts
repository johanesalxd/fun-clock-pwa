import { useState, useEffect, useRef, useCallback } from 'react';

/** Manages countdown timer state: start, pause, reset, and alarm triggering. */
export function useTimer(playAlarmSound: () => void, stopAlarm: () => void) {
  const [timerValue, setTimerValue] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerEndTime, setTimerEndTime] = useState<number | null>(null);
  // Tracks the pending retry listener registered when the timer fires while
  // the tab is hidden. Stored in a ref so it survives the React state
  // transitions that occur when isTimerRunning becomes false on completion.
  const alarmRetryListenerRef = useRef<(() => void) | null>(null);

  // cancelRetryListener removes the pending alarm-retry visibilitychange
  // listener. Called explicitly from resetTimer and handleTimerChange (user
  // cancellation paths) rather than from a useEffect, which would race against
  // the retry firing when the user returns to the tab after the timer fires.
  const cancelRetryListener = useCallback(() => {
    if (alarmRetryListenerRef.current) {
      document.removeEventListener('visibilitychange', alarmRetryListenerRef.current);
      alarmRetryListenerRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    cancelRetryListener();
    setIsTimerRunning(false);
    setTimerEndTime(null);
    setTimerValue(0);
    stopAlarm();
  }, [cancelRetryListener, stopAlarm]);

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
    cancelRetryListener();
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
  }, [cancelRetryListener, stopAlarm]);

  useEffect(() => {
    if (isTimerRunning && timerEndTime) {
      const fireAlarm = () => {
        setIsTimerRunning(false);
        setTimerEndTime(null);

        if (document.visibilityState !== 'visible') {
          // Tab is in the background: audio will almost certainly be blocked.
          // Register a one-shot listener that retries playAlarmSound when the
          // user returns, instead of relying on the interval-cleanup path.
          const retryOnReturn = () => {
            // Guard: only retry when the tab is actually becoming visible.
            // A hidden->hidden transition (e.g. switching between background
            // tabs) would otherwise consume the one-shot listener uselessly.
            if (document.visibilityState !== 'visible') return;
            document.removeEventListener('visibilitychange', retryOnReturn);
            alarmRetryListenerRef.current = null;
            playAlarmSound();
          };
          alarmRetryListenerRef.current = retryOnReturn;
          document.addEventListener('visibilitychange', retryOnReturn);
        }

        // Always attempt to play — works immediately if tab is visible,
        // and the oscillator fallback handles the autoplay-blocked case.
        playAlarmSound();
      };

      const checkTimer = () => {
        const remaining = Math.max(0, timerEndTime - Date.now());
        setTimerValue(remaining);
        if (remaining === 0) {
          fireAlarm();
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
