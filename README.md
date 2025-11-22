# Clinique OKBA - Site Web Officiel

Site web moderne et responsive pour la Clinique OKBA à Constantine, Algérie.

## 🚀 Technologies

- **Next.js 15** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **Prisma** - ORM pour la base de données
- **Framer Motion** - Animations
- **next-intl** - Internationalisation (FR/AR)
- **NextAuth.js** - Authentification

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn

## 🛠️ Installation

1. Cloner le repository
```bash
git clone <votre-repo-url>
cd CliniqueOkba
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env
```
Puis éditer `.env` avec vos valeurs

4. Initialiser la base de données
```bash
npm run db:push
npm run db:seed
```

5. Lancer le serveur de développement
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
├── app/                    # Pages Next.js (App Router)
│   ├── [locale]/          # Pages internationalisées
│   ├── admin/             # Dashboard admin
│   └── api/               # API routes
├── components/            # Composants React
│   └── ui/               # Composants UI réutilisables
├── lib/                   # Utilitaires et helpers
├── prisma/               # Schéma et migrations Prisma
├── public/               # Fichiers statiques
│   ├── images/          # Images
│   └── uploads/         # Fichiers uploadés
└── messages/            # Fichiers de traduction (FR/AR)
```

## 🔐 Authentification Admin

Par défaut (à changer en production):
- **Username**: admin
- **Password**: admin

Accès: [http://localhost:3000/admin](http://localhost:3000/admin)

## 🌐 Internationalisation

Le site supporte:
- Français (FR) - langue par défaut
- Arabe (AR)

## 📦 Scripts Disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Linter
npm run db:push      # Synchroniser le schéma Prisma
npm run db:studio    # Interface Prisma Studio
npm run db:seed      # Peupler la base de données
```

## 🚢 Déploiement

### Vercel (Recommandé)

1. Push sur GitHub
2. Importer le projet sur Vercel
3. Configurer les variables d'environnement
4. Déployer

### Autres Plateformes

Assurez-vous de:
- Configurer les variables d'environnement
- Exécuter `npm run build`
- Configurer la base de données

## 🔒 Sécurité

- ✅ NextAuth pour l'authentification
- ✅ Content Security Policy (CSP)
- ✅ Validation des uploads
- ✅ Protection CSRF
- ✅ Headers de sécurité

## 📝 License

Propriétaire - Clinique OKBA

## 👥 Contact

Pour toute question: contact@cliniqueokba.com
# CliniqueOkba
