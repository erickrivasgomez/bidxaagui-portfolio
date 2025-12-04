import { useState } from 'react';

export const useClipboard = (): [
  string | null,
  (text: string) => Promise<boolean>,
  { error: Error | null; reset: () => void }
] => {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setError(null);
      return true;
    } catch (err) {
      setError(err as Error);
      setCopiedText(null);
      return false;
    }
  };

  const reset = () => {
    setCopiedText(null);
    setError(null);
  };

  return [copiedText, copyToClipboard, { error, reset }];
};
