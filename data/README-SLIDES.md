# Gestion des Slides du Carousel

Les slides du carousel sont maintenant gérés via un fichier de configuration statique.

## Comment modifier les slides

1. Ouvrir le fichier `data/hero-slides.ts`
2. Modifier, ajouter ou supprimer des slides
3. Sauvegarder le fichier
4. Commit et push sur Git
5. Le site se redéploiera automatiquement sur Vercel

## Structure d'un slide

```typescript
{
  id: '1',                          // ID unique (chaîne de caractères)
  image: '/images/hero/slide1.jpg', // Chemin de l'image (doit être dans /public)
  title: 'Titre du slide',          // Titre principal
  subtitle: 'Sous-titre',           // Sous-titre (optionnel)
  order: 1,                         // Ordre d'affichage (nombre)
  active: true                      // Actif ou non (boolean)
}
```

## Exemple d'ajout d'un nouveau slide

```typescript
export const heroSlides = [
  // ... slides existants ...
  {
    id: '4',
    image: '/images/hero/nouveau-slide.jpg',
    title: 'Nouveau Service',
    subtitle: 'Description du nouveau service',
    order: 4,
    active: true
  }
]
```

## Notes importantes

- Les images doivent être placées dans le dossier `public/images/hero/`
- L'ordre d'affichage est déterminé par le champ `order`
- Seuls les slides avec `active: true` seront affichés
- Après modification, le site doit être redéployé pour voir les changements
