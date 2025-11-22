# 🚀 Guide d'installation - Clinique OKBA

## 📋 Prérequis

- Node.js 18+ installé
- npm ou pnpm
- Un compte Resend.com pour l'envoi d'emails (gratuit)
- Un compte Google Analytics (optionnel)

## 📦 Installation

### 1. Installer les dépendances

```bash
npm install --legacy-peer-deps
```

### 2. Configuration de l'environnement

Créez un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
```

Modifiez le fichier `.env` avec vos propres valeurs :

```env
# Resend API Key (https://resend.com/api-keys)
RESEND_API_KEY=re_votre_cle_api

# Google Analytics 4 Measurement ID (optionnel)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=changez_ce_mot_de_passe_securise

# Database
DATABASE_URL="file:./dev.db"
```

### 3. Initialiser la base de données

```bash
npm run db:push
```

### 4. Générer les icônes PWA

Créez deux icônes dans le dossier `public/` :
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

Utilisez votre logo de clinique pour ces icônes.

### 5. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🎨 Configuration

### Modifier les informations de la clinique

Éditez le fichier `data/clinic.json` :

```json
{
  "name": "Clinique OKBA",
  "address": "Votre adresse complète",
  "phone": "+213 XXX XXX XXX",
  "email": "contact@votreclinique.com",
  "coordinates": {
    "lat": 36.241788,
    "lng": 6.550556
  }
}
```

### Configurer l'envoi d'emails

1. Créez un compte sur [Resend.com](https://resend.com)
2. Vérifiez votre domaine d'envoi
3. Copiez votre clé API dans `.env`
4. Modifiez `app/api/send-email/route.ts` ligne 16 :

```typescript
to: ['votre-email@example.com'], // ⚠️ Remplacez par votre email
```

## 🌐 i18n (Français/Arabe)

Le site est maintenant configuré pour le français et l'arabe :

- **Français** : `http://localhost:3000/`
- **Arabe** : `http://localhost:3000/ar`

Modifiez les traductions dans :
- `messages/fr.json`
- `messages/ar.json`

## 🔐 Panel Admin (CMS)

### Accéder au panel admin

URL : `http://localhost:3000/admin`

Utilisez les identifiants configurés dans `.env`

### Gérer le contenu

- **Galerie** : Ajoutez/modifiez/supprimez des images
- **Témoignages** : Gérez les avis des patients
- **Paramètres** : Modifiez les horaires, coordonnées, etc.

## 🧪 Tests E2E

### Lancer les tests

```bash
npm run test:e2e
```

### Interface de test interactive

```bash
npm run test:e2e:ui
```

## 📊 Google Analytics

1. Créez une propriété GA4 sur [Google Analytics](https://analytics.google.com)
2. Copiez votre ID de mesure (G-XXXXXXXXXX)
3. Ajoutez-le dans `.env` :

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 🚀 Déploiement

### Sur Vercel (recommandé)

```bash
# Installez Vercel CLI
npm i -g vercel

# Déployez
vercel
```

N'oubliez pas d'ajouter vos variables d'environnement dans Vercel :
- Settings → Environment Variables

### Variables d'environnement de production

- `RESEND_API_KEY`
- `NEXT_PUBLIC_GA_ID`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `DATABASE_URL`

## 📱 PWA (Progressive Web App)

Le site est installable sur mobile et bureau. Les utilisateurs verront une option "Installer l'application" dans leur navigateur.

## 🔧 Scripts utiles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Lancer en production
npm start

# Base de données
npm run db:push      # Synchroniser le schéma
npm run db:studio    # Interface visuelle Prisma

# Tests
npm run test:e2e     # Tests end-to-end
npm run test:e2e:ui  # Interface interactive

# Code quality
npm run lint         # Linter
npm run format       # Formater le code
```

## ❓ Support

Pour toute question ou problème, consultez la documentation :
- [Next.js](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [Resend](https://resend.com/docs)
- [Playwright](https://playwright.dev)
