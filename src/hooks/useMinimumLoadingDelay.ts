import { useEffect, useState } from 'react';

/** Keeps a skeleton visible for at least `delayMs` so it doesn't flash on fast responses. */
export const useMinimumLoadingDelay = (delayMs = 500): boolean => {
  const [isDelaying, setIsDelaying] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsDelaying(false), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  return isDelaying;
};
