import { useCallback, useState } from 'react'

export function useToggle(initial = false) {
  const [value, setValue] = useState<boolean>(initial)

  const toggle = useCallback((val?: boolean) => {
    setValue((v) => (typeof val === 'boolean' ? val : !v))
  }, [])

  return { value, toggle, setValue }
}
