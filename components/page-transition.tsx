'use client'

import { usePathname } from 'next/navigation'

/**
 * Fondu d'entrée de page.
 *
 * IMPORTANT — implémentation volontairement en CSS pur.
 * La version Framer Motion (`initial={{ opacity: 0 }}`) sérialisait
 * `style="opacity:0"` sur ce wrapper dans le HTML rendu côté serveur.
 * Comme ce wrapper contient TOUTE la page, plus rien n'était peint tant que
 * le bundle Framer n'était pas chargé puis hydraté : le FCP et le LCP étaient
 * repoussés de plusieurs secondes sur mobile.
 *
 * En CSS, le navigateur peint dès la feuille de style — aucun JS requis.
 * La `key` sur le pathname force le remontage du nœud à chaque navigation,
 * ce qui rejoue l'animation exactement comme avant.
 */
export default function PageTransition({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    return (
        <div key={pathname} className='okba-page-enter flex flex-grow flex-col'>
            {children}
        </div>
    )
}
