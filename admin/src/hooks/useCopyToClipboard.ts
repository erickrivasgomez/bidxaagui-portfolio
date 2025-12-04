// src/hooks/useCopyToClipboard.ts
import { useState } from 'react';

export const useCopyToClipboard = (): [
  (text: string) => Promise<boolean>,
  { value: string | null; error: Error | null }
] => {
  const [result, setResult] = useState<{
    value: string | null;
    error: Error | null;
  }>({
    value: null,
    error: null,
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setResult({ value: text, error: null });
      return true;
    } catch (error) {
      setResult({ value: null, error: error as Error });
      return false;
    }
  };

  return [copyToClipboard, result];
};