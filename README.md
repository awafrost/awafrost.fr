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
const GROUP_ID = 13212005;
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

### Vercel (Recommandé)

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
