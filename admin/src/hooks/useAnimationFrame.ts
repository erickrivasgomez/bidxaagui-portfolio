import { useEffect, useRef } from 'react';

type Callback = (deltaTime: number) => void;

export const useAnimationFrame = (callback: Callback, isActive = true) => {
  const savedCallback = useRef<Callback | null>(null);
  const previousTime = useRef<number>(0);
const requestRef = useRef<number>(0);
  const frameCount = useRef<number>(0);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const animate = (time: number) => {
    if (previousTime.current !== undefined && savedCallback.current) {
      const deltaTime = time - previousTime.current;
      frameCount.current += 1;
      savedCallback.current(deltaTime);
    }
    previousTime.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isActive) {
      requestRef.current = requestAnimationFrame(animate);
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }
  }, [isActive]);

  return frameCount.current;
};
