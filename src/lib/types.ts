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
  bookmakerKey: string;
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

// ─── SPORTS (all from OddsAPI) ──────────────────────────
export interface SportDef {
  key: string;
  label: string;
  group: string;
  icon: string;
}

export const SPORT_GROUPS = [
  'American Football', 'Aussie Rules', 'Baseball', 'Basketball', 'Boxing',
  'Cricket', 'Golf', 'Handball', 'Ice Hockey', 'Lacrosse', 'MMA',
  'Politics', 'Rugby League', 'Rugby Union', 'Soccer', 'Tennis',
] as const;

export const SPORTS: SportDef[] = [
  // American Football
  { key: 'americanfootball_cfl', label: 'CFL', group: 'American Football', icon: '🏈' },
  { key: 'americanfootball_ncaaf', label: 'NCAAF', group: 'American Football', icon: '🏈' },
  { key: 'americanfootball_ncaaf_championship_winner', label: 'NCAAF Championship', group: 'American Football', icon: '🏈' },
  { key: 'americanfootball_nfl', label: 'NFL', group: 'American Football', icon: '🏈' },
  { key: 'americanfootball_nfl_preseason', label: 'NFL Preseason', group: 'American Football', icon: '🏈' },
  { key: 'americanfootball_nfl_super_bowl_winner', label: 'NFL Super Bowl Winner', group: 'American Football', icon: '🏈' },
  { key: 'americanfootball_ufl', label: 'UFL', group: 'American Football', icon: '🏈' },
  // Aussie Rules
  { key: 'aussierules_afl', label: 'AFL', group: 'Aussie Rules', icon: '🏉' },
  // Baseball
  { key: 'baseball_mlb', label: 'MLB', group: 'Baseball', icon: '⚾' },
  { key: 'baseball_mlb_preseason', label: 'MLB Preseason', group: 'Baseball', icon: '⚾' },
  { key: 'baseball_mlb_world_series_winner', label: 'MLB World Series', group: 'Baseball', icon: '⚾' },
  { key: 'baseball_milb', label: 'Minor League', group: 'Baseball', icon: '⚾' },
  { key: 'baseball_npb', label: 'NPB', group: 'Baseball', icon: '⚾' },
  { key: 'baseball_kbo', label: 'KBO', group: 'Baseball', icon: '⚾' },
  { key: 'baseball_ncaa', label: 'NCAA Baseball', group: 'Baseball', icon: '⚾' },
  // Basketball
  { key: 'basketball_euroleague', label: 'Euroleague', group: 'Basketball', icon: '🏀' },
  { key: 'basketball_nba', label: 'NBA', group: 'Basketball', icon: '🏀' },
  { key: 'basketball_nba_preseason', label: 'NBA Preseason', group: 'Basketball', icon: '🏀' },
  { key: 'basketball_nba_all_stars', label: 'NBA All Star', group: 'Basketball', icon: '🏀' },
  { key: 'basketball_nba_summer_league', label: 'NBA Summer League', group: 'Basketball', icon: '🏀' },
  { key: 'basketball_nba_championship_winner', label: 'NBA Championship', group: 'Basketball', icon: '🏀' },
  { key: 'basketball_wnba', label: 'WNBA', group: 'Basketball', icon: '🏀' },
  { key: 'basketball_ncaab', label: 'NCAAB', group: 'Basketball', icon: '🏀' },
  { key: 'basketball_wncaab', label: 'WNCAAB', group: 'Basketball', icon: '🏀' },
  { key: 'basketball_ncaab_championship_winner', label: 'NCAAB Championship', group: 'Basketball', icon: '🏀' },
  { key: 'basketball_nbl', label: 'NBL (Australia)', group: 'Basketball', icon: '🏀' },
  // Boxing
  { key: 'boxing_boxing', label: 'Boxing', group: 'Boxing', icon: '🥊' },
  // Cricket
  { key: 'cricket_asia_cup', label: 'Asia Cup', group: 'Cricket', icon: '🏏' },
  { key: 'cricket_big_bash', label: 'Big Bash', group: 'Cricket', icon: '🏏' },
  { key: 'cricket_caribbean_premier_league', label: 'Caribbean PL', group: 'Cricket', icon: '🏏' },
  { key: 'cricket_icc_trophy', label: 'ICC Champions Trophy', group: 'Cricket', icon: '🏏' },
  { key: 'cricket_icc_world_cup', label: 'ICC World Cup', group: 'Cricket', icon: '🏏' },
  { key: 'cricket_icc_world_cup_womens', label: 'ICC Women\'s WC', group: 'Cricket', icon: '🏏' },
  { key: 'cricket_international_t20', label: 'Int\'l T20', group: 'Cricket', icon: '🏏' },
  { key: 'cricket_ipl', label: 'IPL', group: 'Cricket', icon: '🏏' },
  { key: 'cricket_odi', label: 'ODI', group: 'Cricket', icon: '🏏' },
  { key: 'cricket_psl', label: 'Pakistan Super League', group: 'Cricket', icon: '🏏' },
  { key: 'cricket_t20_blast', label: 'T20 Blast', group: 'Cricket', icon: '🏏' },
  { key: 'cricket_t20_world_cup', label: 'T20 World Cup', group: 'Cricket', icon: '🏏' },
  { key: 'cricket_test_match', label: 'Test Matches', group: 'Cricket', icon: '🏏' },
  { key: 'cricket_the_hundred', label: 'The Hundred', group: 'Cricket', icon: '🏏' },
  // Golf
  { key: 'golf_masters_tournament_winner', label: 'Masters', group: 'Golf', icon: '⛳' },
  { key: 'golf_pga_championship_winner', label: 'PGA Championship', group: 'Golf', icon: '⛳' },
  { key: 'golf_the_open_championship_winner', label: 'The Open', group: 'Golf', icon: '⛳' },
  { key: 'golf_us_open_winner', label: 'US Open', group: 'Golf', icon: '⛳' },
  // Handball
  { key: 'handball_germany_bundesliga', label: 'Handball-Bundesliga', group: 'Handball', icon: '🤾' },
  // Ice Hockey
  { key: 'icehockey_nhl', label: 'NHL', group: 'Ice Hockey', icon: '🏒' },
  { key: 'icehockey_nhl_preseason', label: 'NHL Preseason', group: 'Ice Hockey', icon: '🏒' },
  { key: 'icehockey_ahl', label: 'AHL', group: 'Ice Hockey', icon: '🏒' },
  { key: 'icehockey_nhl_championship_winner', label: 'NHL Championship', group: 'Ice Hockey', icon: '🏒' },
  { key: 'icehockey_liiga', label: 'Finnish Liiga', group: 'Ice Hockey', icon: '🏒' },
  { key: 'icehockey_mestis', label: 'Finnish Mestis', group: 'Ice Hockey', icon: '🏒' },
  { key: 'icehockey_sweden_hockey_league', label: 'SHL', group: 'Ice Hockey', icon: '🏒' },
  { key: 'icehockey_sweden_allsvenskan', label: 'HockeyAllsvenskan', group: 'Ice Hockey', icon: '🏒' },
  // Lacrosse
  { key: 'lacrosse_pll', label: 'PLL', group: 'Lacrosse', icon: '🥍' },
  { key: 'lacrosse_ncaa', label: 'NCAA Lacrosse', group: 'Lacrosse', icon: '🥍' },
  // MMA
  { key: 'mma_mixed_martial_arts', label: 'MMA', group: 'MMA', icon: '🥋' },
  // Politics
  { key: 'politics_us_presidential_election_winner', label: 'US Presidential Election', group: 'Politics', icon: '🗳️' },
  // Rugby League
  { key: 'rugbyleague_nrl', label: 'NRL', group: 'Rugby League', icon: '🏉' },
  { key: 'rugbyleague_nrl_state_of_origin', label: 'NRL State of Origin', group: 'Rugby League', icon: '🏉' },
  // Rugby Union
  { key: 'rugbyunion_six_nations', label: 'Six Nations', group: 'Rugby Union', icon: '🏉' },
  // Soccer
  { key: 'soccer_africa_cup_of_nations', label: 'Africa Cup of Nations', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_argentina_primera_division', label: 'Argentina Primera', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_australia_aleague', label: 'A-League', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_austria_bundesliga', label: 'Austria Bundesliga', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_belgium_first_div', label: 'Belgium First Div', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_brazil_campeonato', label: 'Brazil Série A', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_brazil_serie_b', label: 'Brazil Série B', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_chile_campeonato', label: 'Chile Primera', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_china_superleague', label: 'China Super League', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_denmark_superliga', label: 'Denmark Superliga', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_efl_champ', label: 'Championship', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_england_efl_cup', label: 'EFL Cup', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_england_league1', label: 'League 1', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_england_league2', label: 'League 2', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_epl', label: 'EPL', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_fa_cup', label: 'FA Cup', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_fifa_world_cup', label: 'FIFA World Cup', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_fifa_world_cup_qualifiers_europe', label: 'WC Qualifiers Europe', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_fifa_world_cup_qualifiers_south_america', label: 'WC Qualifiers SA', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_fifa_world_cup_womens', label: 'FIFA Women\'s WC', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_fifa_world_cup_winner', label: 'FIFA WC Winner', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_fifa_club_world_cup', label: 'FIFA Club WC', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_finland_veikkausliiga', label: 'Veikkausliiga', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_france_coupe_de_france', label: 'Coupe de France', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_france_ligue_one', label: 'Ligue 1', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_france_ligue_two', label: 'Ligue 2', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_germany_bundesliga', label: 'Bundesliga', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_germany_bundesliga2', label: 'Bundesliga 2', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_germany_bundesliga_women', label: 'Frauen-Bundesliga', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_germany_dfb_pokal', label: 'DFB-Pokal', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_germany_liga3', label: '3. Liga', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_greece_super_league', label: 'Greece Super League', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_italy_coppa_italia', label: 'Coppa Italia', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_italy_serie_a', label: 'Serie A', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_italy_serie_b', label: 'Serie B', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_japan_j_league', label: 'J League', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_korea_kleague1', label: 'K League 1', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_league_of_ireland', label: 'League of Ireland', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_mexico_ligamx', label: 'Liga MX', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_netherlands_eredivisie', label: 'Eredivisie', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_norway_eliteserien', label: 'Eliteserien', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_poland_ekstraklasa', label: 'Ekstraklasa', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_portugal_primeira_liga', label: 'Primeira Liga', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_russia_premier_league', label: 'Russia PL', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_spain_copa_del_rey', label: 'Copa del Rey', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_spain_la_liga', label: 'La Liga', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_spain_segunda_division', label: 'La Liga 2', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_saudi_arabia_pro_league', label: 'Saudi Pro League', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_spl', label: 'Premiership (Scotland)', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_sweden_allsvenskan', label: 'Allsvenskan', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_sweden_superettan', label: 'Superettan', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_switzerland_superleague', label: 'Swiss Superleague', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_turkey_super_league', label: 'Turkey Super League', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_uefa_europa_conference_league', label: 'Conference League', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_uefa_champs_league', label: 'Champions League', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_uefa_champs_league_qualification', label: 'UCL Qualification', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_uefa_champs_league_women', label: 'UWCL', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_uefa_europa_league', label: 'Europa League', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_uefa_european_championship', label: 'UEFA Euro', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_uefa_euro_qualification', label: 'Euro Qualification', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_uefa_nations_league', label: 'Nations League', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_concacaf_gold_cup', label: 'Gold Cup', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_concacaf_leagues_cup', label: 'Leagues Cup', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_conmebol_copa_america', label: 'Copa América', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_conmebol_copa_libertadores', label: 'Copa Libertadores', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_conmebol_copa_sudamericana', label: 'Copa Sudamericana', group: 'Soccer', icon: '⚽' },
  { key: 'soccer_usa_mls', label: 'MLS', group: 'Soccer', icon: '⚽' },
  // Tennis - ATP
  { key: 'tennis_atp_aus_open_singles', label: 'ATP Australian Open', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_atp_canadian_open', label: 'ATP Canadian Open', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_atp_china_open', label: 'ATP China Open', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_atp_cincinnati_open', label: 'ATP Cincinnati Open', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_atp_dubai', label: 'ATP Dubai', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_atp_french_open', label: 'ATP French Open', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_atp_indian_wells', label: 'ATP Indian Wells', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_atp_italian_open', label: 'ATP Italian Open', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_atp_madrid_open', label: 'ATP Madrid Open', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_atp_miami_open', label: 'ATP Miami Open', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_atp_monte_carlo_masters', label: 'ATP Monte-Carlo', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_atp_paris_masters', label: 'ATP Paris Masters', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_atp_qatar_open', label: 'ATP Qatar Open', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_atp_shanghai_masters', label: 'ATP Shanghai', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_atp_us_open', label: 'ATP US Open', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_atp_wimbledon', label: 'ATP Wimbledon', group: 'Tennis', icon: '🎾' },
  // Tennis - WTA
  { key: 'tennis_wta_aus_open_singles', label: 'WTA Australian Open', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_wta_canadian_open', label: 'WTA Canadian Open', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_wta_china_open', label: 'WTA China Open', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_wta_cincinnati_open', label: 'WTA Cincinnati Open', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_wta_dubai', label: 'WTA Dubai', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_wta_french_open', label: 'WTA French Open', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_wta_indian_wells', label: 'WTA Indian Wells', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_wta_italian_open', label: 'WTA Italian Open', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_wta_madrid_open', label: 'WTA Madrid Open', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_wta_miami_open', label: 'WTA Miami Open', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_wta_qatar_open', label: 'WTA Qatar Open', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_wta_us_open', label: 'WTA US Open', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_wta_wimbledon', label: 'WTA Wimbledon', group: 'Tennis', icon: '🎾' },
  { key: 'tennis_wta_wuhan_open', label: 'WTA Wuhan Open', group: 'Tennis', icon: '🎾' },
];

// ─── BOOKMAKERS BY REGION ──────────────────────────────
export interface BookmakerDef {
  key: string;
  title: string;
  region: string;
}

export const BOOKMAKER_REGIONS = [
  { key: 'eu', label: '🇪🇺 Europe (EU)', flag: '🇪🇺' },
  { key: 'uk', label: '🇬🇧 United Kingdom', flag: '🇬🇧' },
  { key: 'us', label: '🇺🇸 United States', flag: '🇺🇸' },
  { key: 'au', label: '🇦🇺 Australia', flag: '🇦🇺' },
  { key: 'fr', label: '🇫🇷 France', flag: '🇫🇷' },
  { key: 'se', label: '🇸🇪 Sweden', flag: '🇸🇪' },
] as const;

export const BOOKMAKERS: BookmakerDef[] = [
  // ── EU ──
  { key: 'onexbet', title: '1xBet', region: 'eu' },
  { key: 'sport888', title: '888sport', region: 'eu' },
  { key: 'betclic_fr', title: 'Betclic (FR)', region: 'eu' },
  { key: 'betanysports', title: 'BetAnySports', region: 'eu' },
  { key: 'betfair_ex_eu', title: 'Betfair Exchange', region: 'eu' },
  { key: 'betonlineag', title: 'BetOnline.ag', region: 'eu' },
  { key: 'betsson', title: 'Betsson', region: 'eu' },
  { key: 'codere_it', title: 'Codere (IT)', region: 'eu' },
  { key: 'betvictor', title: 'Bet Victor', region: 'eu' },
  { key: 'coolbet', title: 'Coolbet', region: 'eu' },
  { key: 'everygame', title: 'Everygame', region: 'eu' },
  { key: 'gtbets', title: 'GTbets', region: 'eu' },
  { key: 'leovegas_se', title: 'LeoVegas (SE)', region: 'eu' },
  { key: 'marathonbet', title: 'Marathon Bet', region: 'eu' },
  { key: 'matchbook', title: 'Matchbook', region: 'eu' },
  { key: 'mybookieag', title: 'MyBookie.ag', region: 'eu' },
  { key: 'nordicbet', title: 'NordicBet', region: 'eu' },
  { key: 'parionssport_fr', title: 'Parions Sport (FR)', region: 'eu' },
  { key: 'pinnacle', title: 'Pinnacle', region: 'eu' },
  { key: 'pmu_fr', title: 'PMU (FR)', region: 'eu' },
  { key: 'suprabets', title: 'Suprabets', region: 'eu' },
  { key: 'tipico_de', title: 'Tipico (DE)', region: 'eu' },
  { key: 'unibet_fr', title: 'Unibet (FR)', region: 'eu' },
  { key: 'unibet_it', title: 'Unibet (IT)', region: 'eu' },
  { key: 'unibet_nl', title: 'Unibet (NL)', region: 'eu' },
  { key: 'unibet_se', title: 'Unibet (SE)', region: 'eu' },
  { key: 'williamhill', title: 'William Hill', region: 'eu' },
  { key: 'winamax_de', title: 'Winamax (DE)', region: 'eu' },
  { key: 'winamax_fr', title: 'Winamax (FR)', region: 'eu' },
  // ── UK ──
  { key: 'sport888', title: '888sport', region: 'uk' },
  { key: 'betfair_ex_uk', title: 'Betfair Exchange', region: 'uk' },
  { key: 'betfair_sb_uk', title: 'Betfair Sportsbook', region: 'uk' },
  { key: 'betvictor', title: 'Bet Victor', region: 'uk' },
  { key: 'betway', title: 'Betway', region: 'uk' },
  { key: 'boylesports', title: 'BoyleSports', region: 'uk' },
  { key: 'casumo', title: 'Casumo', region: 'uk' },
  { key: 'coral', title: 'Coral', region: 'uk' },
  { key: 'grosvenor', title: 'Grosvenor', region: 'uk' },
  { key: 'ladbrokes_uk', title: 'Ladbrokes', region: 'uk' },
  { key: 'leovegas', title: 'LeoVegas', region: 'uk' },
  { key: 'livescorebet', title: 'LiveScore Bet', region: 'uk' },
  { key: 'matchbook', title: 'Matchbook', region: 'uk' },
  { key: 'paddypower', title: 'Paddy Power', region: 'uk' },
  { key: 'skybet', title: 'Sky Bet', region: 'uk' },
  { key: 'smarkets', title: 'Smarkets', region: 'uk' },
  { key: 'unibet_uk', title: 'Unibet', region: 'uk' },
  { key: 'virginbet', title: 'Virgin Bet', region: 'uk' },
  { key: 'williamhill', title: 'William Hill (UK)', region: 'uk' },
  // ── US ──
  { key: 'betonlineag', title: 'BetOnline.ag', region: 'us' },
  { key: 'betmgm', title: 'BetMGM', region: 'us' },
  { key: 'betrivers', title: 'BetRivers', region: 'us' },
  { key: 'betus', title: 'BetUS', region: 'us' },
  { key: 'bovada', title: 'Bovada', region: 'us' },
  { key: 'williamhill_us', title: 'Caesars', region: 'us' },
  { key: 'draftkings', title: 'DraftKings', region: 'us' },
  { key: 'fanatics', title: 'Fanatics', region: 'us' },
  { key: 'fanduel', title: 'FanDuel', region: 'us' },
  { key: 'lowvig', title: 'LowVig.ag', region: 'us' },
  { key: 'mybookieag', title: 'MyBookie.ag', region: 'us' },
  { key: 'ballybet', title: 'Bally Bet', region: 'us' },
  { key: 'betparx', title: 'betPARX', region: 'us' },
  { key: 'espnbet', title: 'theScore Bet', region: 'us' },
  { key: 'fliff', title: 'Fliff', region: 'us' },
  { key: 'hardrockbet', title: 'Hard Rock Bet', region: 'us' },
  // ── AU ──
  { key: 'betfair_ex_au', title: 'Betfair Exchange', region: 'au' },
  { key: 'betr_au', title: 'Betr', region: 'au' },
  { key: 'betright', title: 'Bet Right', region: 'au' },
  { key: 'bet365_au', title: 'Bet365 AU', region: 'au' },
  { key: 'ladbrokes_au', title: 'Ladbrokes', region: 'au' },
  { key: 'neds', title: 'Neds', region: 'au' },
  { key: 'playup', title: 'PlayUp', region: 'au' },
  { key: 'pointsbetau', title: 'PointsBet (AU)', region: 'au' },
  { key: 'sportsbet', title: 'SportsBet', region: 'au' },
  { key: 'tab', title: 'TAB', region: 'au' },
  { key: 'tabtouch', title: 'TABtouch', region: 'au' },
  { key: 'unibet', title: 'Unibet', region: 'au' },
  // ── FR ──
  { key: 'betclic_fr', title: 'Betclic (FR)', region: 'fr' },
  { key: 'netbet_fr', title: 'NetBet (FR)', region: 'fr' },
  { key: 'parionssport_fr', title: 'Parions Sport (FR)', region: 'fr' },
  { key: 'pmu_fr', title: 'PMU (FR)', region: 'fr' },
  { key: 'unibet_fr', title: 'Unibet (FR)', region: 'fr' },
  { key: 'winamax_fr', title: 'Winamax (FR)', region: 'fr' },
  // ── SE ──
  { key: 'atg_se', title: 'ATG (SE)', region: 'se' },
  { key: 'betsson', title: 'Betsson', region: 'se' },
  { key: 'campobet_se', title: 'CampoBet (SE)', region: 'se' },
  { key: 'leovegas_se', title: 'LeoVegas (SE)', region: 'se' },
  { key: 'mrgreen_se', title: 'Mr Green (SE)', region: 'se' },
  { key: 'nordicbet', title: 'NordicBet', region: 'se' },
  { key: 'sport888_se', title: '888sport (SE)', region: 'se' },
  { key: 'svenskaspel_se', title: 'Svenska Spel', region: 'se' },
  { key: 'unibet_se', title: 'Unibet (SE)', region: 'se' },
];

// ─── BET TYPES / MARKETS ───────────────────────────────
export const BET_TYPES = [
  { key: 'h2h', label: 'H2H (Moneyline)' },
  { key: 'spreads', label: 'Spreads (Handicap)' },
  { key: 'totals', label: 'Totals (Over/Under)' },
  { key: 'outrights', label: 'Outrights (Futures)' },
  { key: 'h2h_lay', label: 'H2H Lay (Exchange)' },
  { key: 'outrights_lay', label: 'Outrights Lay (Exchange)' },
] as const;
