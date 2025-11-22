# Authentification GitHub - Guide Rapide

## Méthode Recommandée: Personal Access Token (PAT)

### Étape 1: Créer un Token GitHub

1. Allez sur: https://github.com/settings/tokens
2. Cliquez sur **"Generate new token"** → **"Generate new token (classic)"**
3. Donnez un nom au token: `CliniqueOkba-Deploy`
4. Sélectionnez les permissions:
   - ✅ **repo** (cochez tout)
5. Cliquez **"Generate token"**
6. **COPIEZ LE TOKEN** (vous ne pourrez plus le voir après!)

### Étape 2: Configurer Git avec le Token

```bash
# Remplacez YOUR_TOKEN par votre token GitHub
git remote set-url origin https://YOUR_TOKEN@github.com/Amirmizou/CliniqueOkba.git

# Puis poussez
git push -u origin main
```

### Exemple Complet

```bash
# Si votre token est: ghp_abc123xyz...
git remote set-url origin https://ghp_abc123xyz@github.com/Amirmizou/CliniqueOkba.git
git push -u origin main
```

## Alternative: GitHub CLI (Plus Simple)

```bash
# Installer GitHub CLI
winget install GitHub.cli

# S'authentifier (ouvre le navigateur)
gh auth login

# Pousser normalement
git push -u origin main
```

## Vérification

Après le push, vérifiez sur:
https://github.com/Amirmizou/CliniqueOkba

Vous devriez voir tous vos fichiers!

## ⚠️ Sécurité

- Ne partagez JAMAIS votre token
- Ne committez JAMAIS le token dans le code
- Utilisez des tokens avec permissions minimales
- Révoque les tokens non utilisés
