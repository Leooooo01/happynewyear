
import React, { useState, useEffect } from 'react';
import { TimeLeft } from '../types';

interface Props {
  targetDate: Date;
}

const CountdownDisplay: React.FC<Props> = ({ targetDate }) => {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +targetDate - +new Date();
    let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center justify-center w-24 h-24 sm:w-36 sm:h-36 glass rounded-[24px] shadow-lg border-b-4 border-yellow-500/20 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(250,204,21,0.25)] hover:border-yellow-500/40 cursor-default group">
      <span className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-white drop-shadow-sm leading-none transition-colors group-hover:from-white group-hover:to-yellow-200">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-xs sm:text-base tracking-widest text-yellow-100/80 mt-2 font-bold uppercase transition-opacity group-hover:opacity-100">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex flex-row flex-wrap justify-center items-center gap-3 sm:gap-6 px-2">
      <TimeUnit value={timeLeft.days} label="天" />
      <TimeUnit value={timeLeft.hours} label="时" />
      <TimeUnit value={timeLeft.minutes} label="分" />
      <TimeUnit value={timeLeft.seconds} label="秒" />
    </div>
  );
};

export default CountdownDisplay;
