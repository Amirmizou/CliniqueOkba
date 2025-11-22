# 🚀 Quick Start Guide - Clinique OKBA

Guide rapide pour démarrer avec votre nouveau site amélioré!

## ⚡ Démarrage en 5 minutes

### 1️⃣ Configuration de base (2 min)

```bash
# Copier le template de configuration
copy .env.example .env

# Ouvrir .env et modifier ces lignes :
RESEND_API_KEY=votre_cle_resend_ici
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
ADMIN_PASSWORD=votre_mot_de_passe_securise
```

### 2️⃣ Initialiser la base de données (1 min)

```bash
npm run db:push
```

### 3️⃣ Lancer le site (1 min)

```bash
npm run dev
```

✅ **C'est tout!** Ouvrez http://localhost:3000

---

## 📋 Checklist avant le lancement

### ⚠️ OBLIGATOIRE

- [ ] **Email** : Configurer Resend
  - Créer compte sur https://resend.com
  - Copier la clé API dans `.env`
  - Modifier l'email dans `app/api/send-email/route.ts` ligne 16

- [ ] **Icônes PWA** : Créer les icônes
  - `public/icon-192.png` (192x192px)
  - `public/icon-512.png` (512x512px)
  - Voir `scripts/generate-icons-guide.md`

- [ ] **Données clinique** : Vérifier `data/clinic.json`
  - Adresse correcte
  - Téléphone correct
  - Email correct
  - Coordonnées GPS correctes

### 🎯 RECOMMANDÉ

- [ ] **Google Analytics** : Ajouter votre ID dans `.env`
- [ ] **Photos** : Remplacer les images de demo
- [ ] **Build test** : `npm run build` sans erreurs
- [ ] **Tests** : `npm run test:e2e`

---

## 🎨 Personnalisation rapide

### Modifier les couleurs (thème vert actuel)

Dans `tailwind.config.js` ou votre fichier de config Tailwind :

```js
colors: {
  primary: '#22c55e', // Vert actuel de la clinique
}
```

### Modifier les informations de la clinique

Éditez `data/clinic.json` :

```json
{
  "name": "Clinique OKBA",
  "address": "Votre adresse",
  "phone": "+213 XXX XXX XXX",
  "email": "contact@votreclinique.com"
}
```

### Ajouter des traductions (i18n)

- Français : `messages/fr.json`
- Arabe : `messages/ar.json`

---

## 🔑 Comptes & Services à créer

### 1. Resend (Envoi emails) - REQUIS ⚠️
- Site : https://resend.com
- Plan gratuit : 3,000 emails/mois
- Temps : 5 minutes

### 2. Google Analytics (Tracking) - Optionnel
- Site : https://analytics.google.com
- Plan : Gratuit
- Temps : 5 minutes

### 3. Vercel (Déploiement) - Recommandé
- Site : https://vercel.com
- Plan : Gratuit pour projets personnels
- Temps : 2 minutes

---

## 📊 Commandes utiles

```bash
# Développement
npm run dev              # Serveur local

# Base de données
npm run db:push          # Créer/mettre à jour
npm run db:studio        # Interface visuelle

# Tests
npm run test:e2e         # Lancer les tests
npm run test:e2e:ui      # Mode interactif

# Production
npm run build            # Build
npm start                # Lancer

# Code quality
npm run lint             # Vérifier le code
npm run format           # Formater le code
```

---

## 🌐 URLs importantes

Après `npm run dev` :

- **Site** : http://localhost:3000
- **Site (Arabe)** : http://localhost:3000/ar
- **Prisma Studio** : `npm run db:studio` → http://localhost:5555

---

## 📚 Documentation complète

- **[README.md](./README.md)** - Vue d'ensemble
- **[INSTALLATION.md](./INSTALLATION.md)** - Guide détaillé
- **[AMELIORATIONS.md](./AMELIORATIONS.md)** - Nouveautés v2.0
- **[TODO.md](./TODO.md)** - Prochaines étapes

---

## 🆘 Problèmes fréquents

### ❌ "Module not found: next-intl"
```bash
npm install --legacy-peer-deps
```

### ❌ Erreur Prisma
```bash
npm run db:push
npx prisma generate
```

### ❌ Build failed
```bash
# Vérifier les erreurs TypeScript
npm run build

# Si c'est lié à i18n, vérifier middleware.ts
```

### ❌ Formulaire ne s'envoie pas
1. Vérifier `.env` → `RESEND_API_KEY`
2. Vérifier `app/api/send-email/route.ts` ligne 16 (email destinataire)
3. Regarder la console du navigateur pour les erreurs

---

## ✅ Prêt pour la production?

### Checklist finale

- [ ] `npm run build` réussit sans erreurs
- [ ] Tous les textes sont corrects (pas de "lorem ipsum")
- [ ] Les images sont réelles (pas de placeholders)
- [ ] Le formulaire fonctionne
- [ ] Les icônes PWA sont créées
- [ ] `.env` est configuré
- [ ] Test sur mobile (responsive)
- [ ] Test des traductions FR/AR

### Déploiement

```bash
# Option 1 : Vercel (recommandé)
npm i -g vercel
vercel

# Option 2 : Build manuel
npm run build
npm start
```

N'oubliez pas d'ajouter les variables d'environnement sur Vercel!

---

## 💡 Besoin d'aide?

1. Consultez [INSTALLATION.md](./INSTALLATION.md)
2. Regardez [TODO.md](./TODO.md) pour les tâches restantes
3. Vérifiez [AMELIORATIONS.md](./AMELIORATIONS.md) pour les détails techniques

---

**Bon développement! 🚀**
