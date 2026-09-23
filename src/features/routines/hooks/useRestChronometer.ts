import { useEffect, useState } from 'react';
import { formatDuration } from '@/utils/format';

export function useRestChronometer() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [targetRestSeconds, setTargetRestSeconds] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  function startChronometer(restSeconds: number) {
    setTargetRestSeconds(Math.max(0, restSeconds));
    setElapsedSeconds(0);
    setIsRunning(true);
  }

  function stopChronometer() {
    setIsRunning(false);
    setElapsedSeconds(0);
    setTargetRestSeconds(0);
  }

  const isOverTarget = isRunning && targetRestSeconds > 0 && elapsedSeconds >= targetRestSeconds;

  return {
    isRunning,
    elapsedSeconds,
    targetRestSeconds,
    isOverTarget,
    formatted: formatDuration(elapsedSeconds),
    startChronometer,
    stopChronometer,
  };
}
