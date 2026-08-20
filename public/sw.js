/**
 * Service worker Clinique OKBA.
 *
 * Trois caches distincts pour eviter qu'un cache unique et non borne ne gonfle
 * indefiniment et ne serve du HTML perime :
 *  - PRECACHE : la coquille hors ligne, mise en cache a l'installation ;
 *  - PAGES    : les navigations, en network-first (le reseau fait autorite,
 *               le cache n'est qu'un filet de secours hors ligne) ;
 *  - ASSETS   : les fichiers immuables de /_next/static et /images, en
 *              cache-first, plafonnes a MAX_ASSETS entrees.
 */
const VERSION = 'v2'
const PRECACHE = `okba-precache-${VERSION}`
const PAGES = `okba-pages-${VERSION}`
const ASSETS = `okba-assets-${VERSION}`
const CURRENT_CACHES = [PRECACHE, PAGES, ASSETS]

const MAX_PAGES = 30
const MAX_ASSETS = 80

// Uniquement des fichiers dont l'existence est verifiee : un seul 404 ici
// ferait echouer addAll(), donc l'installation entiere du service worker.
const PRECACHE_URLS = ['/offline.html', '/manifest.json', '/logo.ico']

/** Supprime les entrees les plus anciennes au-dela de `maxEntries`. */
async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName)
  const keys = await cache.keys()
  if (keys.length <= maxEntries) return
  await Promise.all(keys.slice(0, keys.length - maxEntries).map((k) => cache.delete(k)))
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then((cache) =>
      // addAll() est tout-ou-rien : on ajoute fichier par fichier pour qu'une
      // ressource manquante n'empeche pas le service worker de s'installer.
      Promise.all(
        PRECACHE_URLS.map((url) => cache.add(url).catch(() => undefined))
      )
    )
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name.startsWith('okba-') && !CURRENT_CACHES.includes(name))
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  )
})

/** Ressources versionnees ou immuables : sures a servir depuis le cache. */
function isStaticAsset(url) {
  return (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/fonts/')
  )
}

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Cross-origin (CDN Sanity, Google, YouTube) : laisse passer, le navigateur
  // et les en-tetes de cache HTTP font deja le travail.
  if (url.origin !== self.location.origin) return

  // Jamais de cache sur l'API, l'admin, le studio ou l'authentification :
  // ces reponses sont personnelles ou changent a chaque appel.
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/studio') ||
    url.pathname.startsWith('/auth')
  ) {
    return
  }

  // Navigations : network-first, repli sur la derniere version connue puis
  // sur la page hors ligne.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(PAGES).then((cache) => {
              cache.put(request, copy).then(() => trimCache(PAGES, MAX_PAGES))
            })
          }
          return response
        })
        .catch(async () => {
          const cached = await caches.match(request)
          return cached || (await caches.match('/offline.html')) || Response.error()
        })
    )
    return
  }

  // Fichiers immuables : cache-first, on ne repasse par le reseau qu'une fois.
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone()
              caches.open(ASSETS).then((cache) => {
                cache.put(request, copy).then(() => trimCache(ASSETS, MAX_ASSETS))
              })
            }
            return response
          })
      )
    )
    return
  }

  // Tout le reste (JSON, sitemap, robots...) : reseau seul, pas de cache.
})
