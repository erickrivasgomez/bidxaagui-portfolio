// src/hooks/useInfiniteScroll.ts
import { useState, useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollProps {
  hasMore: boolean;
  loadMore: () => void;
  threshold?: number;
}

export const useInfiniteScroll = ({
  hasMore,
  loadMore,
  threshold = 100,
}: UseInfiniteScrollProps) => {
  const [isFetching, setIsFetching] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isFetching) {
        setIsFetching(true);
        loadMore();
      }
    },
    [hasMore, isFetching, loadMore]
  );

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: `${threshold}px`,
      threshold: 0,
    };

    observer.current = new IntersectionObserver(handleObserver, options);

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [handleObserver, threshold]);

  useEffect(() => {
    if (!isFetching) return;
    setIsFetching(false);
  }, [isFetching]);

  return { loadMoreRef, isFetching };
};