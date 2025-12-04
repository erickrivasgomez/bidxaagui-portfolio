// src/hooks/useApi.ts
import { useState, useCallback } from 'react';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

interface ApiRequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
}

export const useApi = <T>() => {
  const [response, setResponse] = useState<ApiResponse<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const request = useCallback(
    async (url: string, options: ApiRequestOptions = {}) => {
      const { method = 'GET', headers = {}, body } = options;

      setResponse((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const config: RequestInit = {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
        };

        if (body && method !== 'GET') {
          config.body = JSON.stringify(body);
        }

        const res = await fetch(url, config);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Something went wrong');
        }

        setResponse({
          data,
          error: null,
          loading: false,
        });

        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Something went wrong';

        setResponse({
          data: null,
          error: errorMessage,
          loading: false,
        });

        throw error;
      }
    },
    []
  );

  return {
    ...response,
    request,
  };
};