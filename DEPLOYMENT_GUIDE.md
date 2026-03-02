# 🚀 Déploiement - Guide de mise en production

## Prérequis

- Vercel (ou votre plateforme de déploiement préférée)
- MongoDB Atlas (ou autre service MongoDB)
- Discord Developer Application

---

## Étape 1: Préparation MongoDB

### Sur MongoDB Atlas:
1. Créez un cluster (ou utilisez un existant)
2. Créez une nouvelle base de données: `awafrost`
3. Allez à "Network Access" et autorisez tous les IPs (`0.0.0.0/0`)
4. Allez à "Database Access" et créez un utilisateur avec tous les rôles
5. Copiez la chaîne de connexion

### Format:
```
mongodb+srv://username:password@cluster.mongodb.net/awafrost?retryWrites=true&w=majority
```

---

## Étape 2: Configurer Discord OAuth pour la production

1. Allez sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Allez à "OAuth2" → "General"
3. Ajoutez les URLs de redirection de production:
   ```
   https://votre-domaine.com/api/auth/callback/discord
   https://votre-domaine.com/
   ```
4. Copiez `Client ID` et `Client Secret`

---

## Étape 3: Générer NEXTAUTH_SECRET

Générez une clé secrète sécurisée:

```bash
# Option 1: Avec Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Avec openssl
openssl rand -hex 32
```

---

## Étape 4: Configuration Vercel

### Via interface web:
1. Importez le dépôt GitHub sur Vercel
2. Allez à "Settings" → "Environment Variables"
3. Ajoutez les variables:

```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=https://votre-domaine.com
NEXTAUTH_SECRET=votre-clé-secrète-générée
DISCORD_CLIENT_ID=your-client-id
DISCORD_CLIENT_SECRET=your-client-secret
NEXT_PUBLIC_DISCORD_INVITE=https://discord.gg/your-code
NEXT_PUBLIC_SITE_URL=https://votre-domaine.com
```

4. Cliquez sur "Deploy"

### Via CLI:
```bash
vercel env add MONGODB_URI
vercel env add NEXTAUTH_SECRET
# ... etc
vercel deploy
```

---

## Étape 5: Configuration du domaine personnalisé (optionnel)

1. Dans Vercel, allez à "Settings" → "Domains"
2. Ajoutez votre domaine personnalisé
3. Suivez les instructions pour configurer les DNS

---

## Étape 6: Vérification après déploiement

1. Visitez `https://votre-domaine.com/auth/signin`
2. Testez la connexion Discord
3. Créez une affiliation de test
4. Vérifiez les données dans MongoDB Atlas

---

## 🔒 Sécurité en production

### Checklist:
- ✅ NEXTAUTH_SECRET est unique et sécurisé (32+ caractères)
- ✅ Toutes les variables d'environnement sont configurées
- ✅ MongoDB Atlas n'expose que les ports nécessaires
- ✅ Les URLs de redirection Discord correspondent au domaine
- ✅ HTTPS est activé (Vercel par défaut)
- ✅ Les cookies NextAuth utilisent `Secure` et `SameSite`

### Variables sensibles:
- Ne commitez JAMAIS `.env.local` sur GitHub
- Utilisez `.env.example` pour documenter les variables
- Régénérez NEXTAUTH_SECRET périodiquement

---

## 📊 Optimisations pour la production

### 1. Database Indexes
```javascript
// Run dans MongoDB
use awafrost;

// Index sur affiliateCode
db.affiliates.createIndex({ affiliateCode: 1 }, { unique: true })

// Index sur userId
db.affiliates.createIndex({ userId: 1 }, { unique: true })

// Index sur discordId des Users
db.users.createIndex({ discordId: 1 }, { unique: true })

// Index TTL pour nettoyer les vieux visiteurs
db.affiliatestatistics.createIndex(
  { "visitors.timestamp": 1 },
  { expireAfterSeconds: 2592000 }
)
```

### 2. Compression
Vercel active gzip automatiquement - aucune configuration nécessaire.

### 3. Caching
Dans `next.config.js`:
```javascript
module.exports = {
  headers: async () => {
    return [
      {
        source: '/affiliate/:slug',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=120',
          },
        ],
      },
    ];
  },
};
```

### 4. Analytics
Configurez des analytics sur Vercel:
1. Settings → Analytics → Enable Analytics
2. Consultez les métriques en temps réel

---

## 🔧 Maintenance

### Sauvegarde MongoDB
```bash
# Créez des sauvegardes automatiques dans MongoDB Atlas
# Settings → Backup & Restore → Configure Backup
```

### Monitoring
- Utilisez Vercel Analytics pour les performances
- Configurez des alertes MongoDB Atlas pour les avertissements
- Surveillez les logs avec `vercel logs`

### Updates
```bash
# Pour mettre à jour les dépendances
pnpm up
git add -A
git commit -m "chore: update dependencies"
git push
# Auto-redéploie sur Vercel
```

---

## 📈 Scaling

Si vous prévoyez une grosse croissance:

### 1. Utilisez MongoDB Sharding
```javascript
// MongoDB Atlas offre le sharding automatique
// Settings → Sharding → Enable Sharding
```

### 2. Ajoutez Redis pour le caching
```javascript
// Dans lib/cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

export async function cacheAffiliate(code: string) {
  const cached = await redis.get(`affiliate:${code}`);
  if (cached) return JSON.parse(cached);
  
  // Fetch from DB and cache
}
```

### 3. Optimisez les requêtes
- Utilisez les indexes MongoDB correctement
- Paginatez les statistiques détaillées
- Archivez les vieilles données

---

## ❌ Dépannage en production

### Erreur "Invalid credentials"
```
Vérifiez DISCORD_CLIENT_ID et DISCORD_CLIENT_SECRET
Vérifiez que l'URL de redirection est correcte dans Discord
```

### Erreur "Connection timeout MongoDB"
```
Vérifiez MONGODB_URI
Vérifiez Network Access dans MongoDB Atlas
Vérifiez la limite de connexions
```

### Errors avec les cookies
```
Vérifiez que NEXTAUTH_URL inclut le protocole https
Vérifiez que le domaine est correct
```

### Erreurs 404 sur les pages statiques
```
Vercel peut cacher les pages dynamiques
Allez à Settings → Preview Deployment → On-demand ISR
```

---

## 📞 Support

En cas de problème:
1. Consultez [Vercel Docs](https://vercel.com/docs)
2. Consultez [Next.js Docs](https://nextjs.org/docs)
3. Consultez [NextAuth Docs](https://next-auth.js.org/getting-started/introduction)
4. Consultez [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

---

## ✅ Checklist final

- ✅ Configuration MongoDB réussie
- ✅ Discord OAuth configuré
- ✅ Variables d'environnement définies
- ✅ Déploiement Vercel réussi
- ✅ Tests en production réussis
- ✅ Domaine personnalisé configuré (si applicable)
- ✅ Backups automatiques activés
- ✅ Monitoring et alertes configurés
