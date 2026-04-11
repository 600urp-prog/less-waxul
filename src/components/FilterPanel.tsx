import { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { SPORTS, BOOKMAKERS, BOOKMAKER_REGIONS, BET_TYPES, SPORT_GROUPS, FilterState } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Search, Crown, DollarSign, TrendingUp, ChevronDown, ChevronRight, Check, Timer, TimerOff } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterState;
  isScanning: boolean;
  lastScan: Date | null;
  onToggleSport: (key: string) => void;
  onSetSports: (keys: string[]) => void;
  onToggleBookmaker: (key: string) => void;
  onSetBookmakers: (keys: string[]) => void;
  onToggleBetType: (key: string) => void;
  onSetBankroll: (value: number) => void;
  onSetMinProfit: (value: number) => void;
  onToggleVip: () => void;
  onScan: () => void;
}

type Section = 'sports' | 'bookmakers' | null;

export function FilterPanel({
  filters,
  isScanning,
  lastScan,
  onToggleSport,
  onSetSports,
  onToggleBookmaker,
  onSetBookmakers,
  onToggleBetType,
  onSetBankroll,
  onSetMinProfit,
  onToggleVip,
  onScan,
}: FilterPanelProps) {
  const [expandedSection, setExpandedSection] = useState<Section>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const sportsByGroup = useMemo(() => {
    const map: Record<string, typeof SPORTS> = {};
    for (const group of SPORT_GROUPS) {
      map[group] = SPORTS.filter(s => s.group === group);
    }
    return map;
  }, []);

  const bookmakersByRegion = useMemo(() => {
    const map: Record<string, typeof BOOKMAKERS> = {};
    for (const region of BOOKMAKER_REGIONS) {
      map[region.key] = BOOKMAKERS.filter(b => b.region === region.key);
    }
    return map;
  }, []);

  const selectedSportCount = filters.sports.length;
  const selectedBmCount = filters.bookmakers.length;

  const toggleSection = (s: Section) => {
    setExpandedSection(prev => prev === s ? null : s);
    setExpandedGroup(null);
  };

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {/* ── Sports selector ── */}
      <div className="rounded-lg border border-border overflow-hidden">
        <button
          onClick={() => toggleSection('sports')}
          className="flex items-center justify-between w-full px-3 py-2.5 bg-secondary/50 hover:bg-secondary transition-colors"
        >
          <span className="text-xs font-mono uppercase tracking-wider text-foreground flex items-center gap-2">
            ⚽ Sports
            {selectedSportCount > 0 && (
              <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold">{selectedSportCount}</span>
            )}
          </span>
          <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${expandedSection === 'sports' ? 'rotate-180' : ''}`} />
        </button>

        {expandedSection === 'sports' && (
          <div className="border-t border-border max-h-60 overflow-y-auto">
            <div className="flex items-center justify-between px-3 py-1.5 bg-secondary/30 border-b border-border/40">
              <span className="text-[10px] text-muted-foreground font-mono">{selectedSportCount}/{SPORTS.length}</span>
              <div className="flex gap-1.5">
                <button onClick={() => onSetSports(SPORTS.map(s => s.key))} className="text-[10px] font-medium text-primary hover:underline">Tout</button>
                <span className="text-[10px] text-muted-foreground">|</span>
                <button onClick={() => onSetSports([])} className="text-[10px] font-medium text-muted-foreground hover:text-foreground hover:underline">Aucun</button>
              </div>
            </div>
              const groupSports = sportsByGroup[group];
              if (!groupSports?.length) return null;
              const isGroupOpen = expandedGroup === group;
              const selectedInGroup = groupSports.filter(s => filters.sports.includes(s.key)).length;

              return (
                <div key={group}>
                  <button
                    onClick={() => setExpandedGroup(isGroupOpen ? null : group)}
                    className="flex items-center justify-between w-full px-3 py-2 text-xs hover:bg-secondary/60 transition-colors border-b border-border/30"
                  >
                    <span className="flex items-center gap-1.5 text-foreground">
                      {isGroupOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      {groupSports[0]?.icon} {group}
                    </span>
                    {selectedInGroup > 0 && (
                      <span className="text-[10px] bg-primary/20 text-primary px-1.5 rounded-full">{selectedInGroup}</span>
                    )}
                  </button>
                  {isGroupOpen && (
                    <div className="bg-background/50">
                      <div className="flex gap-1 px-4 pl-8 py-1.5 border-b border-border/20">
                        <button
                          onClick={() => {
                            const allKeys = [...new Set([...filters.sports, ...groupSports.map(s => s.key)])];
                            onSetSports(allKeys);
                          }}
                          className="text-[10px] text-primary hover:underline"
                        >Tout</button>
                        <span className="text-[10px] text-muted-foreground">|</span>
                        <button
                          onClick={() => {
                            const groupKeys = new Set(groupSports.map(s => s.key));
                            onSetSports(filters.sports.filter(k => !groupKeys.has(k)));
                          }}
                          className="text-[10px] text-muted-foreground hover:text-foreground hover:underline"
                        >Aucun</button>
                      </div>
                      {groupSports.map(sport => {
                        const isSelected = filters.sports.includes(sport.key);
                        return (
                          <button
                            key={sport.key}
                            onClick={() => onToggleSport(sport.key)}
                            className={`flex items-center justify-between w-full px-4 pl-8 py-1.5 text-[11px] transition-colors ${
                              isSelected ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                            }`}
                          >
                            <span>{sport.label}</span>
                            {isSelected && <Check className="h-3 w-3" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Bookmakers selector ── */}
      <div className="rounded-lg border border-border overflow-hidden">
        <button
          onClick={() => toggleSection('bookmakers')}
          className="flex items-center justify-between w-full px-3 py-2.5 bg-secondary/50 hover:bg-secondary transition-colors"
        >
          <span className="text-xs font-mono uppercase tracking-wider text-foreground flex items-center gap-2">
            🏢 Bookmakers
            {selectedBmCount > 0 ? (
              <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold">{selectedBmCount}</span>
            ) : (
              <span className="text-[10px] text-muted-foreground">(tous)</span>
            )}
          </span>
          <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${expandedSection === 'bookmakers' ? 'rotate-180' : ''}`} />
        </button>

        {expandedSection === 'bookmakers' && (
          <div className="border-t border-border max-h-60 overflow-y-auto">
            {BOOKMAKER_REGIONS.map(region => {
              const regionBms = bookmakersByRegion[region.key];
              if (!regionBms?.length) return null;
              const isGroupOpen = expandedGroup === region.key;
              const selectedInRegion = regionBms.filter(b => filters.bookmakers.includes(b.key)).length;

              return (
                <div key={region.key}>
                  <button
                    onClick={() => setExpandedGroup(isGroupOpen ? null : region.key)}
                    className="flex items-center justify-between w-full px-3 py-2 text-xs hover:bg-secondary/60 transition-colors border-b border-border/30"
                  >
                    <span className="flex items-center gap-1.5 text-foreground">
                      {isGroupOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      {region.flag} {region.label}
                    </span>
                    {selectedInRegion > 0 && (
                      <span className="text-[10px] bg-primary/20 text-primary px-1.5 rounded-full">{selectedInRegion}</span>
                    )}
                  </button>
                  {isGroupOpen && (
                    <div className="bg-background/50">
                      <div className="flex gap-1 px-4 pl-8 py-1.5 border-b border-border/20">
                        <button
                          onClick={() => {
                            const allKeys = [...new Set([...filters.bookmakers, ...regionBms.map(b => b.key)])];
                            onSetBookmakers(allKeys);
                          }}
                          className="text-[10px] text-primary hover:underline"
                        >Tout</button>
                        <span className="text-[10px] text-muted-foreground">|</span>
                        <button
                          onClick={() => {
                            const regionKeys = new Set(regionBms.map(b => b.key));
                            onSetBookmakers(filters.bookmakers.filter(k => !regionKeys.has(k)));
                          }}
                          className="text-[10px] text-muted-foreground hover:text-foreground hover:underline"
                        >Aucun</button>
                      </div>
                      {regionBms.map(bm => {
                        const isSelected = filters.bookmakers.includes(bm.key);
                        return (
                          <button
                            key={`${region.key}-${bm.key}`}
                            onClick={() => onToggleBookmaker(bm.key)}
                            className={`flex items-center justify-between w-full px-4 pl-8 py-1.5 text-[11px] transition-colors ${
                              isSelected ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                            }`}
                          >
                            <span>{bm.title}</span>
                            {isSelected && <Check className="h-3 w-3" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Bet Types (toujours visible, compact) ── */}
      <div className="flex flex-wrap gap-1.5">
        {BET_TYPES.map(bt => (
          <button
            key={bt.key}
            onClick={() => onToggleBetType(bt.key)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all border ${
              filters.betTypes.includes(bt.key) || filters.betTypes.length === 0
                ? 'bg-primary/15 border-primary/40 text-primary'
                : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {bt.label}
          </button>
        ))}
      </div>

      {/* ── Bankroll + VIP (inline) ── */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="relative">
            <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="number"
              value={filters.bankroll}
              onChange={e => onSetBankroll(Number(e.target.value) || 0)}
              className="bg-secondary border-border font-mono text-foreground pl-7 h-9 text-xs"
              min={0}
              placeholder="Bankroll"
            />
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-secondary/50 border border-border">
          <Crown className="h-3.5 w-3.5 text-warning" />
          <Switch checked={filters.vipMode} onCheckedChange={onToggleVip} className="scale-75" />
        </div>
      </div>

      {filters.vipMode && (
        <div className="relative">
          <TrendingUp className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="number"
            value={filters.minProfit}
            onChange={e => onSetMinProfit(Number(e.target.value) || 0)}
            className="bg-secondary border-border font-mono text-foreground pl-7 h-9 text-xs"
            step={0.1}
            min={0}
            placeholder="Profit min %"
          />
        </div>
      )}

      {/* ── Scan Button ── */}
      <Button
        onClick={onScan}
        disabled={isScanning || filters.sports.length === 0}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono uppercase tracking-wider glow-primary"
        size="lg"
      >
        {isScanning ? (
          <>
            <Search className="h-4 w-4 animate-spin" />
            Scanning...
          </>
        ) : (
          <>
            <Search className="h-4 w-4" />
            {filters.sports.length === 0 ? 'Sélectionnez des sports' : 'Scanner'}
          </>
        )}
      </Button>

      {/* ── Auto-scan ── */}
      <AutoScanControl onScan={onScan} isScanning={isScanning} disabled={filters.sports.length === 0} />

      {lastScan && (
        <p className="text-[10px] font-mono text-muted-foreground text-center">
          Dernier scan : {lastScan.toLocaleTimeString('fr-FR')}
        </p>
      )}
    </motion.div>
  );
}

const AUTO_INTERVALS = [
  { label: '30s', value: 30 },
  { label: '1m', value: 60 },
  { label: '2m', value: 120 },
  { label: '5m', value: 300 },
];

function AutoScanControl({ onScan, isScanning, disabled }: { onScan: () => void; isScanning: boolean; disabled: boolean }) {
  const [autoScan, setAutoScan] = useState(false);
  const [interval, setInterval_] = useState(60);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    if (autoScan && !disabled) {
      setCountdown(interval);
      countdownRef.current = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) return interval;
          return c - 1;
        });
      }, 1000);
      timerRef.current = setInterval(() => {
        onScan();
      }, interval * 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [autoScan, interval, disabled, onScan]);

  const toggleAuto = () => setAutoScan(a => !a);

  return (
    <div className="rounded-lg border border-border p-2.5 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-foreground flex items-center gap-1.5">
          {autoScan ? <Timer className="h-3.5 w-3.5 text-primary animate-pulse" /> : <TimerOff className="h-3.5 w-3.5 text-muted-foreground" />}
          Auto-scan
        </span>
        <Switch checked={autoScan} onCheckedChange={toggleAuto} disabled={disabled} className="scale-75" />
      </div>
      {autoScan && (
        <>
          <div className="flex gap-1">
            {AUTO_INTERVALS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setInterval_(opt.value)}
                className={`flex-1 text-[10px] py-1 rounded font-mono transition-colors ${
                  interval === opt.value
                    ? 'bg-primary/20 text-primary border border-primary/40'
                    : 'bg-secondary text-muted-foreground border border-border hover:text-foreground'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] font-mono text-muted-foreground text-center">
            {isScanning ? 'Scan en cours...' : `Prochain scan dans ${countdown}s`}
          </p>
        </>
      )}
    </div>
  );
}
