'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
    ArrowRight,
    BedDouble,
    Building2,
    ScanLine,
    Siren,
    Sparkles,
    Stethoscope,
    Users,
} from 'lucide-react'

const ICONS_MAP: Record<string, any> = {
    BedDouble,
    Siren,
    Stethoscope,
    ScanLine,
    Users,
    Building2,
}

/* ── Repli local (si Sanity est vide ou injoignable) ── */
const MILESTONES = [
    { period: '2016', period_ar: '2016', label: 'Ouverture de la Clinique Okba', label_ar: 'افتتاح عيادة عقبة', status: 'done' },
    { period: '2024', period_ar: '2024', label: 'Plateau technique & imagerie de pointe', label_ar: 'تجهيزات تقنية وتصوير طبي متطور', status: 'done' },
    { period: 'En cours', period_ar: 'جارٍ حالياً', label: 'Travaux d’extension', label_ar: 'أشغال التوسعة', status: 'current' },
    { period: 'Prochainement', period_ar: 'قريباً', label: 'Ouverture de l’Hôpital Okba', label_ar: 'افتتاح مستشفى عقبة', status: 'upcoming' },
]

const HIGHLIGHTS = [
    {
        icon: 'BedDouble',
        title: 'Capacité d’hospitalisation élargie',
        title_ar: 'طاقة استشفائية أوسع',
        desc: 'Davantage de chambres et de lits pour accueillir plus de patients, plus longtemps.',
        desc_ar: 'غرف وأسرّة إضافية لاستقبال عدد أكبر من المرضى ولمدة أطول.',
    },
    {
        icon: 'Siren',
        title: 'Urgences renforcées',
        title_ar: 'مصلحة استعجالات معززة',
        desc: 'Une prise en charge d’urgence structurée, 24 h/24 et 7 j/7.',
        desc_ar: 'تكفل استعجالي منظم على مدار الساعة طيلة أيام الأسبوع.',
    },
    {
        icon: 'Stethoscope',
        title: 'Nouvelles spécialités',
        title_ar: 'تخصصات جديدة',
        desc: 'De nouveaux pôles médicaux et chirurgicaux viennent compléter l’offre de soins.',
        desc_ar: 'أقطاب طبية وجراحية جديدة تُثري عرض الرعاية الصحية.',
    },
    {
        icon: 'ScanLine',
        title: 'Plateau technique étendu',
        title_ar: 'تجهيزات تقنية موسّعة',
        desc: 'Imagerie, laboratoire et blocs opératoires à la hauteur d’un hôpital moderne.',
        desc_ar: 'تصوير طبي ومخبر وكتل جراحية بمستوى مستشفى عصري.',
    },
]

/* ── Mot qui se métamorphose, lettre par lettre ── */
function MorphingWord({
    from,
    to,
    isAr,
    reduce,
}: {
    from: string
    to: string
    isAr: boolean
    reduce: boolean | null
}) {
    const [showTo, setShowTo] = useState(false)

    useEffect(() => {
        if (reduce) return
        const id = setInterval(() => setShowTo((v) => !v), 3800)
        return () => clearInterval(id)
    }, [reduce])

    // Mouvement réduit : les deux mots côte à côte, sans animation
    if (reduce) {
        return (
            <span className="inline-flex items-center gap-3">
                <span className="text-white/35 line-through decoration-white/25">{from}</span>
                <ArrowRight className={`h-6 w-6 text-[#4ade80] sm:h-8 sm:w-8 ${isAr ? 'rotate-180' : ''}`} />
                <span className="text-white">{to}</span>
            </span>
        )
    }

    const word = showTo ? to : from
    // L'arabe est une écriture liée : la découper lettre par lettre casserait les ligatures.
    // On anime alors le mot entier d'un seul bloc.
    const isCursive = /[؀-ۿ]/.test(word)
    const parts = isCursive ? [word] : Array.from(word)
    const colorClass = showTo ? 'text-white' : 'text-white/55'

    return (
        <span className="relative inline-grid align-bottom">
            {/* Gabarit invisible (hauteur nulle) : la colonne prend la largeur du plus large
                des deux mots, donc « Okba » ne bouge jamais pendant la métamorphose. */}
            <span
                aria-hidden
                className="invisible col-start-1 row-start-2 block h-0 overflow-hidden whitespace-nowrap"
            >
                {showTo ? from : to}
            </span>

            <span className="col-start-1 row-start-1 flex justify-center whitespace-nowrap">
                {parts.map((part, i) => (
                    <motion.span
                        key={`${showTo ? 'to' : 'from'}-${i}`}
                        initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{
                            duration: 0.55,
                            delay: isCursive ? 0 : i * 0.035,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className={colorClass}
                    >
                        {part}
                    </motion.span>
                ))}
            </span>

            {/* Ligne de scan : clin d’œil au scanner d’imagerie de la clinique */}
            <span
                aria-hidden
                className="pointer-events-none absolute inset-x-[-6%] top-0 h-full overflow-hidden"
            >
                <span className="okba-scan-line absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#4ade80] to-transparent" />
            </span>
        </span>
    )
}

/* ── Compte à rebours (jours) ── */
function useDaysLeft(targetDate?: string) {
    const [days, setDays] = useState<number | null>(null)

    useEffect(() => {
        if (!targetDate) return
        const compute = () => {
            const diff = new Date(targetDate).getTime() - Date.now()
            setDays(diff > 0 ? Math.ceil(diff / 86_400_000) : 0)
        }
        compute()
        const id = setInterval(compute, 60_000)
        return () => clearInterval(id)
    }, [targetDate])

    return days
}

interface TransformationAnnouncementProps {
    locale?: string
    data?: any
}

export default function TransformationAnnouncement({
    locale = 'fr',
    data,
}: TransformationAnnouncementProps) {
    const isAr = locale === 'ar'
    const reduce = useReducedMotion()

    if (data && data.enabled === false) return null

    return (
        <TransformationSection isAr={isAr} reduce={reduce} data={data} />
    )
}

function TransformationSection({
    isAr,
    reduce,
    data,
}: {
    isAr: boolean
    reduce: boolean | null
    data?: any
}) {
    const badge = isAr ? data?.badge_ar || 'إعلان رسمي' : data?.badge || 'Annonce officielle'
    const kicker = isAr
        ? data?.kicker_ar || 'بعد جديد للرعاية الصحية في باتنة'
        : data?.kicker || 'Une nouvelle dimension du soin à Batna'
    const subtitle = isAr
        ? data?.subtitle_ar ||
          'تتحول عيادة عقبة قريباً إلى مستشفى عقبة: أسرّة أكثر، تخصصات أوسع، وتجهيزات تقنية متطورة — بنفس الفريق ونفس مستوى الالتزام منذ اليوم الأول.'
        : data?.subtitle ||
          "La Clinique Okba devient prochainement l'Hôpital Okba : plus de lits, plus de spécialités, un plateau technique élargi — avec la même équipe et la même exigence depuis le premier jour."
    const fromWord = isAr ? data?.fromWord_ar || 'عيادة' : data?.fromWord || 'Clinique'
    const toWord = isAr ? data?.toWord_ar || 'مستشفى' : data?.toWord || 'Hôpital'
    const brandWord = isAr ? data?.brandWord_ar || 'عقبة' : data?.brandWord || 'Okba'
    const ctaText = isAr ? data?.ctaText_ar || 'اتصل بنا' : data?.ctaText || 'Nous contacter'
    const ctaHref = data?.ctaHref || '#contact'

    const milestones = data?.milestones?.length > 0 ? data.milestones : MILESTONES
    const highlights = data?.highlights?.length > 0 ? data.highlights : HIGHLIGHTS

    const daysLeft = useDaysLeft(data?.targetDate)
    const soonLabel = isAr ? 'قريباً' : 'Prochainement'
    const countdownLabel = useMemo(() => {
        if (daysLeft === null) return soonLabel
        if (daysLeft <= 0) return isAr ? 'الافتتاح الآن' : "C'est ouvert"
        return isAr ? `${daysLeft} يوماً تفصلنا` : `J‑${daysLeft}`
    }, [daysLeft, isAr, soonLabel])

    // Progression du chantier, déduite des étapes franchies
    const doneCount = milestones.filter((m: any) => m.status === 'done').length
    const currentCount = milestones.filter((m: any) => m.status === 'current').length
    const progress = Math.min(
        100,
        Math.round(((doneCount + currentCount * 0.5) / Math.max(milestones.length, 1)) * 100),
    )

    return (
        <section
            id="transformation"
            aria-label={isAr ? 'إعلان التحول إلى مستشفى' : 'Annonce de la transformation en hôpital'}
            className="relative overflow-hidden bg-[#04140c] py-20 sm:py-28"
        >
            {/* Décor : halos verts + trame technique */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_0%,rgba(0,102,51,0.55),transparent_70%),radial-gradient(50%_50%_at_85%_100%,rgba(74,222,128,0.18),transparent_70%)]" />
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
                        backgroundSize: '64px 64px',
                    }}
                />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4ade80]/50 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#4ade80]/30 to-transparent" />
            </div>

            <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {/* ── En-tête : badge + métamorphose du nom ── */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#4ade80]/30 bg-[#4ade80]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#86efac] sm:text-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ade80] opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4ade80]" />
                        </span>
                        {badge}
                    </span>

                    <p className="mt-6 text-sm font-medium uppercase tracking-[0.22em] text-white/50 sm:text-base">
                        {kicker}
                    </p>

                    <h2 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl">
                        <MorphingWord from={fromWord} to={toWord} isAr={isAr} reduce={reduce} />{' '}
                        <span className="bg-gradient-to-br from-[#4ade80] to-[#006633] bg-clip-text text-transparent">
                            {brandWord}
                        </span>
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
                        {subtitle}
                    </p>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm">
                            <Sparkles className="h-4 w-4 text-[#4ade80]" />
                            {countdownLabel}
                        </span>
                        <a
                            href={ctaHref}
                            className="group inline-flex items-center gap-2 rounded-full bg-[#4ade80] px-6 py-2.5 text-sm font-semibold text-[#04140c] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#04140c]"
                        >
                            {ctaText}
                            <ArrowRight
                                className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${isAr ? 'rotate-180 group-hover:-translate-x-1' : ''}`}
                            />
                        </a>
                    </div>
                </motion.div>

                {/* ── Frise du chantier ── */}
                <motion.div
                    className="mt-16"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/10">
                        <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-[#006633] to-[#4ade80]"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        />
                    </div>

                    <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {milestones.map((m: any, i: number) => {
                            const isDone = m.status === 'done'
                            const isCurrent = m.status === 'current'
                            return (
                                <li key={`${m.period}-${i}`} className="flex gap-3">
                                    <span
                                        className={`mt-1 h-3 w-3 shrink-0 rounded-full ring-4 ${
                                            isDone
                                                ? 'bg-[#4ade80] ring-[#4ade80]/20'
                                                : isCurrent
                                                  ? 'animate-pulse bg-white ring-white/20'
                                                  : 'bg-white/25 ring-white/10'
                                        }`}
                                    />
                                    <span className="min-w-0">
                                        <span className="block text-xs font-semibold uppercase tracking-wider text-[#86efac]">
                                            {isAr ? m.period_ar || m.period : m.period}
                                        </span>
                                        <span
                                            className={`block text-sm ${isDone || isCurrent ? 'text-white' : 'text-white/60'}`}
                                        >
                                            {isAr ? m.label_ar || m.label : m.label}
                                        </span>
                                    </span>
                                </li>
                            )
                        })}
                    </ol>
                </motion.div>

                {/* ── Ce qui change ── */}
                <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {highlights.map((h: any, i: number) => {
                        const Icon = ICONS_MAP[h.icon] || BedDouble
                        return (
                            <motion.div
                                key={`${h.title}-${i}`}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.06 * i,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition-colors hover:border-[#4ade80]/40 hover:bg-white/[0.07]"
                            >
                                <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4ade80]/12 text-[#4ade80]">
                                    <Icon className="h-5 w-5" />
                                </span>
                                <h3 className="text-base font-semibold text-white">
                                    {isAr ? h.title_ar || h.title : h.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-white/60">
                                    {isAr ? h.desc_ar || h.desc : h.desc}
                                </p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
