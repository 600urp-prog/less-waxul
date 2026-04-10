import { useState, useMemo, useCallback } from 'react';
import { FilterState, Event } from '@/lib/types';
import { detectSurebets } from '@/lib/surebet-engine';
import { saveSurebets } from '@/lib/history-service';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const DEFAULT_FILTERS: FilterState = {
  sports: [],
  bookmakers: [],
  betTypes: [],
  bankroll: 1000,
  minProfit: 0.5,
  vipMode: false,
};

export function useSurebets() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<Date | null>(null);
  const [onScanComplete, setOnScanComplete] = useState<(() => void) | null>(null);
  const [liveEvents, setLiveEvents] = useState<Event[]>([]);
  const [scanError, setScanError] = useState<string | null>(null);

  const surebets = useMemo(() => {
    return detectSurebets(liveEvents, filters);
  }, [liveEvents, filters]);

  const toggleSport = useCallback((key: string) => {
    setFilters(f => ({
      ...f,
      sports: f.sports.includes(key) ? f.sports.filter(s => s !== key) : [...f.sports, key],
    }));
  }, []);

  const setSports = useCallback((keys: string[]) => {
    setFilters(f => ({ ...f, sports: keys }));
  }, []);

  const toggleBookmaker = useCallback((key: string) => {
    setFilters(f => ({
      ...f,
      bookmakers: f.bookmakers.includes(key) ? f.bookmakers.filter(b => b !== key) : [...f.bookmakers, key],
    }));
  }, []);

  const setBookmakers = useCallback((keys: string[]) => {
    setFilters(f => ({ ...f, bookmakers: keys }));
  }, []);

  const toggleBetType = useCallback((key: string) => {
    setFilters(f => ({
      ...f,
      betTypes: f.betTypes.includes(key) ? f.betTypes.filter(b => b !== key) : [...f.betTypes, key],
    }));
  }, []);

  const setBankroll = useCallback((bankroll: number) => {
    setFilters(f => ({ ...f, bankroll }));
  }, []);

  const setMinProfit = useCallback((minProfit: number) => {
    setFilters(f => ({ ...f, minProfit }));
  }, []);

  const toggleVipMode = useCallback(() => {
    setFilters(f => ({ ...f, vipMode: !f.vipMode }));
  }, []);

  const registerOnScanComplete = useCallback((cb: () => void) => {
    setOnScanComplete(() => cb);
  }, []);

  const scan = useCallback(async () => {
    if (filters.sports.length === 0) {
      toast.error('Sélectionnez au moins un sport avant de scanner');
      return;
    }

    setIsScanning(true);
    setScanError(null);

    try {
      const { data, error } = await supabase.functions.invoke('fetch-odds', {
        body: {
          sports: filters.sports,
          bookmakers: filters.bookmakers.length > 0 ? filters.bookmakers : undefined,
          betTypes: filters.betTypes.length > 0 ? filters.betTypes : undefined,
        },
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      const events: Event[] = data.events || [];
      setLiveEvents(events);

      // Detect and save surebets
      const detected = detectSurebets(events, filters);
      if (detected.length > 0) {
        await saveSurebets(detected, filters.bankroll);
        toast.success(`${detected.length} surebet(s) trouvé(s) !`);
      } else {
        toast.info(`${events.length} événement(s) analysé(s), aucun surebet détecté`);
      }

      if (data.errors && data.errors.length > 0) {
        console.warn('Some sports had errors:', data.errors);
      }

      setLastScan(new Date());
      onScanComplete?.();
    } catch (err: any) {
      const msg = err.message || 'Erreur lors du scan';
      setScanError(msg);
      toast.error(msg);
    } finally {
      setIsScanning(false);
    }
  }, [filters, onScanComplete]);

  return {
    filters,
    surebets,
    isScanning,
    lastScan,
    scanError,
    toggleSport,
    setSports,
    toggleBookmaker,
    setBookmakers,
    toggleBetType,
    setBankroll,
    setMinProfit,
    toggleVipMode,
    scan,
    registerOnScanComplete,
  };
}
