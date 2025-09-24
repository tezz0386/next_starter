import { useCallback, useState } from 'react';

/**
 * A simple boolean toggle hook
 * Returns [value, toggle, setValue]
 */
export function useToggle(initial = false): [boolean, () => void, (val: boolean) => void] {
  const [value, setValue] = useState<boolean>(initial);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const set = useCallback((val: boolean) => setValue(val), []);

  return [value, toggle, set];
}
