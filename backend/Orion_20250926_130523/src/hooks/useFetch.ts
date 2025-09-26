import { useEffect, useState } from 'react';

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

function useFetch<T = unknown>(url: string, init?: RequestInit): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let mounted = true;
    setState({ data: null, loading: true, error: null });

    fetch(url, init)
      .then(async res => {
        if (!res.ok) {
          const err = await res.text();
          throw new Error(err || 'Fetch error');
        }
        return res.json() as Promise<T>;
      })
      .then(data => {
        if (mounted) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch(err => {
        if (mounted) {
          setState({ data: null, loading: false, error: (err as Error).message });
        }
      });

    return () => {
      mounted = false;
    };
  }, [url]); // refetch if URL changes

  return state;
}

export default useFetch;
