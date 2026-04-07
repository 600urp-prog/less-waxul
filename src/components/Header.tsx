import { motion } from 'framer-motion';
import { Activity, Zap } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex items-center justify-between h-14 px-4">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="relative">
            <Zap className="h-6 w-6 text-primary" />
            <div className="absolute inset-0 blur-md bg-primary/30 rounded-full" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            SURE<span className="text-primary">BET</span>
          </h1>
          <span className="text-[10px] font-mono text-muted-foreground border border-border rounded px-1.5 py-0.5 uppercase tracking-widest">
            Scanner
          </span>
        </motion.div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Activity className="h-3 w-3 text-primary animate-pulse-glow" />
            <span>LIVE</span>
          </div>
        </div>
      </div>
    </header>
  );
}
