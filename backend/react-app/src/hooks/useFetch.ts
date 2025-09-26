import { useEffect, useState } from 'react';

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetch(url)
      .then((res) => res.json())
      .then((d) => {
        if (!mounted) return;
        setData(d as T);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.message ?? 'Fetch error');
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [url, reload]);

  const refetch = () => setReload((n) => n + 1);

  return { data, loading, error, refetch };
}
