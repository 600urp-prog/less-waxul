import { useState, useMemo, useCallback } from 'react';
import { FilterState } from '@/lib/types';
import { detectSurebets, generateMockEvents } from '@/lib/surebet-engine';
import { saveSurebets } from '@/lib/history-service';

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

  const events = useMemo(() => generateMockEvents(), []);

  const surebets = useMemo(() => {
    return detectSurebets(events, filters);
  }, [events, filters]);

  const toggleSport = useCallback((key: string) => {
    setFilters(f => ({
      ...f,
      sports: f.sports.includes(key) ? f.sports.filter(s => s !== key) : [...f.sports, key],
    }));
  }, []);

  const toggleBookmaker = useCallback((key: string) => {
    setFilters(f => ({
      ...f,
      bookmakers: f.bookmakers.includes(key) ? f.bookmakers.filter(b => b !== key) : [...f.bookmakers, key],
    }));
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

  const scan = useCallback(() => {
    setIsScanning(true);
    setTimeout(async () => {
      // Save to history
      const detected = detectSurebets(events, filters);
      await saveSurebets(detected, filters.bankroll);
      setIsScanning(false);
      setLastScan(new Date());
      onScanComplete?.();
    }, 1500);
  }, [events, filters, onScanComplete]);

  return {
    filters,
    surebets,
    isScanning,
    lastScan,
    toggleSport,
    toggleBookmaker,
    toggleBetType,
    setBankroll,
    setMinProfit,
    toggleVipMode,
    scan,
    registerOnScanComplete,
  };
}
