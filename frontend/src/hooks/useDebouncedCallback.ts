// src/hooks/useDebouncedCallback.ts
import { useCallback, useEffect, useRef } from "react";

export const useDebouncedCallback = <A extends unknown[]>(
  fn: (...args: A) => void,
  delay = 300
) => {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  return useCallback(
    (...args: A) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  );
}