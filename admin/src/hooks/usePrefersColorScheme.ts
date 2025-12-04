import { useState, useEffect } from 'react';

type ColorScheme = 'light' | 'dark' | 'no-preference';

export const usePrefersColorScheme = (): ColorScheme => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('no-preference');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setColorScheme(e.matches ? 'dark' : 'light');
    };

    // Set the initial value
    setColorScheme(mediaQuery.matches ? 'dark' : 'light');

    // Add listener for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return colorScheme;
};
