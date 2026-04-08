import { useState } from 'react';
import { motion } from 'framer-motion';
import { SPORTS, BOOKMAKERS, BOOKMAKER_REGIONS, BET_TYPES, SPORT_GROUPS, FilterState } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Search, Crown, DollarSign, TrendingUp, ChevronDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [openSportGroups, setOpenSportGroups] = useState<string[]>([]);
  const [openRegions, setOpenRegions] = useState<string[]>(['eu']);

  const toggleGroup = (group: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(group) ? list.filter(g => g !== group) : [...list, group]);
  };

  const sportsByGroup = SPORT_GROUPS.reduce((acc, group) => {
    acc[group] = SPORTS.filter(s => s.group === group);
    return acc;
  }, {} as Record<string, typeof SPORTS>);

  const bookmakersByRegion = BOOKMAKER_REGIONS.reduce((acc, region) => {
    acc[region.key] = BOOKMAKERS.filter(b => b.region === region.key);
    return acc;
  }, {} as Record<string, typeof BOOKMAKERS>);

  const selectedSportCount = filters.sports.length;
  const selectedBmCount = filters.bookmakers.length;

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
          Sports {selectedSportCount > 0 && <span className="text-primary">({selectedSportCount})</span>}
        </label>
        <ScrollArea className="max-h-[200px]">
          <div className="space-y-1 pr-2">
            {SPORT_GROUPS.map(group => {
              const groupSports = sportsByGroup[group];
              if (!groupSports || groupSports.length === 0) return null;
              const isOpen = openSportGroups.includes(group);
              const selectedInGroup = groupSports.filter(s => filters.sports.includes(s.key)).length;

              return (
                <Collapsible key={group} open={isOpen} onOpenChange={() => toggleGroup(group, openSportGroups, setOpenSportGroups)}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1.5 rounded-md text-xs font-medium hover:bg-secondary/80 transition-colors">
                    <span className="flex items-center gap-1.5">
                      {groupSports[0]?.icon} {group}
                      {selectedInGroup > 0 && (
                        <span className="text-[10px] bg-primary/20 text-primary px-1.5 rounded-full">{selectedInGroup}</span>
                      )}
                    </span>
                    <ChevronDown className={`h-3 w-3 transition-transform text-muted-foreground ${isOpen ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="flex flex-wrap gap-1.5 pl-4 pt-1 pb-1">
                      {groupSports.map(sport => (
                        <button
                          key={sport.key}
                          onClick={() => onToggleSport(sport.key)}
                          className={`px-2 py-1 rounded text-[10px] font-medium transition-all border ${
                            filters.sports.includes(sport.key) || filters.sports.length === 0
                              ? 'bg-primary/15 border-primary/40 text-primary'
                              : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {sport.label}
                        </button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Bookmakers by Region */}
      <div>
        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
          Bookmakers {selectedBmCount > 0 && <span className="text-primary">({selectedBmCount})</span>}
        </label>
        <ScrollArea className="max-h-[250px]">
          <div className="space-y-1 pr-2">
            {BOOKMAKER_REGIONS.map(region => {
              const regionBms = bookmakersByRegion[region.key];
              if (!regionBms || regionBms.length === 0) return null;
              const isOpen = openRegions.includes(region.key);
              const selectedInRegion = regionBms.filter(b => filters.bookmakers.includes(b.key)).length;

              return (
                <Collapsible key={region.key} open={isOpen} onOpenChange={() => toggleGroup(region.key, openRegions, setOpenRegions)}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1.5 rounded-md text-xs font-medium hover:bg-secondary/80 transition-colors">
                    <span className="flex items-center gap-1.5">
                      {region.flag} {region.label}
                      {selectedInRegion > 0 && (
                        <span className="text-[10px] bg-primary/20 text-primary px-1.5 rounded-full">{selectedInRegion}</span>
                      )}
                    </span>
                    <ChevronDown className={`h-3 w-3 transition-transform text-muted-foreground ${isOpen ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="flex flex-wrap gap-1.5 pl-4 pt-1 pb-1">
                      {regionBms.map(bm => (
                        <button
                          key={`${region.key}-${bm.key}`}
                          onClick={() => onToggleBookmaker(bm.key)}
                          className={`px-2 py-1 rounded text-[10px] font-medium transition-all border ${
                            filters.bookmakers.includes(bm.key) || filters.bookmakers.length === 0
                              ? 'bg-primary/15 border-primary/40 text-primary'
                              : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {bm.title}
                        </button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </ScrollArea>
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
