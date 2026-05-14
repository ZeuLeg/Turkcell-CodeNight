import { useState, useEffect, useCallback } from 'react';
import { alarmsApi } from '@/api/alarms.api';
import { Alarm } from '@/types/alarm.types';

interface AlarmFilters {
  severity?: string;
  status?: string;
  station?: string;
}

export function useAlarms(filters?: AlarmFilters) {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlarms = useCallback(() => {
    setLoading(true);
    alarmsApi.getAll(filters)
      .then((res) => {
        setAlarms(res.data ?? []);
        setError(null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters?.severity, filters?.status, filters?.station]);

  useEffect(() => {
    fetchAlarms();
  }, [fetchAlarms]);

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

  return { alarms, loading, error, refetch: fetchAlarms, acknowledge, assign, resolve };
}
