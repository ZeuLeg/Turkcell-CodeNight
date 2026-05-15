import { useState, useEffect, useCallback, useRef } from 'react';
import { alarmsApi } from '@/api/alarms.api';
import { Alarm } from '@/types/alarm.types';

interface AlarmFilters {
  severity?: string;
  status?: string;
  station?: string;
}

export function useAlarms(filters?: AlarmFilters, pollMs = 8000) {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFirstFetch = useRef(true);

  const doFetch = useCallback(() => {
    if (isFirstFetch.current) setLoading(true);
    alarmsApi.getAll(filters)
      .then((res) => {
        setAlarms(res.data ?? []);
        setError(null);
        setLoading(false);
        isFirstFetch.current = false;
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
        isFirstFetch.current = false;
      });
  }, [filters?.severity, filters?.status, filters?.station]);

  useEffect(() => {
    isFirstFetch.current = true;
    doFetch();
    const id = setInterval(doFetch, pollMs);
    return () => clearInterval(id);
  }, [doFetch, pollMs]);

  const acknowledge = async (id: string) => {
    const res = await alarmsApi.acknowledge(id);
    setAlarms((prev) => prev.map((a) => (a.id === id ? res.data : a)));
  };

  const assign = async (id: string, assignedTo: string) => {
    const res = await alarmsApi.assign(id, assignedTo);
    setAlarms((prev) => prev.map((a) => (a.id === id ? res.data : a)));
  };

  const resolve = async (id: string, resolutionNote: string) => {
    const res = await alarmsApi.resolve(id, resolutionNote);
    setAlarms((prev) => prev.map((a) => (a.id === id ? res.data : a)));
  };

  return { alarms, loading, error, refetch: doFetch, acknowledge, assign, resolve };
}
