# Guide: Pousser le Code sur GitHub

## ❌ Problème Actuel

Le push vers GitHub échoue car vous devez vous authentifier avec GitHub.

## ✅ Solutions

### Option 1: GitHub CLI (Recommandé)

```bash
# Installer GitHub CLI si pas déjà fait
winget install GitHub.cli

# S'authentifier
gh auth login

# Puis pousser
git push -u origin main
```

### Option 2: Personal Access Token (PAT)

1. **Créer un token**:
   - Allez sur: https://github.com/settings/tokens
   - Cliquez "Generate new token" → "Generate new token (classic)"
   - Cochez "repo" (accès complet aux repositories)
   - Générez et copiez le token

2. **Utiliser le token**:
```bash
git remote set-url origin https://VOTRE_TOKEN@github.com/Amirmizou/CliniqueOkba.git
git push -u origin main
```

### Option 3: SSH

1. **Configurer SSH** (si pas déjà fait):
```bash
ssh-keygen -t ed25519 -C "votre-email@example.com"
# Ajoutez la clé publique (~/.ssh/id_ed25519.pub) sur GitHub
```

2. **Changer l'URL et pousser**:
```bash
git remote set-url origin git@github.com:Amirmizou/CliniqueOkba.git
git push -u origin main
```

## 📋 État Actuel

- ✅ Repository Git initialisé
- ✅ Tous les fichiers commités
- ✅ Remote ajouté
- ⏳ En attente d'authentification pour push

## 🔍 Vérifier Après le Push

Une fois le push réussi, vérifiez sur:
https://github.com/Amirmizou/CliniqueOkba

Vous devriez voir tous vos fichiers!
