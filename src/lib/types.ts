export interface Bookmaker {
  key: string;
  title: string;
}

export interface Outcome {
  name: string;
  price: number;
}

export interface Market {
  key: string;
  outcomes: Outcome[];
}

export interface BookmakerOdds {
  key: string;
  title: string;
  markets: Market[];
}

export interface Event {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: BookmakerOdds[];
}

export interface SurebetOutcome {
  outcomeName: string;
  bookmaker: string;
  odds: number;
  stake: number;
  stakeRounded: number;
}

export interface Surebet {
  id: string;
  sport: string;
  sportKey: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  marketType: string;
  outcomes: SurebetOutcome[];
  totalImpliedProbability: number;
  profitPercent: number;
  totalStake: number;
  guaranteedReturn: number;
  profit: number;
}

export interface FilterState {
  sports: string[];
  bookmakers: string[];
  betTypes: string[];
  bankroll: number;
  minProfit: number;
  vipMode: boolean;
}

export const SPORTS = [
  { key: 'soccer', label: 'Football', icon: '⚽' },
  { key: 'basketball', label: 'Basketball', icon: '🏀' },
  { key: 'tennis', label: 'Tennis', icon: '🎾' },
] as const;

export const BOOKMAKERS = [
  { key: 'pinnacle', title: 'Pinnacle' },
  { key: 'onexbet', title: '1xBet' },
  { key: 'betway', title: 'Betway' },
  { key: '888sport', title: '888sport' },
  { key: 'marathonbet', title: 'Marathonbet' },
] as const;

export const BET_TYPES = [
  { key: 'h2h', label: 'H2H (1X2 / 12)' },
  { key: 'totals', label: 'Totals (Over/Under)' },
] as const;
