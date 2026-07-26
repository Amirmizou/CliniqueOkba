/**
 * Signatures de robots utilisables PARTOUT, y compris dans le middleware.
 *
 * Ce fichier ne doit importer aucun module Node (`node:crypto`, `fs`…) : le
 * middleware Next.js s'exécute sur le runtime Edge et échouerait au build.
 */

/**
 * Chemins massivement sondés par les robots d'exploitation (WordPress, fichiers
 * d'environnement, sauvegardes, shells PHP). Les servir renvoie une page 404
 * rendue par React : c'est du CPU offert à l'attaquant, et le moindre fichier
 * réellement exposé devient une compromission.
 */
export const SCANNER_PATH_RE = new RegExp(
  [
    // (a) Répertoires sondés. Frontière stricte : le segment doit correspondre
    //     en entier, sinon une route légitime finissant par le même mot serait
    //     bloquée.
    String.raw`(^|/)(wp-admin|wp-content|wp-includes|wordpress|phpmyadmin|pma|myadmin|dbadmin|adminer|cgi-bin|solr|struts|actuator|owa|\.git|\.svn|\.hg|\.aws|\.ssh|vendor/phpunit|telescope/requests|debug/default/view)(/|$)`,
    // (b) Fichiers sondés. Ancrés en fin de chemin : `credentials` seul n'est
    //     PAS bloqué (c'est aussi le nom du provider NextAuth,
    //     /api/auth/callback/credentials).
    String.raw`(^|/)(wp-login\.php|xmlrpc\.php|shell\.php|cmd\.php|eval-stdin\.php|autodiscover\.xml|\.env(\.[\w-]+)?|\.htaccess|\.htpasswd|web\.config|composer\.(json|lock)|package-lock\.json|yarn\.lock|\.DS_Store|id_rsa(\.pub)?|config\.(php|json|ya?ml|bak)|backup\.(zip|sql|tar|gz)|dump\.sql|db\.sql|credentials\.\w+|secrets?\.(json|ya?ml|txt))$`,
  ].join('|'),
  'i',
)

/** Extensions de fichiers serveur qui n'existent jamais sur ce site Next.js. */
export const SCANNER_EXT_RE = /\.(php\d?|phtml|asp|aspx|jsp|cgi|pl|sh|bak|old|swp|sql|env)$/i

/** Outils d'attaque / de scan : jamais légitimes sur un site vitrine. */
export const ATTACK_UA_RE =
  /sqlmap|nikto|nuclei|zgrab|masscan|nmap|wpscan|dirbuster|gobuster|acunetix|nessus|openvas|havij|hydra|xrumer|zmeu|morfeus|jorgee|feroxbuster|wfuzz|ffuf/i

/** Robots d'indexation / d'analyse / clients non navigateur. */
export const BOT_UA_RE =
  /bot\b|bots?\/|crawler|spider|crawling|slurp|scrapy|archiver|bingpreview|facebookexternalhit|headlesschrome|puppeteer|playwright|selenium|phantomjs|lighthouse|pingdom|uptime|monitoring|curl\/|wget|libwww|httpclient|okhttp|axios\/|node-fetch|got\/|python-requests|python-urllib|aiohttp|go-http-client|java\/|apache-httpclient|guzzle|postman|insomnia|zgrab|masscan|nmap|nikto|sqlmap|nuclei|wpscan|dirbuster|gobuster|feedfetcher|semrush|ahrefs|mj12bot|dotbot|petalbot|bytespider|dataforseo/i

/**
 * Robots à forte consommation qui n'apportent aucune visibilité utile à une
 * clinique locale (agrégateurs SEO, aspirateurs de contenu pour IA).
 * Les moteurs de recherche (Google, Bing, DuckDuckGo…) ne sont PAS listés.
 */
export const UNWANTED_CRAWLER_RE =
  /semrushbot|ahrefsbot|mj12bot|dotbot|blexbot|petalbot|bytespider|dataforseo|serpstatbot|seokicks|megaindex|zoominfobot|barkrowler|magpie-crawler|gptbot|claudebot|ccbot|amazonbot|imagesiftbot|omgili/i
