import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ODDS_API_BASE = 'https://api.the-odds-api.com/v4'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { sports, bookmakers, betTypes } = await req.json()

    if (!sports || !Array.isArray(sports) || sports.length === 0) {
      return new Response(JSON.stringify({ error: 'Au moins un sport est requis' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get API key from admin_settings
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: settingsData } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'odds_api_key')
      .single()

    const apiKey = settingsData?.value
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Clé API non configurée. Allez dans Admin > API.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Map bet types to OddsAPI markets parameter
    const marketsMap: Record<string, string> = {
      h2h: 'h2h',
      spreads: 'spreads',
      totals: 'totals',
      outrights: 'outrights',
    }
    const markets = (betTypes && betTypes.length > 0)
      ? betTypes.map((bt: string) => marketsMap[bt] || bt).join(',')
      : 'h2h'

    // Build regions from bookmaker keys
    const regions = bookmakers && bookmakers.length > 0
      ? [...new Set(bookmakers.map((b: string) => getRegionForBookmaker(b)))].filter(Boolean).join(',') || 'eu,uk,us,au'
      : 'eu,uk,us,au'

    // Fetch odds for each selected sport (upcoming + live)
    const allEvents: any[] = []
    const errors: string[] = []
    const seenEventIds = new Set<string>()

    const fetchSportOdds = async (sportKey: string, live: boolean) => {
      const endpoint = live ? 'odds-live' : 'odds'
      const url = `${ODDS_API_BASE}/sports/${sportKey}/${endpoint}/?apiKey=${apiKey}&regions=${regions}&markets=${markets}&oddsFormat=decimal`
      const resp = await fetch(url)
      if (!resp.ok) {
        const text = await resp.text()
        throw new Error(`${sportKey} (${live ? 'live' : 'upcoming'}): ${resp.status} - ${text}`)
      }
      return resp.json()
    }

    // Limit concurrent requests to avoid rate limiting
    const batchSize = 3
    for (let i = 0; i < sports.length; i += batchSize) {
      const batch = sports.slice(i, i + batchSize)
      // For each sport, fetch both upcoming and live
      const tasks = batch.flatMap((sportKey: string) => [
        fetchSportOdds(sportKey, false),
        fetchSportOdds(sportKey, true),
      ])
      const results = await Promise.allSettled(tasks)

      for (const result of results) {
        if (result.status === 'fulfilled') {
          for (const event of result.value) {
            if (!seenEventIds.has(event.id)) {
              seenEventIds.add(event.id)
              allEvents.push(event)
            }
          }
        } else {
          errors.push(result.reason?.message || 'Unknown error')
        }
      }
    }

    // Filter by selected bookmakers if specified
    let filteredEvents = allEvents
    if (bookmakers && bookmakers.length > 0) {
      filteredEvents = allEvents.map((event: any) => ({
        ...event,
        bookmakers: event.bookmakers?.filter((bm: any) => bookmakers.includes(bm.key)) || [],
      })).filter((event: any) => event.bookmakers.length > 0)
    }

    return new Response(JSON.stringify({
      events: filteredEvents,
      count: filteredEvents.length,
      errors: errors.length > 0 ? errors : undefined,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

// Simple region lookup based on bookmaker key patterns
function getRegionForBookmaker(key: string): string {
  const regionMap: Record<string, string> = {
    // US
    draftkings: 'us', fanduel: 'us', betmgm: 'us', pointsbetus: 'us',
    caesars: 'us', bovada: 'us', betonlineag: 'us', mybookieag: 'us',
    superbook: 'us', twinspires: 'us', unibet_us: 'us', betrivers: 'us',
    williamhill_us: 'us', wynnbet: 'us', betus: 'us', lowvig: 'us',
    betanysports: 'us', everygame: 'us', gtbets: 'us',
    // UK
    betfair_ex_uk: 'uk', betway: 'uk', williamhill: 'uk', skybet: 'uk',
    ladbrokes_uk: 'uk', coral: 'uk', paddypower: 'uk', betvictor: 'uk',
    boylesports: 'uk', livescorebet_eu: 'uk', matchbook: 'uk',
    // AU
    sportsbet: 'au', tab: 'au', pointsbet_au: 'au', neds: 'au',
    ladbrokes_au: 'au', betright: 'au', unibet_au: 'au', topsport: 'au',
    bluebet: 'au', playup: 'au', betr_au: 'au',
    // EU
    onexbet: 'eu', sport888: 'eu', pinnacle: 'eu', marathonbet: 'eu',
    betsson: 'eu', coolbet: 'eu', nordicbet: 'eu', suprabets: 'eu',
    betfair_ex_eu: 'eu', betclic_fr: 'eu', codere_it: 'eu',
    leovegas_se: 'eu',
    // FR
    parionssport_fr: 'eu', pmu_fr: 'eu', unibet_fr: 'eu', zebet_fr: 'eu',
    france_pari_fr: 'eu',
  }
  return regionMap[key] || 'eu'
}
