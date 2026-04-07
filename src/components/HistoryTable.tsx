import { motion } from 'framer-motion';
import { HistoryEntry } from '@/lib/history-service';
import { Badge } from '@/components/ui/badge';
import { Clock, History, Loader2 } from 'lucide-react';

interface HistoryTableProps {
  entries: HistoryEntry[];
  isLoading: boolean;
}

export function HistoryTable({ entries, isLoading }: HistoryTableProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm font-mono text-muted-foreground">Chargement de l'historique...</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <History className="h-12 w-12 text-muted-foreground/30" />
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">Aucun historique</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Lancez un scan pour enregistrer des surebets
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
        {entries.length} entrée{entries.length > 1 ? 's' : ''} dans l'historique
      </h2>

      {entries.map((entry, i) => {
        const sportEmoji = entry.sport_key === 'soccer' ? '⚽' : entry.sport_key === 'tennis' ? '🎾' : '🏀';
        const detectedAt = new Date(entry.detected_at);
        const outcomes = Array.isArray(entry.outcomes) ? entry.outcomes : [];

        return (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{sportEmoji}</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {entry.home_team} vs {entry.away_team}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-border text-muted-foreground">
                      {entry.market_type}
                    </Badge>
                    <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {detectedAt.toLocaleDateString('fr-FR')} {detectedAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold font-mono ${Number(entry.profit_percent) >= 2 ? 'text-profit-high' : 'text-profit'}`}>
                  +{Number(entry.profit_percent).toFixed(2)}%
                </p>
                <p className="text-[10px] font-mono text-muted-foreground">
                  {Number(entry.profit).toFixed(2)}€ · bankroll {Number(entry.bankroll)}€
                </p>
              </div>
            </div>

            {outcomes.length > 0 && (
              <div className="rounded-md overflow-hidden border border-border">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-secondary/50">
                      <th className="text-left py-1.5 px-3 font-mono text-muted-foreground font-medium">Issue</th>
                      <th className="text-left py-1.5 px-3 font-mono text-muted-foreground font-medium">Bookmaker</th>
                      <th className="text-right py-1.5 px-3 font-mono text-muted-foreground font-medium">Cote</th>
                      <th className="text-right py-1.5 px-3 font-mono text-muted-foreground font-medium">Mise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outcomes.map((o: any, j: number) => (
                      <tr key={j} className="border-t border-border/50">
                        <td className="py-1.5 px-3 text-foreground">{o.outcomeName}</td>
                        <td className="py-1.5 px-3 text-accent">{o.bookmaker}</td>
                        <td className="py-1.5 px-3 text-right font-mono text-primary">{Number(o.odds).toFixed(2)}</td>
                        <td className="py-1.5 px-3 text-right font-mono text-foreground">{Number(o.stakeRounded).toFixed(2)}€</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
