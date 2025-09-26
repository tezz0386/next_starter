import { useState } from 'react';

/**
 * A small toggle hook: returns [value, toggleValue]
 * Usage: const [on, toggleOn] = useToggle(false);
 */
export function useToggle(initial = false): [boolean, () => void] {
  const [value, setValue] = useState<boolean>(initial);
  const toggle = () => setValue(v => !v);
  return [value, toggle];
}
