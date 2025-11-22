# 🌍 Activer l'internationalisation (i18n)

L'infrastructure i18n est **installée mais temporairement désactivée** pour simplifier le démarrage.

## ✅ Ce qui est prêt

- ✅ next-intl installé
- ✅ Dictionnaires FR/AR créés (`messages/fr.json`, `messages/ar.json`)
- ✅ Configuration i18n prête (`i18n.ts`)
- ✅ Middleware préparé (désactivé: `middleware.ts.disabled`)

## 🚀 Pour activer i18n

### 1. Réactiver le middleware

```bash
# Renommer le fichier
rename middleware.ts.disabled middleware.ts
```

### 2. Restructurer l'app

```bash
# Créer le dossier [locale]
mkdir app\[locale]

# Déplacer les fichiers
move app\page.tsx app\[locale]\page.tsx
move app\layout.tsx app\[locale]\layout.tsx
```

### 3. Créer un nouveau layout root

Créer `app/layout.tsx` :

```typescript
import type { ReactNode } from 'react'
import './globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
```

### 4. Adapter le layout [locale]

Modifier `app/[locale]/layout.tsx` pour intégrer next-intl :

```typescript
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = await Promise.resolve(params)
  
  if (!locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

### 5. Réactiver le plugin dans next.config.ts

```typescript
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig = { /* ... */ }

export default withNextIntl(nextConfig)
```

### 6. Adapter tous les composants

Remplacer les textes hardcodés par des traductions :

```typescript
import { useTranslations } from 'next-intl'

export default function MyComponent() {
  const t = useTranslations('nav')
  
  return <h1>{t('home')}</h1>
}
```

## 📚 Documentation

- [next-intl docs](https://next-intl-docs.vercel.app/)
- Traductions : `messages/fr.json` et `messages/ar.json`

## ⚠️ Note

L'i18n est complexe à mettre en place. Il est recommandé de :
1. Faire fonctionner le site en français d'abord
2. Puis activer i18n quand le contenu est finalisé
3. Traduire progressivement les composants
