import { useEffect } from 'react';

type KeyPressHandler = (event: KeyboardEvent) => void;

export const useKeyPress = (
  targetKey: string,
  handler: KeyPressHandler,
  dependencies: any[] = []
) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        handler(event);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [targetKey, handler, ...dependencies]);
};
