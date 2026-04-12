import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { useAdminSettings } from '@/hooks/use-admin-settings';
import { useAdminStats } from '@/hooks/use-admin-stats';
import { fetchHistory, deleteAllHistory, deleteHistoryEntry, HistoryEntry } from '@/lib/history-service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3, Settings, Key, Clock, TrendingUp, Zap, RefreshCw,
  Activity, Eye, EyeOff, Save, ArrowLeft, Trash2, History
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

const Admin = () => {
  const { settings, isLoading: settingsLoading, isSaving, updateSetting } = useAdminSettings();
  const { stats, isLoading: statsLoading, reload: reloadStats } = useAdminStats();
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [localApiKey, setLocalApiKey] = useState('');
  const [localInterval, setLocalInterval] = useState<number | null>(null);
  const [apiKeyLoaded, setApiKeyLoaded] = useState(false);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    const data = await fetchHistory(200);
    setHistoryEntries(data);
    setHistoryLoading(false);
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  const handleDeleteAll = async () => {
    const ok = await deleteAllHistory();
    if (ok) { toast.success('Historique supprimé'); loadHistory(); reloadStats(); }
    else toast.error('Erreur lors de la suppression');
  };

  const handleDeleteEntry = async (id: string) => {
    const ok = await deleteHistoryEntry(id);
    if (ok) { setHistoryEntries(e => e.filter(x => x.id !== id)); reloadStats(); }
    else toast.error('Erreur lors de la suppression');
  };

  // Sync local state when settings load
  if (!settingsLoading && !apiKeyLoaded) {
    setLocalApiKey(settings.odds_api_key);
    setLocalInterval(parseInt(settings.polling_interval));
    setApiKeyLoaded(true);
  }

  const handleSaveApiKey = async () => {
    await updateSetting('odds_api_key', localApiKey);
    toast.success('Clé API sauvegardée');
  };

  const handleSaveInterval = async (val: number) => {
    setLocalInterval(val);
    await updateSetting('polling_interval', String(val));
    toast.success(`Intervalle mis à jour : ${val}s`);
  };

  const handleToggleAutoScan = async (checked: boolean) => {
    await updateSetting('auto_scan', String(checked));
    toast.success(checked ? 'Scan automatique activé' : 'Scan automatique désactivé');
  };

  const chartConfig = {
    count: { label: 'Surebets', color: 'hsl(var(--primary))' },
    profit: { label: 'Profit (€)', color: 'hsl(var(--accent))' },
  };

  const intervalOptions = [10, 15, 20, 30, 45, 60, 90, 120, 180, 240, 300];

  return (
    <div className="min-h-screen bg-background grid-bg">
      <Header />

      <main className="container px-4 py-6 max-w-5xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
              Admin Panel
            </h1>
            <p className="text-xs text-muted-foreground">Gestion du scanner de surebets</p>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="bg-secondary border border-border mb-6 w-full justify-start">
            <TabsTrigger value="dashboard" className="font-mono text-xs uppercase tracking-wider data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
              <BarChart3 className="h-3 w-3 mr-1.5" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="api" className="font-mono text-xs uppercase tracking-wider data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
              <Key className="h-3 w-3 mr-1.5" />
              API
            </TabsTrigger>
            <TabsTrigger value="settings" className="font-mono text-xs uppercase tracking-wider data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
              <Settings className="h-3 w-3 mr-1.5" />
              Paramètres
            </TabsTrigger>
            <TabsTrigger value="history" className="font-mono text-xs uppercase tracking-wider data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
              <History className="h-3 w-3 mr-1.5" />
              Historique
            </TabsTrigger>
          </TabsList>

          {/* DASHBOARD TAB */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground font-mono uppercase">Total Surebets</span>
                  </div>
                  <p className="text-2xl font-bold font-mono text-foreground">
                    {statsLoading ? '...' : stats.totalSurebets}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground font-mono uppercase">Profit Total</span>
                  </div>
                  <p className="text-2xl font-bold font-mono text-foreground">
                    {statsLoading ? '...' : `€${stats.totalProfit}`}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="h-4 w-4 text-accent" />
                    <span className="text-xs text-muted-foreground font-mono uppercase">Moy. Profit %</span>
                  </div>
                  <p className="text-2xl font-bold font-mono text-foreground">
                    {statsLoading ? '...' : `${stats.avgProfitPercent}%`}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4" style={{ color: 'hsl(var(--warning))' }} />
                    <span className="text-xs text-muted-foreground font-mono uppercase">Aujourd'hui</span>
                  </div>
                  <p className="text-2xl font-bold font-mono text-foreground">
                    {statsLoading ? '...' : stats.todaySurebets}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono uppercase tracking-wider">Surebets par jour</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.dailyData.length > 0 ? (
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                      <BarChart data={stats.dailyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
                      Aucune donnée disponible
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono uppercase tracking-wider">Profit par jour (€)</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.dailyData.length > 0 ? (
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                      <LineChart data={stats.dailyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="profit" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ fill: 'hsl(var(--accent))' }} />
                      </LineChart>
                    </ChartContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
                      Aucune donnée disponible
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={reloadStats} className="font-mono text-xs border-border">
                <RefreshCw className="h-3 w-3 mr-1.5" />
                Rafraîchir
              </Button>
            </div>
          </TabsContent>

          {/* API TAB */}
          <TabsContent value="api">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-mono uppercase tracking-wider flex items-center gap-2">
                  <Key className="h-4 w-4 text-primary" />
                  The Odds API
                </CardTitle>
                <CardDescription className="text-xs">
                  Clé d'accès pour récupérer les cotes en temps réel depuis the-odds-api.com
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-mono uppercase text-muted-foreground">Clé API</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={apiKeyVisible ? 'text' : 'password'}
                        value={localApiKey}
                        onChange={e => setLocalApiKey(e.target.value)}
                        placeholder="Entrez votre clé API OddsAPI..."
                        className="pr-10 font-mono text-sm bg-secondary border-border"
                      />
                      <button
                        type="button"
                        onClick={() => setApiKeyVisible(!apiKeyVisible)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {apiKeyVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <Button onClick={handleSaveApiKey} disabled={isSaving} className="font-mono text-xs">
                      <Save className="h-3 w-3 mr-1.5" />
                      Sauvegarder
                    </Button>
                  </div>
                </div>

                <div className="rounded-md bg-secondary/50 border border-border p-3">
                  <p className="text-xs text-muted-foreground">
                    💡 Obtenez votre clé gratuite sur{' '}
                    <a href="https://the-odds-api.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      the-odds-api.com
                    </a>
                    {' '}— Plan gratuit : 500 requêtes/mois.
                  </p>
                </div>

                {/* API Status */}
                <div className="space-y-2">
                  <Label className="text-xs font-mono uppercase text-muted-foreground">Statut API</Label>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${settings.odds_api_key ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="text-sm text-muted-foreground">
                      {settings.odds_api_key ? 'Clé configurée' : 'Aucune clé configurée'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings">
            <div className="space-y-4">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-mono uppercase tracking-wider flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Intervalle de scan
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Fréquence des requêtes à l'API pour détecter les surebets
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 gap-2">
                    {intervalOptions.map(val => (
                      <Button
                        key={val}
                        variant={(localInterval ?? parseInt(settings.polling_interval)) === val ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleSaveInterval(val)}
                        className="font-mono text-xs border-border"
                      >
                        {val >= 60 ? `${val / 60}min` : `${val}s`}
                        {val}s
                      </Button>
                    ))}
                  </div>
                  <div className="rounded-md bg-secondary/50 border border-border p-3">
                    <p className="text-xs text-muted-foreground">
                      ⚠️ Un intervalle plus court consomme plus de requêtes API. Plan gratuit = 500 req/mois.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-mono uppercase tracking-wider flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-primary" />
                    Scan automatique
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Lancer automatiquement le scan à l'ouverture de l'application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Activer le scan auto</span>
                    <Switch
                      checked={settings.auto_scan === 'true'}
                      onCheckedChange={handleToggleAutoScan}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
