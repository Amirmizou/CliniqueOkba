'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Link } from '@/navigation'
import { CalendarDays, ArrowRight, Sparkles } from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'
import { useTranslations, useLocale } from 'next-intl'
import SectionGlow from '@/components/ui/section-glow'

interface LatestNewsProps {
  articles: any[]
}

export default function LatestNews({ articles }: LatestNewsProps) {
  const t = useTranslations('news')
  const locale = useLocale()
  const isAr = locale === 'ar'
  const dateLocale = isAr ? 'ar-DZ' : 'fr-FR'

  if (!articles || articles.length === 0) return null

  // Limit to 3 latest articles
  const latestArticles = articles.slice(0, 3)

  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-24">
      {/* Premium Background Decor */}
      <SectionGlow
        glows={[
          { at: '0% 0%', size: 500, color: '#006633', opacity: 0.05 },
          { at: '100% 100%', size: 400, color: '#FDE68A', opacity: 0.1 },
        ]}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#006633]/20 bg-[#006633]/5 px-4 py-1.5 text-sm font-semibold text-[#006633] dark:border-[#4caf6e]/30 dark:bg-[#4caf6e]/10 dark:text-[#4caf6e]">
              <Sparkles className="h-4 w-4" />
              {t('pageBadge')}
            </span>
            <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
              {t('pageTitle')}
            </h2>
          </motion.div>
          
          {articles.length > 3 && (
            <motion.div
              initial={{ opacity: 0, x: isAr ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:block"
            >
              <Link
                href="/actualites"
                className="group inline-flex items-center gap-2 rounded-full bg-[#006633] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#005229] hover:shadow-lg hover:shadow-[#006633]/20"
              >
                {t('otherNews')}
                <ArrowRight className={`h-4 w-4 transition-transform group-hover:${isAr ? '-translate-x-1' : 'translate-x-1'} ${isAr ? 'rotate-180' : ''}`} />
              </Link>
            </motion.div>
          )}
        </div>

        {/* Articles Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {latestArticles.map((article, idx) => {
            const isMain = idx === 0
            const dateStr = article.publishedAt
              ? new Date(article.publishedAt).toLocaleDateString(dateLocale, {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : ''
            
            // Fix category translation if key doesn't exist
            let catStr = article.category
            try {
              if (article.category && t.has(`cat.${article.category}`)) {
                catStr = t(`cat.${article.category}`)
              }
            } catch (e) {
              // Ignore
            }

            return (
              <motion.div
                key={article._id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`group flex overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all hover:shadow-xl hover:shadow-[#006633]/5 ${
                  isMain 
                    ? 'flex-col md:flex-row lg:col-span-2 lg:row-span-2' 
                    : 'flex-col sm:col-span-1'
                }`}
              >
                {/* Image Wrapper */}
                <div className={`relative overflow-hidden ${isMain ? 'w-full md:w-1/2 aspect-video md:aspect-auto' : 'w-full aspect-[4/3]'}`}>
                  {article.image ? (
                    <Image
                      src={urlFor(article.image).width(isMain ? 800 : 600).height(isMain ? 600 : 450).url()}
                      alt={article.title || ''}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes={isMain ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50" />
                  )}
                  {/* Category Badge */}
                  {article.category && (
                    <div className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-bold text-foreground shadow-sm backdrop-blur-md">
                      {catStr}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className={`flex flex-1 flex-col ${isMain ? 'p-6 md:p-8 lg:p-10 justify-center' : 'p-5'}`}>
                  <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span>{dateStr}</span>
                  </div>
                  <h3 className={`mb-3 font-bold leading-tight group-hover:text-[#006633] transition-colors ${
                    isMain ? 'text-2xl md:text-3xl lg:text-4xl line-clamp-3' : 'text-lg md:text-xl line-clamp-2'
                  }`}>
                    {article.title}
                  </h3>
                  <p className={`mb-6 flex-1 text-muted-foreground ${isMain ? 'text-base line-clamp-4' : 'text-sm line-clamp-3'}`}>
                    {article.excerpt}
                  </p>
                  
                  {/* Footer / Read More */}
                  <div className="mt-auto flex items-center text-sm font-bold text-[#006633] dark:text-[#4caf6e]">
                    <span className="relative overflow-hidden">
                      <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
                        {t('readMore')}
                      </span>
                      <span className="absolute left-0 top-0 inline-block translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                        {t('readMore')}
                      </span>
                    </span>
                    <ArrowRight className={`ml-2 h-4 w-4 transition-transform duration-300 group-hover:${isAr ? '-translate-x-1' : 'translate-x-1'} ${isAr ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                
                {/* Clickable Overlay */}
                <Link
                  href={`/actualites/${article.slug?.current || ''}`}
                  className="absolute inset-0 z-10"
                  aria-label={t('readMore')}
                />
              </motion.div>
            )
          })}
        </div>
        
        {/* Mobile View All Button */}
        {articles.length > 3 && (
          <div className="mt-10 flex justify-center md:hidden">
            <Link
              href="/actualites"
              className="group inline-flex items-center gap-2 rounded-full bg-[#006633] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#005229] hover:shadow-lg hover:shadow-[#006633]/20"
            >
              {t('otherNews')}
              <ArrowRight className={`h-4 w-4 transition-transform group-hover:${isAr ? '-translate-x-1' : 'translate-x-1'} ${isAr ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
