/** Attribut posé sur <html> tant que le rideau d'ouverture doit couvrir la page. */
export const INTRO_ATTR = 'data-okba-intro'

/** Délai de sécurité : si le splash n'a pas pris le relais, on rend la page. */
const INTRO_FAILSAFE_MS = 4000

/**
 * Conditions de lecture du rideau d'ouverture, décidées AVANT le premier rendu.
 *
 * Le splash (`logo-intro.tsx`) ne démarre qu'à l'hydratation. Tant que la
 * décision s'y prenait aussi, le visiteur voyait le site pendant ce délai, puis
 * le rideau tombait dessus. Ce script s'exécute pendant l'analyse du HTML : il
 * pose `data-okba-intro` sur <html>, et `globals.css` peint alors le fond du
 * rideau dès la première image. Le splash n'a plus qu'à s'y superposer.
 *
 * Le rideau recouvre l'élément LCP. On le réserve donc aux contextes où il ne
 * pénalise personne — grand écran, appareil correct, connexion non économique —
 * et il ne joue qu'une fois par session.
 */
const introGateScript = `(function(){try{
var m=function(q){return window.matchMedia&&window.matchMedia(q).matches};
/* Mouvement réduit demandé (vestibulaire, épilepsie) : pas de rideau du tout. */
if(m('(prefers-reduced-motion: reduce)'))return;
/* Mobile et tablette : jamais. C'est là que le budget de rendu est le plus serré. */
if(m('(max-width: 1023px)')||m('(pointer: coarse)'))return;
/* Appareil très peu puissant : l'animation saccaderait de toute façon. Seuil bas
   volontairement : le filtre ci-dessus a déjà écarté le mobile, il ne reste ici
   que des postes de travail. */
var c=navigator.hardwareConcurrency;if(typeof c==='number'&&c>0&&c<=2)return;
/* Mode économie de données / réseau lent. */
var n=navigator.connection;if(n&&(n.saveData||/^(slow-2g|2g|3g)$/.test(n.effectiveType||'')))return;
/* Une seule fois par session. */
if(sessionStorage.getItem('okba-intro'))return;
sessionStorage.setItem('okba-intro','1');
var d=document.documentElement;d.setAttribute('${INTRO_ATTR}','');
setTimeout(function(){d.removeAttribute('${INTRO_ATTR}')},${INTRO_FAILSAFE_MS});
}catch(e){}})()`

export function LogoIntroGate() {
  return <script dangerouslySetInnerHTML={{ __html: introGateScript }} />
}
