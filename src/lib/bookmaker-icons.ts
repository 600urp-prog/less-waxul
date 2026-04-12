import { BOOKMAKER_URLS } from './bookmaker-urls';

// Get favicon URL for a bookmaker using Google's favicon service
export function getBookmakerFavicon(key: string): string | null {
  const url = BOOKMAKER_URLS[key];
  if (!url) return null;
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return null;
  }
}

// Sport icons with better granularity
export function getSportIcon(sportKey: string): string {
  const map: Record<string, string> = {
    soccer: '⚽',
    soccer_epl: '⚽',
    soccer_france_ligue_one: '⚽',
    soccer_germany_bundesliga: '⚽',
    soccer_italy_serie_a: '⚽',
    soccer_spain_la_liga: '⚽',
    soccer_uefa_champs_league: '🏆',
    soccer_uefa_europa_league: '🏆',
    tennis: '🎾',
    tennis_atp_french_open: '🎾',
    tennis_wta_french_open: '🎾',
    basketball: '🏀',
    basketball_nba: '🏀',
    basketball_euroleague: '🏀',
    americanfootball: '🏈',
    americanfootball_nfl: '🏈',
    baseball: '⚾',
    baseball_mlb: '⚾',
    icehockey: '🏒',
    icehockey_nhl: '🏒',
    mma: '🥊',
    mma_mixed_martial_arts: '🥊',
    boxing: '🥊',
    cricket: '🏏',
    rugby: '🏉',
    rugbyleague: '🏉',
    golf: '⛳',
    handball: '🤾',
    volleyball: '🏐',
    esports: '🎮',
    cycling: '🚴',
    snooker: '🎱',
    darts: '🎯',
    table_tennis: '🏓',
    motorsport: '🏎️',
  };
  
  // Try exact match first, then prefix match
  if (map[sportKey]) return map[sportKey];
  const prefix = Object.keys(map).find(k => sportKey.startsWith(k));
  return prefix ? map[prefix] : '🏅';
}
