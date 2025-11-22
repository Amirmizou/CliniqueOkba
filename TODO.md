# 📋 TODO - Prochaines étapes

## ⚠️ Actions requises avant le lancement

### 🎨 Assets & Design
- [ ] **Créer les icônes PWA** :
  - `public/icon-192.png` (192x192 pixels)
  - `public/icon-512.png` (512x512 pixels)
  - `public/screenshot.png` (1280x720 pixels)
  - Utilisez le logo de la clinique
  
### 🔑 Configuration
- [ ] **Configurer Resend** :
  - Créer un compte sur [resend.com](https://resend.com)
  - Vérifier votre domaine d'envoi
  - Copier la clé API dans `.env`
  - Modifier l'email destinataire dans `app/api/send-email/route.ts` ligne 16

- [ ] **Variables d'environnement** :
  - Copier `.env.example` vers `.env`
  - Remplir `RESEND_API_KEY`
  - Remplir `NEXT_PUBLIC_GA_ID` (optionnel)
  - Définir `ADMIN_USERNAME` et `ADMIN_PASSWORD`

### 📝 Contenu
- [ ] **Vérifier clinic.json** :
  - Valider l'adresse
  - Vérifier le numéro de téléphone
  - Confirmer l'email de contact
  - Ajuster les horaires d'ouverture
  - Vérifier les coordonnées GPS

- [ ] **Galerie photos** :
  - Ajouter de vraies photos de la clinique
  - Remplacer les images de placeholder
  - Optimiser les images (WebP recommandé)

- [ ] **Témoignages** :
  - Collecter des vrais témoignages de patients
  - Les ajouter dans la base de données via Prisma Studio

---

## 🚀 Fonctionnalités à compléter (Optionnel)

### 🔐 CMS / Admin Panel
- [ ] Créer `/app/admin/page.tsx` - Dashboard
- [ ] Créer `/app/admin/login/page.tsx` - Page de connexion
- [ ] Implémenter NextAuth pour l'authentification
- [ ] Routes API CRUD :
  - [ ] `/app/api/gallery/*` - Gestion galerie
  - [ ] `/app/api/testimonials/*` - Gestion témoignages
  - [ ] `/app/api/settings/*` - Paramètres clinique
- [ ] Interface d'upload d'images
- [ ] Middleware de protection des routes admin

### 🌍 Internationalisation complète
- [ ] Adapter le composant `Header` pour i18n
- [ ] Adapter le composant `Hero` pour i18n
- [ ] Adapter le composant `About` pour i18n
- [ ] Adapter le composant `Services` pour i18n
- [ ] Adapter le composant `Contact` pour i18n
- [ ] Adapter le composant `Footer` pour i18n
- [ ] Adapter tous les autres composants
- [ ] Ajouter un sélecteur de langue dans le header
- [ ] Tester le mode RTL pour l'arabe

### 🖼️ Optimisation images
- [ ] Migrer toutes les balises `<img>` vers `<Image>` de Next.js
- [ ] Compresser toutes les images
- [ ] Utiliser format WebP/AVIF partout
- [ ] Ajouter lazy loading

### 📊 SEO & Analytics
- [ ] Générer sitemap.xml dynamique
- [ ] Ajouter Open Graph meta tags
- [ ] Configurer robots.txt
- [ ] Ajouter Schema.org markup avancé
- [ ] Configurer Google Search Console

### 🎯 Fonctionnalités bonus
- [ ] Système de prise de rendez-vous en ligne
- [ ] Chat en direct / WhatsApp Business
- [ ] Blog médical / Actualités
- [ ] FAQ interactive
- [ ] Newsletter
- [ ] Carte des médecins avec spécialités

---

## 🧪 Tests & Qualité

### Tests
- [ ] Ajouter plus de tests E2E (gallery, testimonials, etc.)
- [ ] Tests unitaires pour les fonctions utilitaires
- [ ] Tests d'intégration pour les APIs

### Performance
- [ ] Audit Lighthouse (viser 90+ sur tous les critères)
- [ ] Optimiser les fonts (preload)
- [ ] Minimiser le bundle JavaScript
- [ ] Configurer CDN pour les assets statiques

### Sécurité
- [ ] Audit de sécurité
- [ ] Configurer CSP (Content Security Policy)
- [ ] Rate limiting sur toutes les APIs
- [ ] Validation des inputs côté serveur
- [ ] Protection CSRF

---

## 📱 Mobile & UX

- [ ] Tester sur vrais devices mobiles
- [ ] Vérifier l'installation PWA sur iOS et Android
- [ ] Optimiser les animations pour mobile
- [ ] Tester le mode offline

---

## 🚀 Déploiement

### Pré-déploiement
- [ ] Build de production sans erreurs : `npm run build`
- [ ] Tester en mode production : `npm start`
- [ ] Vérifier tous les liens
- [ ] Tester le formulaire de contact
- [ ] Valider le SEO

### Déploiement
- [ ] Configurer le domaine custom
- [ ] Déployer sur Vercel/autre plateforme
- [ ] Configurer les variables d'environnement
- [ ] Tester en production
- [ ] Configurer les DNS

### Post-déploiement
- [ ] Soumettre le sitemap à Google
- [ ] Vérifier Google Analytics
- [ ] Tester les performances en prod
- [ ] Monitoring et alertes

---

## 📚 Documentation

- [ ] Documenter l'API pour les développeurs futurs
- [ ] Créer un guide d'utilisation pour le CMS
- [ ] Documenter le processus de déploiement
- [ ] Créer une FAQ technique

---

## 🎓 Formation

- [ ] Former l'équipe à l'utilisation du CMS
- [ ] Former sur la gestion du contenu
- [ ] Documenter les procédures de maintenance

---

**Priorités** :
1. 🔴 **Urgent** : Assets, Configuration, Contenu
2. 🟡 **Important** : CMS, i18n, Optimisation images
3. 🟢 **Nice to have** : Fonctionnalités bonus, Tests avancés

**Estimations** :
- ⚠️ Actions requises : ~2-4 heures
- 🚀 Fonctionnalités à compléter : ~20-40 heures
- 🧪 Tests & Qualité : ~10-15 heures
