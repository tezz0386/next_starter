import { useEffect, useState } from 'react';

export const useFetch = <T,>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((d) => {
        if (mounted) {
          setData(d as T);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError((err as Error).message);
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, [url]);

  return { data, loading, error };
};
