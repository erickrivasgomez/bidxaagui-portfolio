// src/hooks/useSearch.ts
import { useState, useMemo } from 'react';

interface UseSearchProps<T> {
  data: T[];
  searchKeys: (keyof T)[];
  initialQuery?: string;
}

export const useSearch = <T,>({
  data,
  searchKeys,
  initialQuery = '',
}: UseSearchProps<T>) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    const query = searchQuery.toLowerCase();
    return data.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key];
        return (
          value !== null &&
          value !== undefined &&
          String(value).toLowerCase().includes(query)
        );
      })
    );
  }, [data, searchQuery, searchKeys]);

  return {
    searchQuery,
    setSearchQuery,
    filteredData,
  };
};