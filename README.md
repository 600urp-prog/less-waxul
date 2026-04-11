# SureBet Scanner

Application de détection de surebets (paris sûrs) en temps réel. Scanne les cotes de multiples bookmakers pour trouver des opportunités d'arbitrage garantissant un profit.

## 🚀 Fonctionnalités

- **Scan en temps réel** des cotes via l'API The Odds API
- **Détection automatique** de surebets avec calcul des mises optimales
- **Auto-scan** configurable (30s, 1m, 2m, 5m)
- **Filtres avancés** : sports, bookmakers, types de paris, bankroll, mode VIP
- **Liens directs** vers les bookmakers pour placer les paris
- **Historique** complet des surebets détectés
- **Dashboard admin** avec statistiques et graphiques
- **Interface responsive** (mobile + desktop)

## 📦 Dépendances principales

| Package | Version | Usage |
|---------|---------|-------|
| React | 18.x | Framework UI |
| Vite | 5.x | Build tool |
| TypeScript | 5.x | Typage statique |
| Tailwind CSS | 3.x | Styles utilitaires |
| shadcn/ui | - | Composants UI (Radix UI) |
| Supabase JS | 2.x | Backend (BDD + Edge Functions) |
| React Router | 6.x | Routing SPA |
| TanStack Query | 5.x | Cache & fetching |
| Recharts | 2.x | Graphiques |
| Framer Motion | 12.x | Animations |
| Sonner | 1.x | Notifications toast |
| Lucide React | 0.46x | Icônes |
| date-fns | 3.x | Manipulation de dates |
| Zod | 3.x | Validation de schémas |

## 🛠️ Prérequis

- **Node.js** 18+ (ou Bun 1.x)
- **npm**, **pnpm**, **yarn** ou **bun**
- Un projet **Supabase** avec les tables `admin_settings` et `surebet_history`
- Une clé API **The Odds API** (https://the-odds-api.com)

## ⚙️ Variables d'environnement

Créez un fichier `.env` à la racine :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=votre_anon_key
VITE_SUPABASE_PROJECT_ID=votre_project_id
```

## 🏗️ Installation locale

```bash
# Cloner le repo
git clone https://github.com/votre-user/surebet-scanner.git
cd surebet-scanner

# Installer les dépendances
npm install
# ou
bun install

# Lancer en développement
npm run dev
# ou
bun run dev
```

L'app sera disponible sur `http://localhost:5173`

## 📤 Déploiement

### Lovable (recommandé)

Cliquez sur **Publish** dans l'éditeur Lovable. Les Edge Functions se déploient automatiquement.

### Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Configurer les variables d'environnement dans le dashboard Vercel :
# VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_SUPABASE_PROJECT_ID
```

Ou connectez votre repo GitHub à Vercel pour un déploiement automatique à chaque push.

**Configuration Vercel** : Le framework est détecté automatiquement (Vite). Aucune configuration supplémentaire n'est nécessaire.

### Netlify

```bash
# Installer Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Déployer
netlify deploy --prod --dir=dist
```

Ou connectez votre repo GitHub à Netlify :
1. New site → Import from Git
2. Build command : `npm run build`
3. Publish directory : `dist`
4. Ajoutez les variables d'environnement dans Site settings → Environment variables

**Fichier `netlify.toml`** (optionnel, pour SPA routing) :
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub Pages

```bash
# Ajoutez dans vite.config.ts : base: '/nom-du-repo/'
npm run build
# Utilisez gh-pages ou GitHub Actions pour déployer le dossier dist/
```

### VPS (Nginx)

```bash
# Sur votre VPS
git clone https://github.com/votre-user/surebet-scanner.git
cd surebet-scanner

# Installer Node.js 18+ si nécessaire
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer et build
npm install
npm run build

# Le dossier dist/ contient les fichiers statiques à servir
```

**Configuration Nginx** :
```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    root /chemin/vers/surebet-scanner/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache statique
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Activer le site et recharger Nginx
sudo ln -s /etc/nginx/sites-available/surebet /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**HTTPS avec Let's Encrypt** :
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com
```

### VPS (Docker)

```dockerfile
# Dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

```bash
docker build -t surebet-scanner .
docker run -d -p 80:80 surebet-scanner
```

## 🗄️ Base de données

### Tables requises

**`admin_settings`** : Stocke la clé API et les paramètres de configuration.

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid | Clé primaire |
| key | text | Nom du paramètre |
| value | text | Valeur |
| updated_at | timestamp | Dernière mise à jour |

**`surebet_history`** : Historique des surebets détectés.

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid | Clé primaire |
| event_id | text | ID de l'événement |
| sport / sport_key | text | Sport |
| home_team / away_team | text | Équipes |
| market_type | text | Type de marché |
| outcomes | jsonb | Détails des cotes et mises |
| profit | numeric | Profit en € |
| profit_percent | numeric | % de profit |
| bankroll / total_stake | numeric | Mise totale |
| guaranteed_return | numeric | Retour garanti |
| commence_time | timestamp | Date du match |
| detected_at / created_at | timestamp | Date de détection |

## 📁 Structure du projet

```
src/
├── components/       # Composants UI
│   ├── ui/           # Composants shadcn/ui
│   ├── FilterPanel   # Panneau de filtres + auto-scan
│   ├── SurebetTable  # Tableau des surebets live
│   ├── HistoryTable  # Historique
│   ├── StatsBar      # Barre de statistiques
│   └── Header        # En-tête
├── contexts/         # React Context (état global)
├── hooks/            # Custom hooks
├── lib/              # Utilitaires, types, moteur de calcul
├── pages/            # Pages (Index, Admin, NotFound)
└── integrations/     # Client Supabase (auto-généré)
supabase/
└── functions/
    └── fetch-odds/   # Edge Function pour récupérer les cotes
```

## 📄 Licence

MIT
