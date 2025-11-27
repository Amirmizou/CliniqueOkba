# Gestion de la Galerie d'Images

La galerie d'images est maintenant gérée via un fichier de configuration statique, sans base de données.

## Comment modifier la galerie

1. Placer vos nouvelles images dans le dossier `public/images/gallery/`
2. Ouvrir le fichier `data/gallery.ts`
3. Ajouter une entrée pour chaque nouvelle image dans le tableau `galleryImages`
4. Sauvegarder, commiter et pusher sur Git

## Structure d'une image

```typescript
{
  id: 'unique-id',                  // ID unique (ex: '7', 'img-new')
  image: '/images/gallery/nom.jpg', // Chemin de l'image
  caption: 'Description',           // Légende de l'image
  category: 'interior'              // Catégorie: 'exterior', 'interior', 'equipment', 'team', 'other'
}
```

## Exemple

```typescript
export const galleryImages = [
  // ...
  {
    id: 'new-1',
    image: '/images/gallery/nouvelle-salle.jpg',
    caption: 'Nouvelle salle de consultation',
    category: 'interior'
  }
]
```
