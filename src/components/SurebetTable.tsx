import { motion, AnimatePresence } from 'framer-motion';
import { Surebet } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, ExternalLink } from 'lucide-react';
import { getBookmakerUrl } from '@/lib/bookmaker-urls';

interface SurebetTableProps {
  surebets: Surebet[];
  isScanning: boolean;
}

export function SurebetTable({ surebets, isScanning }: SurebetTableProps) {
  if (isScanning) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </div>
        <p className="text-sm font-mono text-muted-foreground">Analyse des cotes en cours...</p>
      </div>
    );
  }

  if (surebets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <TrendingUp className="h-12 w-12 text-muted-foreground/30" />
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">Aucun surebet détecté</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Les surebets sont rares — essayez de modifier vos filtres
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          {surebets.length} surebet{surebets.length > 1 ? 's' : ''} détecté{surebets.length > 1 ? 's' : ''}
        </h2>
      </div>

      <AnimatePresence mode="popLayout">
        {surebets.map((sb, i) => (
          <SurebetCard key={sb.id} surebet={sb} index={i} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function SurebetCard({ surebet, index }: { surebet: Surebet; index: number }) {
  const sportEmoji = surebet.sportKey === 'soccer' ? '⚽' : surebet.sportKey === 'tennis' ? '🎾' : '🏀';
  const date = new Date(surebet.commenceTime);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{sportEmoji}</span>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {surebet.homeTeam} vs {surebet.awayTeam}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-border text-muted-foreground">
                {surebet.marketType}
              </Badge>
              <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" />
                {date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className={`text-lg font-bold font-mono ${surebet.profitPercent >= 2 ? 'text-profit-high' : 'text-profit'} glow-text`}>
            +{surebet.profitPercent.toFixed(2)}%
          </p>
          <p className="text-[10px] font-mono text-muted-foreground">
            {surebet.profit.toFixed(2)}€ profit
          </p>
        </div>
      </div>

      {/* Outcomes table */}
      <div className="rounded-md overflow-hidden border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-secondary/50">
              <th className="text-left py-1.5 px-3 font-mono text-muted-foreground font-medium">Issue</th>
              <th className="text-left py-1.5 px-3 font-mono text-muted-foreground font-medium">Bookmaker</th>
              <th className="text-right py-1.5 px-3 font-mono text-muted-foreground font-medium">Cote</th>
              <th className="text-right py-1.5 px-3 font-mono text-muted-foreground font-medium">Mise</th>
              <th className="text-right py-1.5 px-3 font-mono text-muted-foreground font-medium">Retour</th>
            </tr>
          </thead>
          <tbody>
            {surebet.outcomes.map((o, i) => (
              <tr key={i} className="border-t border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="py-1.5 px-3 text-foreground font-medium">{o.outcomeName}</td>
                <td className="py-1.5 px-3">
                  {(() => {
                    const url = getBookmakerUrl(o.bookmakerKey || '');
                    return url ? (
                      <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-accent hover:text-primary transition-colors hover:underline">
                        {o.bookmaker}
                        <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-accent">
                        {o.bookmaker}
                      </span>
                    );
                  })()}
                </td>
                <td className="py-1.5 px-3 text-right font-mono text-primary font-semibold">
                  {o.odds.toFixed(2)}
                </td>
                <td className="py-1.5 px-3 text-right font-mono text-foreground">
                  {o.stakeRounded.toFixed(2)}€
                </td>
                <td className="py-1.5 px-3 text-right font-mono text-profit">
                  {(o.stakeRounded * o.odds).toFixed(2)}€
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
        <span className="text-[10px] font-mono text-muted-foreground">
          Mise totale : <span className="text-foreground">{surebet.totalStake.toFixed(2)}€</span>
        </span>
        <span className="text-[10px] font-mono text-muted-foreground">
          Retour garanti : <span className="text-profit">{surebet.guaranteedReturn.toFixed(2)}€</span>
        </span>
      </div>
    </motion.div>
  );
}
