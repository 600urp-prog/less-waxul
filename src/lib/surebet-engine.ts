import { Surebet, SurebetOutcome, Event, FilterState } from './types';

// Find all surebets from events data
export function detectSurebets(events: Event[], filters: FilterState): Surebet[] {
  const surebets: Surebet[] = [];
  const seen = new Set<string>();

  for (const event of events) {
    // Filter by sport
    if (filters.sports.length > 0 && !filters.sports.includes(event.sport_key)) continue;

    // Filter bookmakers
    const filteredBookmakers = event.bookmakers.filter(
      b => filters.bookmakers.length === 0 || filters.bookmakers.includes(b.key)
    );

    if (filteredBookmakers.length < 2) continue;

    // Process each market type
    for (const betType of filters.betTypes.length > 0 ? filters.betTypes : ['h2h', 'totals']) {
      const marketKey = betType === 'h2h' ? 'h2h' : 'totals';
      
      // Collect best odds per outcome across bookmakers
      const bestOdds = new Map<string, { odds: number; bookmaker: string }>();

      for (const bm of filteredBookmakers) {
        const market = bm.markets.find(m => m.key === marketKey);
        if (!market) continue;

        for (const outcome of market.outcomes) {
          const current = bestOdds.get(outcome.name);
          if (!current || outcome.price > current.odds) {
            bestOdds.set(outcome.name, { odds: outcome.price, bookmaker: bm.title });
          }
        }
      }

      if (bestOdds.size < 2) continue;

      // Calculate implied probability
      const entries = Array.from(bestOdds.entries());
      const totalImplied = entries.reduce((sum, [, v]) => sum + 1 / v.odds, 0);

      if (totalImplied < 1) {
        const dedupeKey = `${event.id}-${marketKey}`;
        if (seen.has(dedupeKey)) continue;
        seen.add(dedupeKey);

        const profitPercent = ((1 / totalImplied - 1) * 100);
        
        if (filters.vipMode && profitPercent < filters.minProfit) continue;

        const guaranteedReturn = filters.bankroll / totalImplied;
        const outcomes: SurebetOutcome[] = entries.map(([name, { odds, bookmaker }]) => {
          const exactStake = guaranteedReturn / odds;
          return {
            outcomeName: name,
            bookmaker,
            odds,
            stake: exactStake,
            stakeRounded: roundStake(exactStake),
          };
        });

        const totalStake = outcomes.reduce((s, o) => s + o.stakeRounded, 0);
        const minReturn = Math.min(...outcomes.map(o => o.stakeRounded * o.odds));

        surebets.push({
          id: dedupeKey,
          sport: event.sport_title,
          sportKey: event.sport_key,
          homeTeam: event.home_team,
          awayTeam: event.away_team,
          commenceTime: event.commence_time,
          marketType: betType === 'h2h' ? 'H2H' : 'Totals',
          outcomes,
          totalImpliedProbability: totalImplied,
          profitPercent,
          totalStake,
          guaranteedReturn: minReturn,
          profit: minReturn - totalStake,
        });
      }
    }
  }

  return surebets.sort((a, b) => b.profitPercent - a.profitPercent);
}

function roundStake(amount: number): number {
  if (amount < 10) return Math.round(amount * 100) / 100;
  if (amount < 100) return Math.round(amount * 10) / 10;
  return Math.round(amount);
}

// Generate mock events for demo
export function generateMockEvents(): Event[] {
  const events: Event[] = [
    createMockEvent('soccer', 'Football', 'Real Madrid', 'Barcelona', [
      { key: 'pinnacle', title: 'Pinnacle', h2h: [2.15, 3.40, 3.50] },
      { key: 'onexbet', title: '1xBet', h2h: [2.10, 3.55, 3.40] },
      { key: 'betway', title: 'Betway', h2h: [2.20, 3.30, 3.45] },
      { key: 'marathonbet', title: 'Marathonbet', h2h: [2.18, 3.60, 3.55] },
      { key: '888sport', title: '888sport', h2h: [2.12, 3.35, 3.60] },
    ]),
    createMockEvent('soccer', 'Football', 'PSG', 'Bayern Munich', [
      { key: 'pinnacle', title: 'Pinnacle', h2h: [2.50, 3.30, 2.85] },
      { key: 'onexbet', title: '1xBet', h2h: [2.60, 3.40, 2.75] },
      { key: 'betway', title: 'Betway', h2h: [2.45, 3.50, 2.80] },
      { key: 'marathonbet', title: 'Marathonbet', h2h: [2.55, 3.55, 2.90] },
    ]),
    createMockEvent('tennis', 'Tennis', 'Djokovic', 'Alcaraz', [
      { key: 'pinnacle', title: 'Pinnacle', h2h: [1.85, 2.05] },
      { key: 'onexbet', title: '1xBet', h2h: [1.90, 2.00] },
      { key: 'betway', title: 'Betway', h2h: [1.82, 2.10] },
      { key: '888sport', title: '888sport', h2h: [1.88, 2.08] },
    ]),
    createMockEvent('tennis', 'Tennis', 'Sinner', 'Medvedev', [
      { key: 'pinnacle', title: 'Pinnacle', h2h: [1.65, 2.30] },
      { key: 'onexbet', title: '1xBet', h2h: [1.72, 2.20] },
      { key: 'betway', title: 'Betway', h2h: [1.68, 2.35] },
      { key: 'marathonbet', title: 'Marathonbet', h2h: [1.70, 2.32] },
    ]),
    createMockEvent('basketball', 'Basketball', 'Lakers', 'Celtics', [
      { key: 'pinnacle', title: 'Pinnacle', h2h: [2.10, 1.78] },
      { key: 'onexbet', title: '1xBet', h2h: [2.15, 1.75] },
      { key: 'betway', title: 'Betway', h2h: [2.08, 1.82] },
      { key: '888sport', title: '888sport', h2h: [2.18, 1.73] },
    ]),
    createMockEvent('basketball', 'Basketball', 'Warriors', 'Bucks', [
      { key: 'pinnacle', title: 'Pinnacle', h2h: [1.95, 1.90] },
      { key: 'onexbet', title: '1xBet', h2h: [2.00, 1.88] },
      { key: 'betway', title: 'Betway', h2h: [1.92, 1.95] },
      { key: 'marathonbet', title: 'Marathonbet', h2h: [1.98, 1.92] },
    ]),
    // Surebet-worthy event (artificially high odds spread)
    createMockEvent('soccer', 'Football', 'Liverpool', 'Man City', [
      { key: 'pinnacle', title: 'Pinnacle', h2h: [3.10, 3.40, 2.30] },
      { key: 'onexbet', title: '1xBet', h2h: [2.90, 3.80, 2.45] },
      { key: 'betway', title: 'Betway', h2h: [3.20, 3.30, 2.25] },
      { key: 'marathonbet', title: 'Marathonbet', h2h: [3.05, 3.70, 2.50] },
      { key: '888sport', title: '888sport', h2h: [3.15, 3.60, 2.40] },
    ]),
    createMockEvent('tennis', 'Tennis', 'Rune', 'Tsitsipas', [
      { key: 'pinnacle', title: 'Pinnacle', h2h: [2.25, 1.70] },
      { key: 'onexbet', title: '1xBet', h2h: [2.35, 1.65] },
      { key: 'betway', title: 'Betway', h2h: [2.20, 1.78] },
      { key: '888sport', title: '888sport', h2h: [2.30, 1.72] },
    ]),
  ];

  return events;
}

function createMockEvent(
  sportKey: string,
  sportTitle: string,
  home: string,
  away: string,
  bookmakers: { key: string; title: string; h2h: number[] }[]
): Event {
  const futureDate = new Date();
  futureDate.setHours(futureDate.getHours() + Math.floor(Math.random() * 72) + 1);

  return {
    id: `${sportKey}-${home}-${away}`.toLowerCase().replace(/\s/g, '-'),
    sport_key: sportKey,
    sport_title: sportTitle,
    commence_time: futureDate.toISOString(),
    home_team: home,
    away_team: away,
    bookmakers: bookmakers.map(bm => ({
      key: bm.key,
      title: bm.title,
      markets: [
        {
          key: 'h2h',
          outcomes: bm.h2h.length === 3
            ? [
                { name: home, price: bm.h2h[0] },
                { name: 'Draw', price: bm.h2h[1] },
                { name: away, price: bm.h2h[2] },
              ]
            : [
                { name: home, price: bm.h2h[0] },
                { name: away, price: bm.h2h[1] },
              ],
        },
      ],
    })),
  };
}
