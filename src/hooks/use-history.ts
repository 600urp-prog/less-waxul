import { useState, useEffect, useCallback } from 'react';
import { HistoryEntry, fetchHistory } from '@/lib/history-service';

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchHistory();
    setEntries(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { entries, isLoading, reload: load };
}
