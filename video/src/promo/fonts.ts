import { loadFont } from '@remotion/fonts'
import { staticFile } from 'remotion'

// Police d'affichage Lemon Milk (tout en majuscules) — fichiers locaux dans public/fonts
export const FONT_HEADING = 'LemonMilk'

loadFont({
  family: FONT_HEADING,
  url: staticFile('fonts/LEMONMILK-Bold.woff2'),
  format: 'woff2',
  weight: '700',
}).catch((e) => console.error('Lemon Milk Bold:', e))

loadFont({
  family: FONT_HEADING,
  url: staticFile('fonts/LEMONMILK-Regular.woff2'),
  format: 'woff2',
  weight: '400',
}).catch((e) => console.error('Lemon Milk Regular:', e))

// Corps de texte : pile système sobre (offline, pas de dépendance réseau)
export const FONT_BODY =
  "'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif"
