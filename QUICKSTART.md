# 🚀 Démarrage Rapide - Système d'Affiliation

## ⏱️ 5 minutes pour commencer

### Étape 1: Créer les variables d'environnement (1 min)
```bash
# Copier le template
cp .env.example .env.local

# Éditer le fichier (remplacer les valeurs)
# - MONGODB_URI
# - DISCORD_CLIENT_ID et DISCORD_CLIENT_SECRET
# - NEXTAUTH_SECRET
```

### Étape 2: Générer la clé secrète (30 sec)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Collez la valeur dans `NEXTAUTH_SECRET` dans `.env.local`

### Étape 3: Installer les dépendances (3 min)
```bash
pnpm install
```

### Étape 4: Lancer le serveur (30 sec)
```bash
pnpm dev
```

Visitez: `http://localhost:3000/auth/signin`

---

## 🔧 Configuration Discord (10 minutes)

### 1. Créer une application
- Allez sur [Discord Developer Portal](https://discord.com/developers/applications)
- Cliquez "New Application"
- Donnez-lui un nom
- Acceptez les conditions

### 2. Configurer OAuth2
- Allez à "OAuth2" → "General"
- Copiez `Client ID`
- Cliquez "Regenerate Secret"
- Copiez `Client Secret`

### 3. Ajouter l'URL de redirection
- Scroll down to "Redirects"
- Cliquez "+ Add Redirect"
- Entrez: `http://localhost:3000/api/auth/callback/discord`
- Cliquez "Save Changes"

### 4. Copier les valeurs
```env
DISCORD_CLIENT_ID=votre-client-id
DISCORD_CLIENT_SECRET=votre-client-secret
```

---

## 💾 Configuration MongoDB (5 minutes)

### 1. Créer un compte
- Allez sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Créez un compte gratuit

### 2. Créer un cluster
- Cliquez "Create a Deployment"
- Choisissez "Free" (M0)
- Sélectionnez votre région
- Cliquez "Create Deployment"

### 3. Créer un utilisateur
- Allez à "Database Access"
- Cliquez "+ Add New Database User"
- Entrez un username et password
- Cliquez "Create User"

### 4. Obtenir la chaîne de connexion
- Allez à "Database Deployments"
- Cliquez "Connect"
- Sélectionnez "Drivers"
- Copiez la chaîne (Node.js)
- Remplacez `username` et `password`

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/awafrost?retryWrites=true&w=majority
```

### 5. Autoriser toutes les IPs
- Allez à "Network Access"
- Cliquez "Add IP Address"
- Sélectionnez "Allow from anywhere"
- Confirmez

---

## ✅ Vérification d'installation

```bash
# Terminal 1: Serveur de développement
pnpm dev

# Terminal 2: Vérifier les variables
node -e "console.log(process.env.MONGODB_URI ? '✅ MONGODB OK' : '❌ MONGODB NON CONFIG')"
```

Visitez `http://localhost:3000`:
- [ ] La page de connexion Discord s'affiche
- [ ] Vous pouvez cliquer "Connexion avec Discord"
- [ ] Vous êtes redirigé vers Discord
- [ ] Après approbation, vous êtes redirigé au dashboard

---

## 🧪 Test complet du système

### 1. Connexion
```
1. Visitez http://localhost:3000/auth/signin
2. Cliquez "Connexion avec Discord"
3. Autorisez l'application
```

### 2. Créer une affiliation
```
1. Vous êtes redirigé au dashboard
2. Le bouton "Créer mon affiliation" s'affiche
3. Cliquez pour créer
4. Votre lien d'affiliation est généré
```

### 3. Éditer le profil
```
1. Cliquez "Éditer mon profil d'affiliation"
2. Remplissez:
   - Compte YouTube
   - Compte Twitter
   - Compte Roblox
   - 1-3 jeux favoris
3. Cliquez "Sauvegarder les modifications"
```

### 4. Voir la page publique
```
1. Copiez votre lien d'affiliation
2. Ouvrez-le dans un nouvel onglet
3. Vous voyez votre profil public
4. Cliquez "Rejoindre le serveur Discord"
```

### 5. Voir les statistiques
```
1. Retour au /dashboard/affiliate
2. Vous voyez les stats:
   - Visites totales: 1
   - Visiteurs uniques: 1
3. Cliquez Discord: les stats augmentent
```

---

## 📂 Structure du projet après installation

```
awafrost-master/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── affiliate/
│   │   │   │   ├── route.ts
│   │   │   │   └── public/route.ts
│   │   │   └── stats/route.ts
│   │   ├── auth/signin/page.tsx
│   │   ├── dashboard/affiliate/
│   │   │   ├── page.tsx
│   │   │   └── edit/page.tsx
│   │   └── affiliate/[code]/page.tsx
│   ├── components/affiliate-section.tsx
│   ├── hooks/
│   │   ├── useAffiliate.ts
│   │   └── useStats.ts
│   ├── lib/
│   │   ├── auth.ts
│   │   └── db.ts
│   ├── models/
│   │   ├── Affiliate.ts
│   │   ├── AffiliateStatistics.ts
│   │   └── User.ts
│   └── types/next-auth.d.ts
├── .env.local (créé par vous)
├── .env.example
└── package.json
```

---

## 🆘 Dépannage rapide

### "Impossible de se connecter à MongoDB"
```
✓ Vérifiez MONGODB_URI dans .env.local
✓ Vérifiez Network Access → Allow from anywhere
✓ Vérifiez le mot de passe (caractères spéciaux échappés?)
```

### "Erreur OAuth Discord"
```
✓ Vérifiez DISCORD_CLIENT_ID et DISCORD_CLIENT_SECRET
✓ Vérifiez l'URL de redirection: http://localhost:3000/api/auth/callback/discord
✓ Vérifiez NEXTAUTH_URL=http://localhost:3000
```

### "sessionNotFound"
```
✓ Vérifiez que NEXTAUTH_SECRET est défini
✓ Régénérez NEXTAUTH_SECRET
✓ Videz les cookies et reconnectez-vous
```

### Les variables d'environnement ne chargent pas
```
✓ Vérifiez le nom du fichier: .env.local (pas .env)
✓ Redémarrez le serveur: Ctrl+C puis pnpm dev
✓ Vérifiez le format: KEY=VALUE (pas de guillemets)
```

---

## 📚 Ressources

### Documentation complète:
- [AFFILIATION_GUIDE.md](AFFILIATION_GUIDE.md) - Guide d'utilisation
- [AFFILIATION_TECHNICAL.md](AFFILIATION_TECHNICAL.md) - Documentation technique
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Déploiement en production

### Liens utiles:
- [Discord Developer Portal](https://discord.com/developers/applications)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Vercel](https://vercel.com) - Pour le déploiement

---

## 🎉 C'est tout!

Vous êtes maintenant prêt à utiliser le système d'affiliation! 🚀

Questions? Consultez la documentation complète dans les fichiers `.md` du projet.
