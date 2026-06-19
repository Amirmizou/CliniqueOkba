'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  Film,
  ImageIcon,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
  GripVertical,
  Eye,
  EyeOff,
  ArrowLeft,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { LogoBadgeSpinner } from '@/components/ui/logo-badge'

interface Slide {
  _id?: string
  title: string
  title_ar: string
  subtitle: string
  subtitle_ar: string
  order: number
  active: boolean
  imageUrl?: string
  imageAssetId?: string
  videoUrl?: string
  videoAssetId?: string
  _dirty?: boolean
  _saving?: boolean
  _uploading?: boolean
  _uploadKind?: 'image' | 'video'
}

const empty = (order: number): Slide => ({
  title: '',
  title_ar: '',
  subtitle: '',
  subtitle_ar: '',
  order,
  active: true,
  _dirty: true,
})

export default function HeroEditor() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const notify = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    fetch('/api/admin/hero')
      .then((r) => r.json())
      .then((d) => setSlides((d.slides || []).map((s: Slide) => ({ ...s }))))
      .catch(() => notify('Erreur de chargement', false))
      .finally(() => setLoading(false))
  }, [])

  const update = (i: number, patch: Partial<Slide>) =>
    setSlides((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch, _dirty: true } : s)))

  const addSlide = () => setSlides((prev) => [...prev, empty(prev.length)])

  const uploadMedia = async (i: number, file: File) => {
    const isVideo = file.type.startsWith('video/')
    update(i, { _uploading: true, _uploadKind: isVideo ? 'video' : 'image' })
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/media', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload échoué')
      if (isVideo) {
        update(i, { videoAssetId: data.assetId, videoUrl: data.url, _uploading: false })
      } else {
        update(i, { imageAssetId: data.assetId, imageUrl: data.url, _uploading: false })
      }
      notify(`${isVideo ? 'Vidéo' : 'Image'} uploadée ✓`)
    } catch (e: any) {
      update(i, { _uploading: false })
      notify(e.message || 'Upload échoué', false)
    }
  }

  const save = async (i: number) => {
    const slide = slides[i]
    setSlides((prev) => prev.map((s, idx) => (idx === i ? { ...s, _saving: true } : s)))
    try {
      const res = await fetch('/api/admin/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slide),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Sauvegarde échouée')
      setSlides((prev) =>
        prev.map((s, idx) =>
          idx === i ? { ...s, _id: data.slide?._id || s._id, _dirty: false, _saving: false } : s,
        ),
      )
      notify('Slide enregistré ✓')
    } catch (e: any) {
      setSlides((prev) => prev.map((s, idx) => (idx === i ? { ...s, _saving: false } : s)))
      notify(e.message || 'Sauvegarde échouée', false)
    }
  }

  const remove = async (i: number) => {
    const slide = slides[i]
    if (!confirm('Supprimer ce slide ?')) return
    if (slide._id) {
      const res = await fetch(`/api/admin/hero?id=${slide._id}`, { method: 'DELETE' })
      if (!res.ok) return notify('Suppression échouée', false)
    }
    setSlides((prev) => prev.filter((_, idx) => idx !== i))
    notify('Slide supprimé')
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Tableau de bord
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Carousel d&apos;accueil</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Chaque slide peut afficher une image haute résolution ou une vidéo (MP4/WebM, jusqu&apos;à 200 Mo).
          </p>
        </div>
        <button
          onClick={addSlide}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      {loading ? (
        <LogoBadgeSpinner label="Chargement des slides…" />
      ) : slides.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center text-slate-400 dark:border-slate-700">
          Aucun slide. Cliquez sur « Ajouter ».
        </div>
      ) : (
        <div className="space-y-5">
          {slides.map((s, i) => (
            <div
              key={s._id || `new-${i}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <GripVertical className="h-4 w-4" />
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Slide {i + 1}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => update(i, { active: !s.active })}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                      s.active
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                    }`}
                  >
                    {s.active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    {s.active ? 'Visible' : 'Masqué'}
                  </button>
                  <button
                    onClick={() => remove(i)}
                    className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-[200px_1fr]">
                {/* Média (image ou vidéo) */}
                <MediaPicker
                  imageUrl={s.imageUrl}
                  videoUrl={s.videoUrl}
                  uploading={s._uploading}
                  uploadKind={s._uploadKind}
                  onFile={(f) => uploadMedia(i, f)}
                  onClearVideo={() => update(i, { videoUrl: undefined, videoAssetId: undefined })}
                  onClearImage={() => update(i, { imageUrl: undefined, imageAssetId: undefined })}
                />

                {/* Champs FR / AR */}
                <div className="space-y-4">
                  <Field label="Titre (FR)">
                    <input
                      className={inputCls}
                      value={s.title}
                      onChange={(e) => update(i, { title: e.target.value })}
                      placeholder="Technologie de pointe"
                    />
                  </Field>
                  <Field label="العنوان (AR)">
                    <input
                      dir="rtl"
                      className={inputCls}
                      value={s.title_ar}
                      onChange={(e) => update(i, { title_ar: e.target.value })}
                      placeholder="تكنولوجيا متقدمة"
                    />
                  </Field>
                  <Field label="Sous-titre (FR)">
                    <input
                      className={inputCls}
                      value={s.subtitle}
                      onChange={(e) => update(i, { subtitle: e.target.value })}
                    />
                  </Field>
                  <Field label="العنوان الفرعي (AR)">
                    <input
                      dir="rtl"
                      className={inputCls}
                      value={s.subtitle_ar}
                      onChange={(e) => update(i, { subtitle_ar: e.target.value })}
                    />
                  </Field>
                  <div className="flex items-center gap-4">
                    <Field label="Ordre" className="w-24">
                      <input
                        type="number"
                        className={inputCls}
                        value={s.order}
                        onChange={(e) => update(i, { order: parseInt(e.target.value) || 0 })}
                      />
                    </Field>
                    <button
                      onClick={() => save(i)}
                      disabled={s._saving || !s._dirty}
                      className="ml-auto mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {s._saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {s._dirty ? 'Enregistrer' : 'Enregistré'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-lg ${
            toast.ok ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  )
}

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white'

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={`block ${className ?? ''}`}>
      <span className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
      {children}
    </label>
  )
}

function MediaPicker({
  imageUrl,
  videoUrl,
  uploading,
  uploadKind,
  onFile,
  onClearVideo,
  onClearImage,
}: {
  imageUrl?: string
  videoUrl?: string
  uploading?: boolean
  uploadKind?: 'image' | 'video'
  onFile: (f: File) => void
  onClearVideo?: () => void
  onClearImage?: () => void
}) {
  const [isDragging, setIsDragging] = useState(false)
  const imageRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }

  const hasVideo = !!videoUrl
  const hasImage = !!imageUrl

  return (
    <div>
      {/* Drop zone / preview */}
      <div
        className={`relative aspect-[3/4] w-full overflow-hidden rounded-xl transition-colors ${
          isDragging
            ? 'border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950'
            : hasVideo || hasImage
            ? 'border border-slate-200 dark:border-slate-700'
            : 'border-2 border-dashed border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {/* Video preview */}
        {hasVideo && (
          <video
            src={videoUrl}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        )}

        {/* Image preview (shown below video if both exist) */}
        {!hasVideo && hasImage && (
          <Image src={imageUrl!} alt="" fill sizes="200px" className="object-cover" unoptimized />
        )}

        {/* Empty state */}
        {!hasVideo && !hasImage && (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-slate-400">
            <Upload className="h-8 w-8" />
            <p className="text-center text-xs leading-relaxed">
              Glissez une image ou<br />une vidéo ici
            </p>
          </div>
        )}

        {/* Media type badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {hasVideo && (
            <span className="flex items-center gap-1 rounded-md bg-purple-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
              <Film className="h-3 w-3" /> VIDÉO
              {onClearVideo && (
                <button
                  onClick={onClearVideo}
                  className="ml-1 rounded hover:bg-white/20"
                  aria-label="Retirer la vidéo"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              )}
            </span>
          )}
          {hasImage && (
            <span className="flex items-center gap-1 rounded-md bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
              <ImageIcon className="h-3 w-3" /> IMAGE
              {onClearImage && (
                <button
                  onClick={onClearImage}
                  className="ml-1 rounded hover:bg-white/20"
                  aria-label="Retirer l'image"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              )}
            </span>
          )}
        </div>

        {/* Upload overlay */}
        {uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50">
            <Loader2 className="h-7 w-7 animate-spin text-white" />
            <span className="text-xs font-medium text-white">
              Upload {uploadKind === 'video' ? 'vidéo' : 'image'}…
            </span>
          </div>
        )}

        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/25">
            <span className="rounded-lg bg-white/90 px-3 py-1.5 text-sm font-semibold text-emerald-700 shadow">
              Déposer ici
            </span>
          </div>
        )}
      </div>

      {/* Note if video present and image also exists */}
      {hasVideo && hasImage && (
        <p className="mt-1.5 text-[11px] text-purple-600 dark:text-purple-400">
          La vidéo a priorité sur l&apos;image.
        </p>
      )}

      {/* Picker buttons */}
      <input
        ref={imageRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
      <input
        ref={videoRef}
        type="file"
        accept="video/mp4,video/webm"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <button
          onClick={() => imageRef.current?.click()}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ImageIcon className="h-3.5 w-3.5" /> Image
        </button>
        <button
          onClick={() => videoRef.current?.click()}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Film className="h-3.5 w-3.5" /> Vidéo (200 Mo)
        </button>
      </div>
      <p className="mt-1.5 text-[10px] text-slate-400">
        Images JPG/PNG/WebP jusqu&apos;à 40 Mo · Vidéos MP4/WebM jusqu&apos;à 200 Mo · Pleine résolution préservée
      </p>
    </div>
  )
}
