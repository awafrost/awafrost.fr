# ❄️ Frost - Portfolio Roblox

Une plateforme moderne et épurée pour explorer le monde de Roblox à travers le profil de Frost.

![Modern Design](https://img.shields.io/badge/Design-Modern%20%26%20Clean-blue)
![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2013-black)
![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-06B6D4)

## 🚀 Caractéristiques

- **Profil Roblox Intégré** - Affichage en temps réel du profil Roblox avec avatar 3D
- **Design Moderne** - Interface épurée avec gradients et animations fluides
- **Responsive** - Optimisé pour tous les appareils (mobile, tablet, desktop)
- **Dark Mode** - Toggle thème clair/sombre
- **Performance** - Optimisé et léger, chargement rapide
- **Jeux Favoris** - Galerie des jeux préférés
- **Groupe Roblox** - Affichage du groupe principal

## 📋 Pré-requis

- Node.js 18+
- pnpm (ou npm/yarn)

## 🛠️ Installation

```bash
# 1. Cloner le repository
git clone <your-repo-url>
cd awafrost.fr

# 2. Installer les dépendances
pnpm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local

# 4. Lancer le serveur de développement
pnpm dev

# 5. Ouvrir http://localhost:3000
```

## 📝 Configuration

### Variables d'environnement (.env.local)

```env
# Optionnel - pour le déploiement Vercel
NEXT_PUBLIC_VERCEL_URL=votre-domaine.com
PORT=3000
```

### Personnaliser le profil

Éditer `src/app/page.tsx` pour modifier:

```typescript
// Changez ces IDs pour personnaliser votre profil
const ROBLOX_USER_ID = '1743461749';
const FAVORITE_GAMES = [286090429, 606849621, 142823291];
const GROUP_ID = 677727451;
```

Et `src/config/site.ts` pour les métadonnées:

```typescript
export const siteConfig: SiteConfig = {
  metadata: {
    name: 'Frost',
    description: 'Une petite pomme pour celui du fond',
    twitter_id: '@awafrost',
    url: new URL('https://votre-domaine.com'),
  },
};
```

## 🎨 Personnalisation

### Couleurs et Thème

Le design utilise **Tailwind CSS**. Modifiez `tailwind.config.js` pour ajuster les couleurs.

### Composants

Les composants réutilisables sont dans `src/components/`:

- `roblox-avatar-3d.tsx` - Avatar Roblox 3D
- `roblox-profile.tsx` - Profil et statistiques Roblox
- `group-card.tsx` - Carte du groupe
- `favorites-games.tsx` - Galerie des jeux favoris
- `theme-toggle.tsx` - Toggle thème
- `animation.tsx` - Animations d'entrée

## 📦 Structure du Projet

```
src/
├── app/
│   ├── layout.tsx          # Layout global
│   ├── page.tsx            # Page d'accueil principale
│   ├── globals.css         # Styles globaux
│   ├── provider.tsx        # Providers (Theme, etc.)
│   ├── robots.ts           # SEO robots.txt
│   └── sitemap.ts          # SEO sitemap
├── components/             # Composants réutilisables
├── config/                 # Configuration (site.ts)
├── lib/                    # Utilitaires
├── types/                  # Types TypeScript
└── public/                 # Assets statiques

```

## 🚀 Déploiement

### Valeurs Murder Mystery 2

Le dossier `MM2 Values/` contient le collecteur et son snapshot de secours. Le workflow GitHub Actions `Refresh local MM2 values` lit directement les pages Supreme Values toutes les 10 minutes, 24 h/24, met à jour `data/mm2-values.json` et commit uniquement si les données changent. Vercel déploie ensuite ce fichier avec le site : les visiteurs et l’API du site ne contactent ni le dépôt de données ni la source Supreme. GitHub peut retarder un job planifié et la cadence dépend aussi de la publication de la source; ce n’est donc pas du temps réel à la seconde.

Pour lancer une mise à jour manuellement sur un poste local :

```powershell
Push-Location 'MM2 Values'
npm ci
npx playwright install chromium
Pop-Location
pnpm mm2:login
pnpm mm2:refresh
```

`pnpm mm2:login` ouvre Chromium afin de résoudre, si Supreme affiche un challenge interactif, et enregistre la session dans `MM2 Values/data/browser-state.json`. Si la page se charge après cette validation, exécute localement la commande ci-dessous et colle son résultat directement dans **GitHub → Settings → Secrets and variables → Actions** sous le nom `MM2_BROWSER_STORAGE_STATE_B64` :

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes('MM2 Values/data/browser-state.json'))
```

Ne commite pas ce fichier et ne partage pas sa valeur dans un chat. Les cookies peuvent expirer; refais `pnpm mm2:login` et mets à jour le secret. Si Cloudflare refuse l’adresse IP du runner avec HTTP 403, les cookies ne suffiront pas : il faut une autorisation/allowlist de Supreme ou une source de valeurs autorisée différente.

Pour recopier sans relancer Chromium le dernier snapshot déjà collecté, utiliser `pnpm mm2:sync`. Si la source ne répond pas ou si une collecte est incomplète, le dernier snapshot valide est conservé. Les entrées Godly sentinelles Batwing, Black Luger et Mortal Blade sont écartées lors de la synchronisation.

### Vercel (Recommandé)

Les giveaways utilisent Vercel Postgres. Après avoir créé une base depuis l’intégration Vercel, ajoutez automatiquement ses variables d’environnement au projet, puis configurez aussi :

```env
ADMIN_USERNAME=awa
ADMIN_PASSWORD=101010
ADMIN_SESSION_SECRET=une-valeur-secrete-longue
```

La page d’administration est disponible sur `/admin/giveaways`. Les images des giveaways sont fournies via une URL HTTPS.

```bash
# 1. Push sur GitHub
git push origin main

# 2. Connecter sur Vercel
# - Allez sur https://vercel.com
# - Importez votre repository
# - Vercel déploie automatiquement

# 3. Configurer le domaine personnalisé
# - Settings > Domains
# - Ajoutez votre domaine
```

### Autre Hébergement

```bash
# Build pour la production
pnpm build

# Démarrer le serveur
pnpm start
```

## 🔧 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Démarrer le serveur de développement |
| `pnpm build` | Construire pour la production |
| `pnpm start` | Démarrer le serveur de production |
| `pnpm lint` | Vérifier le code |

## 📱 Réseaux Sociaux

- **YouTube**: [@awafrost](https://www.youtube.com/@awafrost)
- **Twitter**: [@awafrost](https://twitter.com/awafrost)
- **Discord**: [Rejoindre le serveur](https://discord.gg/WgBTgHyjag)
- **Roblox**: [Profil Roblox](https://www.roblox.com/users/1743461749/profile)

## 🛠️ Technos Utilisées

- **Frontend Framework**: [Next.js 13](https://nextjs.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Components**: [shadcn/ui](https://ui.shadcn.com)
- **Animations**: [Framer Motion](https://www.framer.com/motion)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)

## 📄 Licence

MIT License - voir [LICENSE](LICENSE) pour plus de détails

## 🤝 Support

Pour toute question ou problème:

1. Vérifiez la [documentation](README.md)
2. Consultez les [issues GitHub](https://github.com/awafrost/portfolio/issues)
3. Rejoignez notre [Discord](https://discord.gg/WgBTgHyjag)

---

**Fait avec ❄️ par Frost**
