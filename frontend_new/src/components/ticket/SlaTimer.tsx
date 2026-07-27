'use client';
import React, { useEffect, useState } from 'react';

interface SlaTimerProps {
  targetDate: string;
}

export default function SlaTimer({ targetDate }: SlaTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>('00:00:00');
  const [isOverdue, setIsOverdue] = useState<boolean>(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft('OVERDUE');
        setIsOverdue(true);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (n: number) => n.toString().padStart(2, '0');
      setTimeLeft(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <span className={`text-xs font-black tracking-widest ${
      isOverdue ? 'text-rose-500 animate-pulse' : 'text-slate-350'
    }`}>
      ⏱️ {timeLeft}
    </span>
  );
}
