import { useState, useEffect } from 'react';
import { dashboardApi, DashboardSummary } from '@/api/dashboard.api';

export function useDashboardSummary(pollMs = 5000) {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = () => {
      dashboardApi.getSummary()
        .then((res) => {
          setSummary(res.data);
          setError(null);
          setLoading(false);
        })
        .catch((err: Error) => {
          setError(err.message);
          setLoading(false);
        });
    };

    fetch();
    const id = setInterval(fetch, pollMs);
    return () => clearInterval(id);
  }, [pollMs]);

  return { summary, loading, error };
}
