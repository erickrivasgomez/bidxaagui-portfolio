import { useState, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  status: 'idle' | 'pending' | 'success' | 'error';
}

export const useAsync = <T, A extends any[]>(
  asyncFunction: (...args: A) => Promise<T>
) => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    status: 'idle',
  });

  const execute = useCallback(
    async (...args: A) => {
      setState({ data: null, error: null, status: 'pending' });
      try {
        const data = await asyncFunction(...args);
        setState({ data, error: null, status: 'success' });
        return data;
      } catch (error) {
        setState({
          data: null,
          error: error instanceof Error ? error : new Error('An error occurred'),
          status: 'error',
        });
        throw error;
      }
    },
    [asyncFunction]
  );

  return {
    ...state,
    isLoading: state.status === 'pending',
    isIdle: state.status === 'idle',
    isError: state.status === 'error',
    isSuccess: state.status === 'success',
    execute,
  };
};
