import { Poppins } from 'next/font/google'
import localFont from 'next/font/local'

// Montserrat Arabic — police arabe (corps + titres en RTL).
// Source : https://github.com/typeagm/Montserrat-Arabic
// preload: false — les fichiers (~250 Ko chacun) ne sont téléchargés que
// lorsque la page est en arabe (dir="rtl"), pas sur les pages françaises.
export const montserratArabic = localFont({
    src: [
        {
            path: '../public/fonts/montserrat-arabic/Montserrat-Arabic-Light.ttf',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../public/fonts/montserrat-arabic/Montserrat-Arabic-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../public/fonts/montserrat-arabic/Montserrat-Arabic-Medium.ttf',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../public/fonts/montserrat-arabic/Montserrat-Arabic-SemiBold.ttf',
            weight: '600',
            style: 'normal',
        },
        {
            path: '../public/fonts/montserrat-arabic/Montserrat-Arabic-Bold.ttf',
            weight: '700',
            style: 'normal',
        },
    ],
    display: 'swap',
    preload: false,
    variable: '--font-montserrat-arabic',
    fallback: ['system-ui', 'arial'],
    adjustFontFallback: 'Arial',
})

// Poppins : utilisé en fallback (corps de texte, caractères non-latins/arabe)
// car Lemon Milk est une police 100% majuscules sans glyphes arabes.
export const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    preload: true,
    variable: '--font-poppins',
    fallback: ['system-ui', 'arial'],
    adjustFontFallback: true,
})

// Lemon Milk — police d'AFFICHAGE uniquement (tout en majuscules).
// Réservée aux titres + identité de marque. Le corps de texte reste en Poppins.
export const lemonMilk = localFont({
    src: [
        {
            path: '../public/fonts/lemon-milk/lemon_milk/LEMONMILK-Light.otf',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../public/fonts/lemon-milk/lemon_milk/LEMONMILK-Regular.otf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../public/fonts/lemon-milk/lemon_milk/LEMONMILK-Medium.otf',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../public/fonts/lemon-milk/lemon_milk/LEMONMILK-Bold.otf',
            weight: '700',
            style: 'normal',
        },
    ],
    display: 'swap',
    preload: true,
    variable: '--font-lemon-milk',
    // Fallback lisible pendant le chargement et pour les caractères absents
    fallback: ['Poppins', 'system-ui', 'arial'],
    adjustFontFallback: 'Arial',
})
