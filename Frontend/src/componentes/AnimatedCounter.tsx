import { useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 2000,
  suffix = '',
  className = '',
}) => {
  const countRef = useRef<HTMLSpanElement>(null);
  const prevEndRef = useRef<number>(0);

  useEffect(() => {
    if (!countRef.current || end === 0) return;

 
    if (prevEndRef.current === end) return;

    const element = countRef.current;
    const start = prevEndRef.current;
    const increment = (end - start) / (duration / 16); // 60 FPS
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        element.textContent = end.toLocaleString() + suffix;
        clearInterval(timer);
        prevEndRef.current = end;
      } else {
        element.textContent = Math.floor(current).toLocaleString() + suffix;
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration, suffix]);

  return <span ref={countRef} className={className}>0{suffix}</span>;
};
