import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { FilterPanel } from '@/components/FilterPanel';
import { SurebetTable } from '@/components/SurebetTable';
import { StatsBar } from '@/components/StatsBar';
import { HistoryTable } from '@/components/HistoryTable';
import { useSurebets } from '@/hooks/use-surebets';
import { useHistory } from '@/hooks/use-history';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, History } from 'lucide-react';

const Index = () => {
  const {
    filters,
    surebets,
    isScanning,
    lastScan,
    toggleSport,
    toggleBookmaker,
    toggleBetType,
    setBankroll,
    setMinProfit,
    toggleVipMode,
    scan,
    registerOnScanComplete,
  } = useSurebets();

  const { entries, isLoading, reload } = useHistory();

  useEffect(() => {
    registerOnScanComplete(reload);
  }, [registerOnScanComplete, reload]);

  return (
    <div className="min-h-screen bg-background grid-bg">
      <Header />
      
      <main className="container px-4 py-6">
        <StatsBar surebets={surebets} bankroll={filters.bankroll} />
        
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* Sidebar filters */}
          <aside className="rounded-lg border border-border bg-card p-4">
            <FilterPanel
              filters={filters}
              isScanning={isScanning}
              lastScan={lastScan}
              onToggleSport={toggleSport}
              onToggleBookmaker={toggleBookmaker}
              onToggleBetType={toggleBetType}
              onSetBankroll={setBankroll}
              onSetMinProfit={setMinProfit}
              onToggleVip={toggleVipMode}
              onScan={scan}
            />
          </aside>

          {/* Results with tabs */}
          <section>
            <Tabs defaultValue="live" className="w-full">
              <TabsList className="bg-secondary border border-border mb-4">
                <TabsTrigger value="live" className="font-mono text-xs uppercase tracking-wider data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
                  <Zap className="h-3 w-3 mr-1.5" />
                  Live
                </TabsTrigger>
                <TabsTrigger value="history" className="font-mono text-xs uppercase tracking-wider data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
                  <History className="h-3 w-3 mr-1.5" />
                  Historique ({entries.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="live">
                <SurebetTable surebets={surebets} isScanning={isScanning} />
              </TabsContent>
              <TabsContent value="history">
                <HistoryTable entries={entries} isLoading={isLoading} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
