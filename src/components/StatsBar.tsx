import { motion } from 'framer-motion';
import { Surebet } from '@/lib/types';
import { TrendingUp, DollarSign, BarChart3, Zap } from 'lucide-react';

interface StatsBarProps {
  surebets: Surebet[];
  bankroll: number;
}

export function StatsBar({ surebets, bankroll }: StatsBarProps) {
  const totalProfit = surebets.reduce((s, sb) => s + sb.profit, 0);
  const avgProfit = surebets.length > 0 ? surebets.reduce((s, sb) => s + sb.profitPercent, 0) / surebets.length : 0;
  const bestProfit = surebets.length > 0 ? Math.max(...surebets.map(sb => sb.profitPercent)) : 0;

  const stats = [
    { icon: Zap, label: 'Surebets', value: surebets.length.toString(), color: 'text-primary' },
    { icon: TrendingUp, label: 'Meilleur', value: `${bestProfit.toFixed(2)}%`, color: 'text-profit-high' },
    { icon: BarChart3, label: 'Moyenne', value: `${avgProfit.toFixed(2)}%`, color: 'text-profit' },
    { icon: DollarSign, label: 'Profit total', value: `${totalProfit.toFixed(2)}€`, color: 'text-warning' },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {stats.map((stat, i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-3 flex items-center gap-3">
          <stat.icon className={`h-4 w-4 ${stat.color} shrink-0`} />
          <div className="min-w-0">
            <p className="text-[10px] font-mono uppercase text-muted-foreground truncate">{stat.label}</p>
            <p className={`text-sm font-bold font-mono ${stat.color}`}>{stat.value}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
