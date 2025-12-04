import { useState, useEffect, useRef, RefObject } from 'react';

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  freezeOnceVisible?: boolean;
}

export const useIntersectionObserver = (
  options: IntersectionObserverOptions = {}
): [RefObject<HTMLElement | null>, boolean] => {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const targetRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const {
      root = null,
      rootMargin = '0px',
      threshold = 0,
      freezeOnceVisible = false,
    } = options;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      setIsIntersecting(entry.isIntersecting);

      if (entry.isIntersecting && freezeOnceVisible && observerRef.current) {
        observerRef.current.disconnect();
      }
    };

    observerRef.current = new IntersectionObserver(observerCallback, {
      root,
      rootMargin,
      threshold,
    });

    observerRef.current.observe(target);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [options]);

  return [targetRef, isIntersecting];
};
