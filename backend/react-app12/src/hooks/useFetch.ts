import { useEffect, useState } from 'react';

type FetchState<T> = {
  data?: T;
  loading: boolean;
  error?: string;
};

export function useFetch<T = unknown>(url: string, options?: RequestInit) {
  const [state, setState] = useState<FetchState<T>>({ loading: true });

  useEffect(() => {
    let mounted = true;
    setState({ loading: true });

    fetch(url, options)
      .then(async (res) => {
        const contentType = res.headers.get('content-type');
        const isJson = contentType?.includes('application/json');
        const data = isJson ? (await res.json()) : (await res.text());

        if (!mounted) return;
        setState({ data: data as T, loading: false });
      })
      .catch((err) => {
        if (!mounted) return;
        setState({ data: undefined, loading: false, error: String(err) });
      });

    return () => {
      mounted = false;
    };
  }, [url, JSON.stringify(options)]);

  return state;
}
