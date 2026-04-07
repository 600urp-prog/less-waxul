
create table public.surebet_history (
  id uuid primary key default gen_random_uuid(),
  event_id text not null,
  sport text not null,
  sport_key text not null,
  home_team text not null,
  away_team text not null,
  commence_time timestamptz not null,
  market_type text not null,
  outcomes jsonb not null,
  profit_percent numeric not null,
  total_stake numeric not null,
  guaranteed_return numeric not null,
  profit numeric not null,
  bankroll numeric not null,
  detected_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.surebet_history enable row level security;

create policy "Anyone can read surebet history"
  on public.surebet_history for select
  to anon, authenticated
  using (true);

create policy "Anyone can insert surebet history"
  on public.surebet_history for insert
  to anon, authenticated
  with check (true);

create index idx_surebet_history_detected_at on public.surebet_history(detected_at desc);
