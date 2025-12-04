import { useState, useCallback } from 'react';

interface UseCounterOptions {
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
}

export const useCounter = (options: UseCounterOptions = {}) => {
  const {
    initialValue = 0,
    min = -Infinity,
    max = Infinity,
    step = 1,
  } = options;

  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount((prev) => Math.min(prev + step, max));
  }, [max, step]);

  const decrement = useCallback(() => {
    setCount((prev) => Math.max(prev - step, min));
  }, [min, step]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const setValue = useCallback(
    (value: number) => {
      setCount(Math.min(Math.max(value, min), max));
    },
    [max, min]
  );

  return {
    count,
    increment,
    decrement,
    reset,
    setValue,
    isMin: count <= min,
    isMax: count >= max,
  };
};
