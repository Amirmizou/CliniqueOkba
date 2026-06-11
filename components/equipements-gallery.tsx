'use client'

import { useMemo, useState, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ZoomIn,
  LayoutGrid,
} from 'lucide-react'
import {
  equipements,
  equipementCategories,
  type EquipementItem,
  type EquipementCategoryId,
} from '@/data/equipements'
import { urlFor } from '@/sanity/lib/image'
import { AnimatedSection } from '@/components/ui/animated-section'

type Filter = 'all' | EquipementCategoryId

const VALID_CATEGORIES = new Set<EquipementCategoryId>(
  equipementCategories.map((c) => c.id),
)

/** Convertit les photos Sanity en items de galerie (avec repli sur les données locales) */
function resolveItems(data?: any[]): EquipementItem[] {
  if (!data || data.length === 0) return equipements
  const items = data
    .filter((d) => d?.image && VALID_CATEGORIES.has(d.category))
    .map((d, i) => ({
      id: d._id || String(i),
      src: urlFor(d.image).width(1200).height(900).url(),
      category: d.category as EquipementCategoryId,
      title: d.title || '',
      description: d.description || '',
      featured: d.featured ?? false,
    }))
  return items.length > 0 ? items : equipements
}

const categoryById = Object.fromEntries(
  equipementCategories.map((c) => [c.id, c]),
)

/* -------------------------------------------------------------------------- */
/*  Carte image                                                               */
/* -------------------------------------------------------------------------- */

function GalleryTile({
  item,
  onOpen,
}: {
  item: EquipementItem
  onOpen: (item: EquipementItem) => void
}) {
  const t = useTranslations('gallery')
  const cat = categoryById[item.category]

  return (
    <motion.button
      type="button"
      layout
      onClick={() => onOpen(item)}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative block w-full overflow-hidden rounded-2xl text-left shadow-lg ring-1 ring-black/5 ${
        item.featured ? 'sm:col-span-2 sm:row-span-2' : ''
      }`}
    >
      <div
        className={`relative w-full overflow-hidden ${
          item.featured ? 'aspect-square' : 'aspect-[4/3]'
        }`}
      >
        <Image
          src={item.src}
          alt={item.title}
          fill
          sizes={
            item.featured
              ? '(max-width: 640px) 100vw, 50vw'
              : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
          }
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
        />

        {/* Voile dégradé */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Loupe au survol */}
        <div className="absolute right-3 top-3 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ZoomIn className="h-4 w-4" />
        </div>

        {/* Badge catégorie */}
        <span
          className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white shadow-md backdrop-blur-sm"
          style={{ backgroundColor: `${cat.accent}E6` }}
        >
          <cat.icon className="h-3 w-3" />
          {t(`cat.${item.category}`)}
        </span>

        {/* Texte */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3
            className={`font-bold leading-tight text-white drop-shadow ${
              item.featured ? 'text-xl sm:text-2xl' : 'text-base'
            }`}
          >
            {item.title}
          </h3>
          <p
            className={`mt-1 text-white/85 ${
              item.featured ? 'text-sm' : 'text-xs'
            } line-clamp-2 max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100`}
          >
            {item.description}
          </p>
        </div>
      </div>
    </motion.button>
  )
}

/* -------------------------------------------------------------------------- */
/*  Lightbox                                                                  */
/* -------------------------------------------------------------------------- */

function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: EquipementItem[]
  index: number
  onClose: () => void
  onNavigate: (next: number) => void
}) {
  const t = useTranslations('gallery')
  const tc = useTranslations('common')
  const item = items[index]
  const cat = categoryById[item.category]

  const go = useCallback(
    (dir: number) => {
      const n = (index + dir + items.length) % items.length
      onNavigate(n)
    },
    [index, items.length, onNavigate],
  )

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
    >
      {/* Fermer */}
      <button
        type="button"
        onClick={onClose}
        aria-label={tc('close')}
        className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/30"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Précédent / Suivant */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          go(-1)
        }}
        aria-label={t('prevImage')}
        className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/30 sm:left-6"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          go(1)
        }}
        aria-label={t('nextImage')}
        className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/30 sm:right-6"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative flex max-h-[88vh] w-full max-w-4xl flex-col"
        >
          <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src={item.src}
              alt={item.title}
              width={1280}
              height={960}
              className="h-auto max-h-[72vh] w-full object-contain"
            />
          </div>

          {/* Légende */}
          <div className="mt-4 text-center">
            <span
              className="mb-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: `${cat.accent}E6` }}
            >
              <cat.icon className="h-3.5 w-3.5" />
              {t(`cat.${item.category}`)}
            </span>
            <h3 className="text-lg font-bold text-white sm:text-xl">{item.title}</h3>
            <p className="mx-auto mt-1 max-w-xl text-sm text-white/75">
              {item.description}
            </p>
            <p className="mt-2 text-xs text-white/50">
              {index + 1} / {items.length}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Section principale                                                        */
/* -------------------------------------------------------------------------- */

/** Nombre de photos affichées par défaut sur l'accueil (aperçu compact) */
const PREVIEW_COUNT = 8

export default function EquipementsGallery({ data }: { data?: any[] }) {
  const t = useTranslations('gallery')
  const [filter, setFilter] = useState<Filter>('all')
  const [showAll, setShowAll] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const items = useMemo(() => resolveItems(data), [data])

  const visible = useMemo(
    () =>
      filter === 'all' ? items : items.filter((e) => e.category === filter),
    [filter, items],
  )

  // Aperçu compact : on ne montre qu'un sous-ensemble tant que « Voir tout » n'est pas activé
  const shown = useMemo(
    () => (showAll ? visible : visible.slice(0, PREVIEW_COUNT)),
    [showAll, visible],
  )
  const hasMore = visible.length > PREVIEW_COUNT

  const openLightbox = useCallback(
    (item: EquipementItem) => {
      const i = visible.findIndex((v) => v.id === item.id)
      setLightboxIndex(i >= 0 ? i : 0)
    },
    [visible],
  )

  const present = new Set(items.map((i) => i.category))
  const filters: { id: Filter; label: string; accent: string }[] = [
    { id: 'all', label: t('allFilter'), accent: '#006633' },
    ...equipementCategories
      .filter((c) => present.has(c.id))
      .map((c) => ({
        id: c.id as Filter,
        label: t(`cat.${c.id}`),
        accent: c.accent,
      })),
  ]

  return (
    <section
      id="equipements"
      className="relative overflow-hidden bg-gradient-to-b from-background via-background to-primary/5 py-16 sm:py-20 md:py-24"
    >
      {/* Décor */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-[#3B82F6]/10 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-96 w-96 rounded-full bg-[#006633]/15 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <AnimatedSection animation="fade" className="mb-10 text-center">
          <div className="animate-item">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              {t('badge')}
            </span>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              <span className="text-gradient">{t('titleLine1')}</span>
              <br />
              <span className="text-foreground">{t('titleLine2')}</span>
            </h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
              {t('subtitle')}
            </p>
          </div>
        </AnimatedSection>

        {/* Filtres */}
        <div className="mb-10 flex flex-wrap justify-center gap-2.5">
          {filters.map((f) => {
            const active = filter === f.id
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setFilter(f.id)
                  setShowAll(false)
                }}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  active
                    ? 'border-transparent text-white shadow-md'
                    : 'border-border bg-background/60 text-foreground/70 hover:border-foreground/30 hover:text-foreground'
                }`}
                style={active ? { backgroundColor: f.accent } : undefined}
              >
                {f.id === 'all' && <LayoutGrid className="h-3.5 w-3.5" />}
                {f.label}
              </button>
            )
          })}
        </div>

        {/* Grille */}
        <motion.div
          layout
          className="grid auto-rows-auto grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {shown.map((item) => (
              <GalleryTile key={item.id} item={item} onOpen={openLightbox} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bouton « Voir toute la galerie » / « Voir moins » */}
        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="group inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-6 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20"
            >
              {showAll
                ? t('showLess')
                : t('showAll', { count: visible.length })}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${
                  showAll ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && visible[lightboxIndex] && (
          <Lightbox
            items={visible}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
