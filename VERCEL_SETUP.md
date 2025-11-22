# Configuration Vercel - Clinique OKBA

Ce guide explique comment configurer les variables d'environnement sur Vercel pour que l'application fonctionne correctement en production.

## Variables d'environnement requises

### 1. NEXTAUTH_SECRET (OBLIGATOIRE)

Cette variable est requise pour sécuriser les sessions NextAuth en production.

**Comment générer une clé sécurisée:**

#### Option A: Avec OpenSSL (Linux/Mac/WSL)
```bash
openssl rand -base64 32
```

#### Option B: Avec Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### Option C: Générateur en ligne
Utilisez un service comme: https://generate-secret.vercel.app/32

**Exemple de valeur:**
```
abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

### 2. ADMIN_USER et ADMIN_PASSWORD

Identifiants pour accéder au tableau de bord admin.

**Valeurs par défaut (À CHANGER):**
- ADMIN_USER: `admin`
- ADMIN_PASSWORD: `admin`

### 3. DATABASE_URL (Si utilisation de Prisma)

Chaîne de connexion à la base de données.

**Exemple pour PostgreSQL:**
```
postgresql://user:password@host:5432/database_name
```

### 4. Variables optionnelles

- `NEXT_PUBLIC_GA_ID`: ID Google Analytics
- `NEXT_PUBLIC_BASE_URL`: URL de base (ex: https://cliniqueokba.com)
- `GOOGLE_SITE_VERIFICATION`: Code de vérification Google

## Configuration sur Vercel

### Étape 1: Accéder aux paramètres du projet

1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet "CliniqueOkba"
3. Cliquez sur **Settings** (Paramètres)
4. Allez à **Environment Variables** (Variables d'environnement)

### Étape 2: Ajouter les variables

1. Cliquez sur **Add New**
2. Remplissez les champs:
   - **Name**: Nom de la variable (ex: NEXTAUTH_SECRET)
   - **Value**: Valeur générée (ex: abc123def456...)
   - **Environments**: Sélectionnez les environnements (Production, Preview, Development)

### Étape 3: Variables à ajouter

| Variable | Valeur | Environnements |
|----------|--------|-----------------|
| NEXTAUTH_SECRET | [Clé générée] | Production, Preview |
| ADMIN_USER | [Votre username] | Production, Preview |
| ADMIN_PASSWORD | [Votre password] | Production, Preview |
| DATABASE_URL | [URL de votre DB] | Production, Preview |
| NEXT_PUBLIC_GA_ID | [Votre GA ID] | Production, Preview |
| NEXT_PUBLIC_BASE_URL | https://cliniqueokba.com | Production |

### Étape 4: Redéployer

1. Après avoir ajouté les variables, allez à **Deployments**
2. Cliquez sur le dernier déploiement
3. Cliquez sur **Redeploy** pour appliquer les nouvelles variables

## Vérification

Après le redéploiement:

1. Accédez à votre site: https://cliniqueokba.vercel.app (ou votre domaine personnalisé)
2. Allez à `/admin`
3. Connectez-vous avec vos identifiants ADMIN_USER/ADMIN_PASSWORD
4. Vérifiez que le tableau de bord se charge sans erreur

## Dépannage

### Erreur: "NO_SECRET"
- Vérifiez que NEXTAUTH_SECRET est défini dans Vercel
- Assurez-vous qu'il est défini pour l'environnement Production
- Redéployez après avoir ajouté la variable

### Erreur: "Invalid credentials"
- Vérifiez que ADMIN_USER et ADMIN_PASSWORD sont corrects
- Assurez-vous qu'ils correspondent à vos identifiants

### Erreur: "Database connection failed"
- Vérifiez que DATABASE_URL est correct
- Assurez-vous que votre base de données est accessible depuis Vercel

## Sécurité

⚠️ **Important:**
- Ne commitez JAMAIS les vraies valeurs dans le code
- Utilisez toujours des variables d'environnement pour les secrets
- Changez les identifiants par défaut en production
- Régénérez NEXTAUTH_SECRET régulièrement

## Ressources

- [Documentation NextAuth.js](https://next-auth.js.org/)
- [Documentation Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Générateur de secrets](https://generate-secret.vercel.app/32)
