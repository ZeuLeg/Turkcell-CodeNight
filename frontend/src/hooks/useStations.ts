import { useState, useEffect } from 'react';
import { stationsApi } from '@/api/stations.api';
import { Station } from '@/types/station.types';

export function useStations() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    stationsApi.getAll()
      .then((res) => {
        setStations(res.data ?? []);
        setError(null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { stations, loading, error };
}
