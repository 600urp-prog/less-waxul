import { Header } from '@/components/Header';
import { FilterPanel } from '@/components/FilterPanel';
import { SurebetTable } from '@/components/SurebetTable';
import { StatsBar } from '@/components/StatsBar';
import { useSurebets } from '@/hooks/use-surebets';

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
  } = useSurebets();

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

          {/* Results */}
          <section>
            <SurebetTable surebets={surebets} isScanning={isScanning} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
