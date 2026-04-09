import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalSurebets: number;
  totalProfit: number;
  avgProfitPercent: number;
  todaySurebets: number;
  dailyData: { date: string; count: number; profit: number }[];
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    totalSurebets: 0,
    totalProfit: 0,
    avgProfitPercent: 0,
    todaySurebets: 0,
    dailyData: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('surebet_history')
      .select('profit, profit_percent, detected_at')
      .order('detected_at', { ascending: true });

    if (data && data.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const todayEntries = data.filter(d => d.detected_at.startsWith(today));
      const totalProfit = data.reduce((s, d) => s + Number(d.profit), 0);
      const avgPP = data.reduce((s, d) => s + Number(d.profit_percent), 0) / data.length;

      // Group by day
      const byDay: Record<string, { count: number; profit: number }> = {};
      data.forEach(d => {
        const day = d.detected_at.split('T')[0];
        if (!byDay[day]) byDay[day] = { count: 0, profit: 0 };
        byDay[day].count++;
        byDay[day].profit += Number(d.profit);
      });
      const dailyData = Object.entries(byDay).map(([date, v]) => ({
        date,
        count: v.count,
        profit: Math.round(v.profit * 100) / 100,
      }));

      setStats({
        totalSurebets: data.length,
        totalProfit: Math.round(totalProfit * 100) / 100,
        avgProfitPercent: Math.round(avgPP * 100) / 100,
        todaySurebets: todayEntries.length,
        dailyData,
      });
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return { stats, isLoading, reload: load };
}
