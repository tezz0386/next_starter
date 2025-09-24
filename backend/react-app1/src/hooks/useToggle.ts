import { useState } from 'react';

export const useToggle = (initial = false) => {
  const [on, setOn] = useState<boolean>(initial);
  const toggle = () => setOn((v) => !v);
  const set = (value: boolean) => setOn(value);
  return { on, toggle, set };
};
