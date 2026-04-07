import { motion } from 'framer-motion';
import { SPORTS, BOOKMAKERS, BET_TYPES, FilterState } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Search, Crown, DollarSign, TrendingUp } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterState;
  isScanning: boolean;
  lastScan: Date | null;
  onToggleSport: (key: string) => void;
  onToggleBookmaker: (key: string) => void;
  onToggleBetType: (key: string) => void;
  onSetBankroll: (value: number) => void;
  onSetMinProfit: (value: number) => void;
  onToggleVip: () => void;
  onScan: () => void;
}

export function FilterPanel({
  filters,
  isScanning,
  lastScan,
  onToggleSport,
  onToggleBookmaker,
  onToggleBetType,
  onSetBankroll,
  onSetMinProfit,
  onToggleVip,
  onScan,
}: FilterPanelProps) {
  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {/* Sports */}
      <div>
        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
          Sports
        </label>
        <div className="flex flex-wrap gap-2">
          {SPORTS.map(sport => (
            <button
              key={sport.key}
              onClick={() => onToggleSport(sport.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
                filters.sports.includes(sport.key) || filters.sports.length === 0
                  ? 'bg-primary/15 border-primary/40 text-primary'
                  : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {sport.icon} {sport.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookmakers */}
      <div>
        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
          Bookmakers
        </label>
        <div className="flex flex-wrap gap-2">
          {BOOKMAKERS.map(bm => (
            <button
              key={bm.key}
              onClick={() => onToggleBookmaker(bm.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
                filters.bookmakers.includes(bm.key) || filters.bookmakers.length === 0
                  ? 'bg-primary/15 border-primary/40 text-primary'
                  : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {bm.title}
            </button>
          ))}
        </div>
      </div>

      {/* Bet Types */}
      <div>
        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
          Bet Type
        </label>
        <div className="flex flex-wrap gap-2">
          {BET_TYPES.map(bt => (
            <button
              key={bt.key}
              onClick={() => onToggleBetType(bt.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
                filters.betTypes.includes(bt.key) || filters.betTypes.length === 0
                  ? 'bg-primary/15 border-primary/40 text-primary'
                  : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {bt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bankroll */}
      <div>
        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
          <DollarSign className="h-3 w-3" /> Bankroll
        </label>
        <Input
          type="number"
          value={filters.bankroll}
          onChange={e => onSetBankroll(Number(e.target.value) || 0)}
          className="bg-secondary border-border font-mono text-foreground"
          min={0}
        />
      </div>

      {/* VIP Mode */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
        <div className="flex items-center gap-2">
          <Crown className="h-4 w-4 text-warning" />
          <span className="text-xs font-medium text-foreground">Mode VIP</span>
        </div>
        <Switch checked={filters.vipMode} onCheckedChange={onToggleVip} />
      </div>

      {filters.vipMode && (
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
            <TrendingUp className="h-3 w-3" /> Profit min (%)
          </label>
          <Input
            type="number"
            value={filters.minProfit}
            onChange={e => onSetMinProfit(Number(e.target.value) || 0)}
            className="bg-secondary border-border font-mono text-foreground"
            step={0.1}
            min={0}
          />
        </div>
      )}

      {/* Scan Button */}
      <Button
        onClick={onScan}
        disabled={isScanning}
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
            Scanner les surebets
          </>
        )}
      </Button>

      {lastScan && (
        <p className="text-[10px] font-mono text-muted-foreground text-center">
          Dernier scan : {lastScan.toLocaleTimeString('fr-FR')}
        </p>
      )}
    </motion.div>
  );
}
