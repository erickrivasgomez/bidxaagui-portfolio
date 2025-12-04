import { useState, useCallback } from 'react';

export const useArray = <T,>(initialArray: T[] = []) => {
  const [array, setArray] = useState<T[]>(initialArray);

  const push = useCallback((element: T) => {
    setArray((prev) => [...prev, element]);
  }, []);

  const filter = useCallback((callback: (element: T) => boolean) => {
    setArray((prev) => prev.filter(callback));
  }, []);

  const update = useCallback((index: number, newElement: T) => {
    setArray((prev) => [
      ...prev.slice(0, index),
      newElement,
      ...prev.slice(index + 1, prev.length),
    ]);
  }, []);

  const remove = useCallback((index: number) => {
    setArray((prev) => [
      ...prev.slice(0, index),
      ...prev.slice(index + 1, prev.length),
    ]);
  }, []);

  const clear = useCallback(() => {
    setArray([]);
  }, []);

  const set = useCallback((newArray: T[]) => {
    setArray(newArray);
  }, []);

  return { array, set, push, filter, update, remove, clear };
};
