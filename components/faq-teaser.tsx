import { useTranslations, useLocale } from 'next-intl'
import { HelpCircle, ArrowRight } from 'lucide-react'
import { Link } from '@/navigation'
import ScrollAnimation from '@/components/ui/scroll-animation'
import { type FaqItem } from '@/data/faq'

interface FaqTeaserProps {
  data?: FaqItem[]
  sectionContent?: {
    badge?: string
    title?: string
    subtitle?: string
  }
  /** Nombre de questions affichées dans le teaser */
  limit?: number
}

/**
 * Aperçu FAQ pour la page d'accueil.
 * - Contenu issu de Sanity (schéma `faq`) avec repli local.
 * - Injecte les données structurées schema.org « FAQPage » pour le SEO
 *   (rich snippets Google sur les questions/réponses).
 */
export default function FaqTeaser({ data, sectionContent, limit = 5 }: FaqTeaserProps) {
  const t = useTranslations('faqTeaser')
  const locale = useLocale()
  const isAr = locale === 'ar'
  const faqs = data || []
  const visible = faqs.slice(0, limit)

  if (visible.length === 0) return null

  // Données structurées FAQPage (toutes les Q/R disponibles, pas seulement les visibles)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  const hasArabicLetters = (text?: string) => /[\u0600-\u06FF]/.test(text || '');

  // Workaround pour Sanity: si le titre retourné ne contient pas d'arabe alors qu'on est en arabe, on utilise la traduction locale
  const badge = sectionContent?.badge && (!isAr || hasArabicLetters(sectionContent.badge)) ? sectionContent.badge : t('badge')
  const title = sectionContent?.title && (!isAr || hasArabicLetters(sectionContent.title)) ? sectionContent.title : t('title')
  const subtitle = sectionContent?.subtitle && (!isAr || hasArabicLetters(sectionContent.subtitle)) ? sectionContent.subtitle : t('subtitle')

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-24"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Décor d'ambiance */}
      <div className="pointer-events-none absolute -top-24 left-0 h-80 w-80 rounded-full bg-[#006633]/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimation variant="fadeUp" className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary">
            <HelpCircle className="h-4 w-4" />
            {badge}
          </span>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            <span className="text-foreground">
              {title}
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            {subtitle}
          </p>
        </ScrollAnimation>

        <div className="space-y-3">
          {visible.map((faq) => (
            <details
              key={faq._id}
              className="group rounded-2xl border border-border/60 bg-card/80 shadow-sm backdrop-blur-sm transition-colors open:border-primary/30"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6">
                <h3 className="text-base font-semibold text-foreground sm:text-lg">
                  {faq.question}
                </h3>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-light text-primary transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 pt-0 sm:px-6 sm:pb-6">
                <p className="leading-relaxed text-muted-foreground">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/faq"
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-6 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary/10 hover:shadow-md"
          >
            {t('seeAll')}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
