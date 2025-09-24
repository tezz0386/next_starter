import { useEffect, useState } from 'react';

export function useFetch<T = unknown>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Request failed with ${res.status}`);
        }
        // try to parse JSON; if fails, return text
        try {
          const json = await res.json();
          return json as T;
        } catch {
          const text = await res.text();
          // @ts-ignore
          return text as unknown as T;
        }
      })
      .then((payload) => {
        if (mounted) setData(payload as T);
      })
      .catch((err: any) => {
        if (mounted) setError(err?.message ?? 'Unknown error');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [url]);

  return { data, loading, error };
}
