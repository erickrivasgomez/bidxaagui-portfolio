// src/hooks/useKeyboardShortcut.ts
import { useEffect, useCallback } from 'react';

type KeyMap = {
  [key: string]: (e: KeyboardEvent) => void;
};

export const useKeyboardShortcut = (keyMap: KeyMap) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const handler = keyMap[e.key];
      if (handler) {
        e.preventDefault();
        handler(e);
      }
    },
    [keyMap]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};