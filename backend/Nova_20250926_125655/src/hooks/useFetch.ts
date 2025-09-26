import { useEffect, useState } from 'react'

type FetchState<T> = {
  data?: T
  loading: boolean
  error?: string
}

export function useFetch<T = unknown>(
  url: string,
  options?: RequestInit
): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({ loading: true })

  useEffect(() => {
    let mounted = true
    setState({ loading: true })

    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return
        setState({ data, loading: false })
      })
      .catch((err) => {
        if (!mounted) return
        setState({ data: undefined, loading: false, error: (err as Error).message })
      })

    return () => {
      mounted = false
    }
  }, [url, JSON.stringify(options || {})])

  return state
}
