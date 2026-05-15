import { useState, useEffect, useRef } from 'react';
import { stationsApi } from '@/api/stations.api';
import { Station } from '@/types/station.types';

export function useStations(pollMs = 8000) {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFirstFetch = useRef(true);

  useEffect(() => {
    const load = () => {
      if (isFirstFetch.current) setLoading(true);
      stationsApi.getAll()
        .then((res) => {
          setStations(res.data ?? []);
          setError(null);
          setLoading(false);
          isFirstFetch.current = false;
        })
        .catch((err: Error) => {
          setError(err.message);
          setLoading(false);
          isFirstFetch.current = false;
        });
    };

    isFirstFetch.current = true;
    load();
    const id = setInterval(load, pollMs);
    return () => clearInterval(id);
  }, [pollMs]);

  return { stations, loading, error };
}
