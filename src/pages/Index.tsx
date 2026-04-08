import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { FilterPanel } from '@/components/FilterPanel';
import { SurebetTable } from '@/components/SurebetTable';
import { StatsBar } from '@/components/StatsBar';
import { HistoryTable } from '@/components/HistoryTable';
import { useSurebets } from '@/hooks/use-surebets';
import { useHistory } from '@/hooks/use-history';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Zap, History, SlidersHorizontal } from 'lucide-react';

const Index = () => {
  const isMobile = useIsMobile();
  const [filtersOpen, setFiltersOpen] = useState(false);

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

  const filterPanel = (
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
  );

  return (
    <div className="min-h-screen bg-background grid-bg">
      <Header />
      
      <main className="container px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <StatsBar surebets={surebets} bankroll={filters.bankroll} />
          </div>
          {isMobile && (
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 border-border">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="font-mono text-sm uppercase tracking-wider">Filtres</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  {filterPanel}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
        
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* Sidebar filters - desktop only */}
          {!isMobile && (
            <aside className="rounded-lg border border-border bg-card p-4">
              {filterPanel}
            </aside>
          )}

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
