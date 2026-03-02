# 🤝 Système d'Affiliation - Guide d'utilisation

## 📋 Configuration requise

### 1. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/awafrost

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here

# Discord OAuth
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret

# Site Configuration
NEXT_PUBLIC_DISCORD_INVITE=https://discord.gg/your-invite-code
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Configuration Discord OAuth

1. Allez sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Créez une nouvelle application
3. Allez à "OAuth2" → "General"
4. Copiez le **Client ID** et **Client Secret**
5. Ajoutez une redirection OAuth: `http://localhost:3000/api/auth/callback/discord`

### 3. Configuration MongoDB

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un cluster
3. Obtenez la chaîne de connexion
4. Remplacez `username` et `password` par vos identifiants

## 🚀 Installation et démarrage

```bash
# Installer les dépendances
pnpm install

# Démarrer le serveur de développement
pnpm dev
```

L'application sera disponible sur `http://localhost:3000`

## 📚 Fonctionnalités

### 1. Authentification Discord
- Les utilisateurs se connectent avec leur compte Discord
- Les informations de compte sont automiquement enregistrées dans la base de données

### 2. Création d'affiliation
- Chaque utilisateur peut créer un lien d'affiliation unique
- Le code d'affiliation est généré automatiquement et de manière aléatoire

### 3. Profil d'affiliation personnalisé
Les utilisateurs peuvent modifier:
- ✅ Compte YouTube
- ✅ Compte Twitter/X
- ✅ Compte Roblox
- ✅ Jeux Roblox favoris (jusqu'à 3)
- ✅ Description du profil
- ❌ Compte Discord (immuable pour la sécurité)

### 4. Page d'affiliation publique
- Accessible via `/affiliate/[code]`
- Affiche le profil de l'affilié avec tous ses réseaux sociaux
- Badge "Partenaire officiel Sai Café"
- Bouton pour rejoindre le serveur Discord

### 5. Statistiques
Le système suit:
- **Visites totales**: Nombre total de visites sur la page d'affiliation
- **Visiteurs uniques**: Nombre de visiteurs uniques (vérifiés par IP+UserAgent)
- **Clics sur Discord**: Nombre de clics sur le bouton Discord
- **Clics uniques Discord**: Nombre de visiteurs uniques ayant cliqué sur Discord

**Sécurité**: Les statistiques utilisent un hash SHA256 de l'IP pour éviter les fraudes, sans stocker les IP en clair.

## 📂 Structure du projet

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts      # Routes NextAuth
│   │   ├── affiliate/
│   │   │   ├── route.ts                     # CRUD affiliations
│   │   │   └── public/route.ts              # Données publiques
│   │   └── stats/route.ts                   # Tracking statistiques
│   ├── auth/
│   │   ├── signin/page.tsx                  # Page de connexion
│   │   └── error/page.tsx                   # Page d'erreur
│   ├── dashboard/
│   │   └── affiliate/
│   │       ├── page.tsx                     # Tableau de bord
│   │       └── edit/page.tsx                # Édition du profil
│   └── affiliate/
│       └── [code]/page.tsx                  # Page d'affiliation publique
├── components/
│   └── affiliate-section.tsx                # Composant section affiliation
├── lib/
│   ├── auth.ts                              # Configuration NextAuth
│   └── db.ts                                # Connexion MongoDB
├── models/
│   ├── User.ts                              # Modèle utilisateur
│   ├── Affiliate.ts                         # Modèle affiliation
│   └── AffiliateStatistics.ts               # Modèle statistiques
└── types/
    └── next-auth.d.ts                       # Types NextAuth
```

## 🔐 Sécurité

- **Hachage des IP**: Les adresses IP sont hachées en SHA256
- **Vérification IP+UserAgent**: Empêche les clics/visites frauduleuses
- **Authentification Discord**: Sécure via OAuth2
- **Données sensibles**: Les statistiques détaillées ne sont pas exposées publiquement

## 🎯 Routes principales

| Route | Description |
|-------|-------------|
| `/auth/signin` | Page de connexion Discord |
| `/dashboard/affiliate` | Tableau de bord utilisateur |
| `/dashboard/affiliate/edit` | Éditer le profil d'affiliation |
| `/affiliate/[code]` | Page publique d'affiliation |
| `/api/affiliate` | API CRUD affiliations |
| `/api/stats` | API statistiques |

## 📝 Notes

- Les utilisateurs peuvent créer qu'une seule affiliation par compte Discord
- Le code d'affiliation ne peut pas être changé après création
- Le serveur Discord invite ne peut pas être changé (configuré via env)
- Les statistiques sont conservées indéfiniment
- Les enregistrements de visiteurs expirent après 30 jours (TTL)

## 🆘 Dépannage

### Erreur de connexion MongoDB
- Vérifiez que `MONGODB_URI` est correct
- Vérifiez les autorisations IP dans MongoDB Atlas
- Vérifiez que les identifiants sont corrects

### Erreur d'authentification Discord
- Vérifiez que `DISCORD_CLIENT_ID` et `DISCORD_CLIENT_SECRET` sont corrects
- Vérifiez l'URL de redirection dans Discord Developer Portal
- Vérifiez que `NEXTAUTH_SECRET` est défini

### Erreur de session
- Vérifiez que `NEXTAUTH_URL` correspond à votre URL
- Vérifiez que `SessionProvider` est enveloppé dans le layout
