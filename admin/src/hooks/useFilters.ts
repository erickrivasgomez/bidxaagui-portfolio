// src/hooks/useFilters.ts
import { useState, useMemo } from 'react';

type FilterFunction<T> = (item: T) => boolean;

interface UseFiltersProps<T> {
  data: T[];
  initialFilters?: FilterFunction<T>[];
}

export const useFilters = <T,>({
  data,
  initialFilters = [],
}: UseFiltersProps<T>) => {
  const [filters, setFilters] = useState<FilterFunction<T>[]>(initialFilters);

  const filteredData = useMemo(() => {
    if (filters.length === 0) return data;
    return data.filter((item) => filters.every((filter) => filter(item)));
  }, [data, filters]);

  const addFilter = (filter: FilterFunction<T>) => {
    setFilters((prev) => [...prev, filter]);
  };

  const removeFilter = (filterToRemove: FilterFunction<T>) => {
    setFilters((prev) => prev.filter((filter) => filter !== filterToRemove));
  };

  const clearFilters = () => {
    setFilters([]);
  };

  return {
    filteredData,
    filters,
    addFilter,
    removeFilter,
    clearFilters,
  };
};