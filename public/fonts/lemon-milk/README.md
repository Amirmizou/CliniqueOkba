# Police Lemon Milk

Fichiers `.otf` présents dans `lemon_milk/` (toutes graisses).
Référencés par `app/fonts.ts` → `export const lemonMilk`.

## Usage (décision UI/UX)

Lemon Milk est une police **tout en MAJUSCULES** → réservée à l'**affichage** :
- Titres `h1`–`h6` (règle de base dans `app/globals.css`)
- Nom de la clinique dans le header (classe `.font-display`)

Le **corps de texte reste en Poppins** (lisibilité + futur support arabe,
Lemon Milk n'ayant pas de glyphes arabes).

## Appliquer Lemon Milk ailleurs

Ajouter la classe utilitaire `font-display` sur l'élément voulu
(ex. gros chiffres clés, badges d'affichage).

## Tout repasser en Poppins (désactiver Lemon Milk)

Dans `app/globals.css`, supprimer le bloc `h1..h6 { font-family: var(--font-heading) }`.
