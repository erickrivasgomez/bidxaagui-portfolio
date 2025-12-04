import { useState, useRef, useCallback, useEffect, RefObject } from 'react';

export const useFocus = <T extends HTMLElement>(): [RefObject<T | null>, boolean] => {
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<T | null>(null);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener('focus', handleFocus);
      node.addEventListener('blur', handleBlur);

      return () => {
        node.removeEventListener('focus', handleFocus);
        node.removeEventListener('blur', handleBlur);
      };
    }
  }, [handleFocus, handleBlur]);

  return [ref, isFocused];
};
