import { Montserrat } from 'next/font/google'
import localFont from 'next/font/local'

// Montserrat Arabic : géré via next/font/local (comme Lemon Milk) pour garantir
// le chargement et éviter les problèmes de cache ou de fallback système.
export const montserratArabic = localFont({
    src: [
        {
            path: '../public/fonts/montserrat-arabic/Montserrat-Arabic-Light.ttf',
            weight: '300',
            style: 'normal',
        },
        {
            // On utilise la version alfont.com pour le Regular comme demandé précédemment
            path: '../public/fonts/montserrat-arabic/alfont_com_Montserrat-Arabic-Regular.ttf',
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
    preload: false, // On ne preload pas pour ne pas alourdir la version FR
    variable: '--font-montserrat-arabic',
    fallback: ['system-ui', 'arial'],
})

// Montserrat : utilisé comme police globale (corps de texte)
export const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap',
    preload: true,
    variable: '--font-montserrat',
    fallback: ['system-ui', 'arial'],
    adjustFontFallback: true,
})

// Lemon Milk — police d'AFFICHAGE uniquement (tout en majuscules).
// Réservée aux titres + identité de marque. Le corps de texte reste en Montserrat.
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
    fallback: ['Montserrat', 'system-ui', 'arial'],
    adjustFontFallback: 'Arial',
})
