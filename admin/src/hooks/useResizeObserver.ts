import { useState, useRef, useEffect, RefObject } from 'react';

interface ResizeObserverEntry {
  contentRect: DOMRectReadOnly;
  target: Element;
}

type ResizeObserverCallback = (entries: ResizeObserverEntry[]) => void;

export const useResizeObserver = <T extends HTMLElement>(
  callback: ResizeObserverCallback
): RefObject<T | null> => {
  const [node, setNode] = useState<T | null>(null);
  const observer = useRef<ResizeObserver | null>(null);
  const ref = useRef<T>(null);

  useEffect(() => {
    setNode(ref.current);
  }, []);

  useEffect(() => {
    if (node) {
      observer.current = new ResizeObserver((entries) => {
        callback(entries as unknown as ResizeObserverEntry[]);
      });

      observer.current.observe(node);

      return () => {
        if (observer.current) {
          observer.current.disconnect();
        }
      };
    }
  }, [node, callback]);

  return ref;
};
