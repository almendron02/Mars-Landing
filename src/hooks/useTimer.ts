import { useState, useEffect, useRef } from 'react';

export function useTimer(isActive: boolean, initialTime: number = 0) {
  const [elapsedTime, setElapsedTime] = useState(initialTime);
  const callbackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let intervalId: number | null = null;

    if (isActive) {
      intervalId = window.setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [isActive]);

  const resetTimer = (newVal: number = 0) => {
    setElapsedTime(newVal);
  };

  return {
    elapsedTime,
    setElapsedTime,
    resetTimer
  };
}
