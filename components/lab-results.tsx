'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  FlaskConical,
  QrCode,
  ShieldCheck,
  Timer,
  CheckCircle2,
  Smartphone,
  ArrowRight,
  Microscope,
  Fingerprint,
  Zap,
} from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'
import { ECGLine } from '@/components/ui/ecg-line'

const ICONS_MAP: Record<string, any> = {
  Microscope,
  ShieldCheck,
  Timer,
  Fingerprint,
  Zap,
  CheckCircle2,
  QrCode,
  Smartphone,
}

/* ── Precision features ── */
const PRECISION_FEATURES = [
  {
    icon: Microscope,
    title: 'Automates de dernière génération',
    title_ar: 'أجهزة أوتوماتيكية حديثة',
    desc: 'Analyseurs Siemens & Roche pour une fiabilité maximale',
    desc_ar: 'أجهزة سيمنز وروش لأعلى مستوى من الدقة',
  },
  {
    icon: ShieldCheck,
    title: 'Contrôle qualité certifié',
    title_ar: 'مراقبة جودة معتمدة',
    desc: 'Double vérification systématique de chaque résultat',
    desc_ar: 'تحقق مزدوج منهجي لكل نتيجة',
  },
  {
    icon: Timer,
    title: 'Résultats rapides',
    title_ar: 'نتائج سريعة',
    desc: 'La plupart des bilans disponibles en quelques heures',
    desc_ar: 'معظم التحاليل متوفرة في غضون ساعات قليلة',
  },
  {
    icon: Fingerprint,
    title: 'Traçabilité totale',
    title_ar: 'تتبع كامل',
    desc: 'Chaque échantillon suivi numériquement de bout en bout',
    desc_ar: 'كل عينة يتم تتبعها رقمياً من البداية إلى النهاية',
  },
]

/* ── QR steps ── */
const QR_STEPS = [
  {
    step: '01',
    title: 'Effectuez vos analyses',
    title_ar: 'قم بإجراء تحاليلك',
    desc: 'Rendez-vous au laboratoire de la Clinique Okba pour votre prise de sang ou prélèvement.',
    desc_ar: 'توجه إلى مختبر عيادة عقبة لإجراء تحليل الدم أو أخذ العينات.',
  },
  {
    step: '02',
    title: 'Recevez votre QR Code',
    title_ar: 'استلم رمز QR الخاص بك',
    desc: 'Un QR Code unique et sécurisé est imprimé sur votre reçu de laboratoire.',
    desc_ar: 'يُطبع رمز QR فريد وآمن على إيصال المختبر الخاص بك.',
  },
  {
    step: '03',
    title: 'Scannez & consultez',
    title_ar: 'امسح واستشر',
    desc: 'Scannez le QR Code avec votre smartphone pour accéder instantanément à vos résultats en ligne.',
    desc_ar: 'امسح رمز QR بهاتفك الذكي للوصول فوراً إلى نتائجك عبر الإنترنت.',
  },
]

interface LabResultsProps {
  locale?: string
  data?: any
}

export default function LabResults({ locale = 'fr', data }: LabResultsProps) {
  const isAr = locale === 'ar'

  // Data from Sanity or fallbacks
  const badge = isAr ? (data?.badge_ar || 'مختبر التحاليل الطبية') : (data?.badge || 'Laboratoire d\'analyses')
  const title = isAr ? (data?.title_ar || 'دقة النتائج، سهولة الوصول') : (data?.title || 'Précision des résultats, simplicité d\'accès')
  const subtitle = isAr ? (data?.subtitle_ar || 'نتائج تحاليل دقيقة وموثوقة بفضل أجهزتنا الحديثة، مع إمكانية استرجاع النتائج فوراً عبر مسح رمز QR') : (data?.subtitle || 'Des résultats d\'analyses d\'une précision certifiée grâce à nos automates de pointe, récupérables instantanément via QR Code')
  
  // Precision block
  const precisionTitle = isAr ? (data?.precisionTitle_ar || 'دقة لا مثيل لها') : (data?.precisionTitle || 'Une précision inégalée')
  const precisionDesc = isAr ? (data?.precisionDesc_ar || 'أحدث الأجهزة الأوتوماتيكية لضمان نتائج تحاليل موثوقة وقابلة للتكرار') : (data?.precisionDesc || 'Des automates de pointe pour garantir des résultats d\'analyses fiables et reproductibles')
  const precisionImage = data?.precisionImage ? urlFor(data.precisionImage).width(800).height(800).url() : '/images/spec/lab-precision.png'
  const precisionStatBadge = data?.precisionStatBadge || '99.7%'
  const precisionFeatures = data?.precisionFeatures?.length > 0 ? data.precisionFeatures : PRECISION_FEATURES

  // QR block
  const qrTitle = isAr ? (data?.qrTitle_ar || 'نتائجك عبر رمز QR') : (data?.qrTitle || 'Vos résultats via QR Code')
  const qrDesc = isAr ? (data?.qrDesc_ar || 'لا حاجة للانتظار أو العودة مجدداً — امسح رمز QR واحصل على نتائجك فوراً على هاتفك') : (data?.qrDesc || 'Plus besoin d\'attendre ou de revenir — scannez et récupérez vos résultats instantanément sur votre téléphone')
  const qrImage = data?.qrImage ? urlFor(data.qrImage).width(800).height(800).url() : '/images/spec/lab-qr-results.png'
  const qrSteps = data?.qrSteps?.length > 0 ? data.qrSteps : QR_STEPS
  const ctaText = isAr ? (data?.ctaText_ar || 'اتصل بالمختبر') : (data?.ctaText || 'Contacter le laboratoire')

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0a0a20] via-[#0d1a2d] to-[#0a1628] py-20 sm:py-28">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-[#8B5CF6]/8 blur-[140px]" />
        <div className="absolute -bottom-40 right-1/4 h-[500px] w-[500px] rounded-full bg-[#006633]/10 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-4 py-2 text-sm font-semibold text-[#a78bfa]">
            <FlaskConical className="h-4 w-4" />
            {badge}
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/60 sm:text-lg">
            {subtitle}
          </p>
          <div className="mx-auto mt-6 h-8 max-w-xs">
            <ECGLine color="rgba(139,92,246,0.5)" height={32} />
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════
            BLOCK 1 — Précision des résultats
           ═══════════════════════════════════════════ */}
        <div className="mb-24 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">

          {/* Image */}
          <motion.div
            className="group relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative h-[380px] w-full overflow-hidden rounded-3xl lg:h-[480px]">
              <Image
                src={precisionImage}
                alt={precisionTitle}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a20]/80 via-transparent to-transparent" />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-[#8B5CF6]/15" />

              {/* Floating stat badge */}
              <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-2xl border border-[#8B5CF6]/20 bg-[#0a0a20]/80 px-5 py-3.5 backdrop-blur-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] shadow-lg shadow-[#8B5CF6]/30">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{precisionStatBadge}</p>
                  <p className="text-xs text-white/60">{isAr ? 'معدل الدقة' : 'Taux de précision'}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features grid */}
          <div className="order-1 space-y-4 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="mb-2 text-2xl font-bold text-white">
                {precisionTitle}
              </h3>
              <p className="mb-6 text-sm text-white/50">
                {precisionDesc}
              </p>
            </motion.div>

            {precisionFeatures.map((feat: any, i: number) => {
              const IconComp = ICONS_MAP[feat.icon] || Microscope
              return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                className="group/item flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 backdrop-blur-sm transition-all duration-300 hover:border-[#8B5CF6]/25 hover:bg-white/[0.06]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8B5CF6]/10 text-[#a78bfa] transition-colors duration-300 group-hover/item:bg-[#8B5CF6]/20">
                  <IconComp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{isAr ? (feat.title_ar || feat.title) : feat.title}</p>
                  <p className="mt-0.5 text-xs text-white/50">{isAr ? (feat.desc_ar || feat.desc) : feat.desc}</p>
                </div>
              </motion.div>
            )})}
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            BLOCK 2 — Résultats en ligne via QR Code
           ═══════════════════════════════════════════ */}
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">

          {/* Process steps */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#006633]/20">
                  <QrCode className="h-5 w-5 text-[#4caf6e]" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {qrTitle}
                </h3>
              </div>
              <p className="mb-6 text-sm text-white/50">
                {qrDesc}
              </p>
            </motion.div>

            {qrSteps.map((s: any, i: number) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                className="group/step flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-300 hover:border-[#006633]/30 hover:bg-white/[0.06]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#006633] to-[#4caf6e] text-lg font-black text-white shadow-lg shadow-[#006633]/25">
                  {s.step}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{isAr ? (s.title_ar || s.title) : s.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/50">{isAr ? (s.desc_ar || s.desc) : s.desc}</p>
                </div>
              </motion.div>
            ))}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="pt-2"
            >
              <a
                href="tel:0563015916"
                className="group/btn inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#006633] via-[#4caf6e] to-[#FDE68A] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#006633]/25 transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
              >
                <Smartphone className="h-4 w-4" />
                {ctaText}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </a>
            </motion.div>
          </div>

          {/* QR Code Image */}
          <motion.div
            className="group relative"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative h-[380px] w-full overflow-hidden rounded-3xl lg:h-[480px]">
              <Image
                src={qrImage}
                alt={qrTitle}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a20]/80 via-transparent to-transparent" />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-[#006633]/15" />

              {/* Floating badge */}
              <div className="absolute bottom-6 right-6 flex items-center gap-3 rounded-2xl border border-[#006633]/20 bg-[#0a0a20]/80 px-5 py-3.5 backdrop-blur-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#006633] to-[#FDE68A] shadow-lg shadow-[#006633]/30">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{isAr ? 'فوري' : 'Instantané'}</p>
                  <p className="text-xs text-white/60">{isAr ? 'نتائجك متاحة 24/7' : 'Résultats disponibles 24/7'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
