import { useState, useEffect, useRef, MutableRefObject } from 'react';

interface MutationObserverOptions {
  attributes?: boolean;
  childList?: boolean;
  subtree?: boolean;
  characterData?: boolean;
  attributeOldValue?: boolean;
  characterDataOldValue?: boolean;
  attributeFilter?: string[];
}

export const useMutationObserver = <T extends HTMLElement>(
  callback: MutationCallback,
  options: MutationObserverOptions = {
    attributes: true,
    childList: true,
    subtree: true,
  }
): MutableRefObject<T | null> => {
  const [node, setNode] = useState<T | null>(null);
  const observer = useRef<MutationObserver | null>(null);

  const ref = useRef<T>(null);

  useEffect(() => {
    setNode(ref.current);
  }, []);

  useEffect(() => {
    if (node) {
      observer.current = new MutationObserver(callback);
      observer.current.observe(node, options);

      return () => {
        if (observer.current) {
          observer.current.disconnect();
        }
      };
    }
  }, [node, callback, options]);

  return ref;
};
