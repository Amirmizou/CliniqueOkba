# 🎨 Guide de génération des icônes PWA

## Option 1 : Utiliser un outil en ligne (Recommandé)

### [RealFaviconGenerator](https://realfavicongenerator.net/)
1. Uploadez le logo de la clinique (format PNG, minimum 512x512)
2. Configurez les options iOS, Android, etc.
3. Téléchargez le package
4. Copiez les fichiers dans `/public/`

### [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
1. Uploadez votre logo (PNG, 512x512 minimum)
2. Téléchargez les icônes générées
3. Placez-les dans `/public/`

## Option 2 : Utiliser Photoshop/GIMP

### Créer icon-192.png
1. Ouvrir le logo de la clinique
2. Redimensionner à **192x192 pixels**
3. S'assurer d'un fond transparent ou de couleur unie
4. Exporter en PNG optimisé
5. Sauvegarder comme `icon-192.png` dans `/public/`

### Créer icon-512.png
1. Ouvrir le logo de la clinique
2. Redimensionner à **512x512 pixels**
3. S'assurer d'un fond transparent ou de couleur unie
4. Exporter en PNG optimisé
5. Sauvegarder comme `icon-512.png` dans `/public/`

### Créer screenshot.png
1. Faire une capture d'écran du site
2. Redimensionner à **1280x720 pixels** (landscape)
3. Exporter en PNG
4. Sauvegarder comme `screenshot.png` dans `/public/`

## Option 3 : Utiliser ImageMagick (CLI)

```bash
# Installer ImageMagick
# Windows: https://imagemagick.org/script/download.php
# Mac: brew install imagemagick
# Linux: sudo apt install imagemagick

# Générer icon-192.png
magick convert logo-original.png -resize 192x192 public/icon-192.png

# Générer icon-512.png
magick convert logo-original.png -resize 512x512 public/icon-512.png
```

## ✅ Checklist

- [ ] `icon-192.png` créé (192x192 pixels)
- [ ] `icon-512.png` créé (512x512 pixels)
- [ ] `screenshot.png` créé (1280x720 pixels)
- [ ] Les icônes ont un fond approprié
- [ ] Les icônes sont optimisées (< 50 KB chacune)
- [ ] Testé sur mobile et desktop

## 🎨 Recommandations

### Couleurs
- Utilisez les couleurs de la marque (vert #22c55e)
- Fond blanc ou transparent
- Assurez un bon contraste

### Design
- Logo centré
- Pas de texte trop petit
- Simplifiez si nécessaire pour la lisibilité

### Format
- PNG avec transparence (recommandé)
- Ou PNG avec fond de couleur unie
- Optimisez la taille du fichier

## 🔍 Tester les icônes

1. Lancez le site : `npm run dev`
2. Ouvrez DevTools → Application → Manifest
3. Vérifiez que les icônes s'affichent correctement
4. Testez l'installation sur mobile

## 📱 Test sur mobile

### Android
1. Ouvrez Chrome mobile
2. Allez sur votre site
3. Menu → "Ajouter à l'écran d'accueil"
4. Vérifiez l'icône

### iOS
1. Ouvrez Safari
2. Bouton partage → "Sur l'écran d'accueil"
3. Vérifiez l'icône
