import { supabase } from '@/integrations/supabase/client';
import { Surebet } from '@/lib/types';

export async function saveSurebets(surebets: Surebet[], bankroll: number) {
  if (surebets.length === 0) return;

  const rows = surebets.map(sb => ({
    event_id: sb.id,
    sport: sb.sport,
    sport_key: sb.sportKey,
    home_team: sb.homeTeam,
    away_team: sb.awayTeam,
    commence_time: sb.commenceTime,
    market_type: sb.marketType,
    outcomes: sb.outcomes,
    profit_percent: sb.profitPercent,
    total_stake: sb.totalStake,
    guaranteed_return: sb.guaranteedReturn,
    profit: sb.profit,
    bankroll,
    detected_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from('surebet_history').insert(rows);
  if (error) console.error('Failed to save surebets:', error);
}

export interface HistoryEntry {
  id: string;
  event_id: string;
  sport: string;
  sport_key: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  market_type: string;
  outcomes: any[];
  profit_percent: number;
  total_stake: number;
  guaranteed_return: number;
  profit: number;
  bankroll: number;
  detected_at: string;
}

export async function fetchHistory(limit = 50): Promise<HistoryEntry[]> {
  const { data, error } = await supabase
    .from('surebet_history')
    .select('*')
    .order('detected_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch history:', error);
    return [];
  }

  return (data ?? []) as HistoryEntry[];
}
