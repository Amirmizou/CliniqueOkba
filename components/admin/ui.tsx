'use client'

import { useRef, useState, useEffect, type ReactNode } from 'react'
import Image from 'next/image'
import { Loader2, Upload, X, Search, Images } from 'lucide-react'

export const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white'

export function Field({
  label,
  children,
  className,
  rtl,
}: {
  label: string
  children?: ReactNode
  className?: string
  rtl?: boolean
}) {
  return (
    <label className={`block ${className ?? ''}`}>
      <span className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
      {children}
    </label>
  )
}

/** Champ texte simple (FR ou AR). */
export function Text({
  label,
  value,
  val,
  onChange,
  rtl,
  dir,
  placeholder,
  className,
}: {
  label?: string
  value?: string
  val?: string
  onChange: (v: string) => void
  rtl?: boolean
  dir?: string
  placeholder?: string
  className?: string
}) {
  const finalValue = val !== undefined ? val : value
  const input = (
    <input
      dir={rtl || dir === 'rtl' ? 'rtl' : undefined}
      className={inputCls}
      value={finalValue || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  )
  return label ? <Field label={label} className={className}>{input}</Field> : input
}

/** Liste éditable (une valeur par ligne) — pour les prestations/services. */
export function Lines({
  label,
  value,
  val,
  onChange,
  rows = 3,
  rtl,
  dir,
}: {
  label?: string
  value?: string[]
  val?: string[] | string
  onChange: (v: string[]) => void
  rows?: number
  rtl?: boolean
  dir?: string
}) {
  const finalValue = Array.isArray(val) ? val : typeof val === 'string' ? val.split('\n') : value
  const text = finalValue?.join('\n') || ''
  const textarea = (
    <textarea
      dir={rtl || dir === 'rtl' ? 'rtl' : undefined}
      className={inputCls}
      rows={rows}
      value={text}
      onChange={(e) => onChange(e.target.value.split('\n').map((l) => l.trim()))}
      placeholder="Une entrée par ligne"
    />
  )
  return label ? <Field label={label}>{textarea}</Field> : textarea
}

interface SanityImageAsset {
  _id: string
  url: string
  originalFilename?: string
  width?: number
  height?: number
}

/** Navigateur modal pour choisir parmi les images déjà uploadées dans Sanity. */
export function ImageBrowser({
  open,
  onClose,
  onSelect,
  currentAssetId,
}: {
  open: boolean
  onClose: () => void
  onSelect: (assetId: string, url: string) => void
  currentAssetId?: string
}) {
  const [images, setImages] = useState<SanityImageAsset[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetch('/api/admin/media')
      .then((r) => r.json())
      .then((d) => setImages(d.images || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [open])

  // Fermer avec Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  const filtered = search
    ? images.filter((img) =>
        (img.originalFilename || '').toLowerCase().includes(search.toLowerCase()),
      )
    : images

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <span className="text-sm font-semibold text-slate-800 dark:text-white">
            Choisir une photo depuis la galerie
          </span>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Recherche */}
        <div className="border-b border-slate-100 px-4 py-2 dark:border-slate-800">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800">
            <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom de fichier…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Grille */}
        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-slate-400">
              <Images className="h-8 w-8" />
              <p className="text-xs">{search ? 'Aucun résultat' : 'Aucune image uploadée'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {filtered.map((img) => {
                const selected = img._id === currentAssetId
                return (
                  <button
                    key={img._id}
                    onClick={() => { onSelect(img._id, img.url); onClose() }}
                    title={img.originalFilename}
                    className={`group relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                      selected
                        ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                        : 'border-transparent hover:border-emerald-400'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.originalFilename || ''}
                      fill
                      sizes="150px"
                      className="object-cover transition-transform group-hover:scale-105"
                      unoptimized
                    />
                    {selected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-emerald-600/20">
                        <div className="rounded-full bg-emerald-500 p-1">
                          <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 px-4 py-2.5 dark:border-slate-800">
          <p className="text-xs text-slate-400">
            {filtered.length} photo{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  )
}

/** Upload d'image vers Sanity (retourne l'assetId + l'URL d'aperçu).
 *  Inclut un bouton "Galerie" pour sélectionner une image déjà uploadée. */
export function ImagePicker({
  url,
  ratio = 'aspect-[3/4]',
  onUploaded,
  val,
  onChange,
}: {
  url?: string
  ratio?: string
  onUploaded?: (assetId: string, url: string) => void
  val?: string
  onChange?: (assetId: string | null) => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null)
  const [browserOpen, setBrowserOpen] = useState(false)

  useEffect(() => {
    if (val && val.startsWith('image-')) {
      fetch(`/api/admin/media/resolve?ref=${val}`)
        .then(r => r.json())
        .then(d => d.url && setResolvedUrl(d.url))
    } else {
      setResolvedUrl(null)
    }
  }, [val])

  const displayUrl = url || resolvedUrl

  const handle = async (file: File) => {
    setBusy(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/media', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) {
        if (onUploaded) onUploaded(data.assetId, data.url)
        if (onChange) onChange(data.assetId)
      }
      else alert(data.error || 'Upload échoué')
    } finally {
      setBusy(false)
    }
  }

  const handleBrowseSelect = (assetId: string, assetUrl: string) => {
    if (onUploaded) onUploaded(assetId, assetUrl)
    if (onChange) onChange(assetId)
    setResolvedUrl(assetUrl)
  }

  return (
    <div>
      <div className={`relative ${ratio} w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800`}>
        {displayUrl ? (
          <Image src={displayUrl} alt="" fill sizes="220px" className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            <Upload className="h-7 w-7" />
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handle(e.target.files[0])}
      />
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {displayUrl ? "Uploader une autre" : 'Uploader'}
        </button>
        <button
          type="button"
          onClick={() => setBrowserOpen(true)}
          className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Images className="h-3.5 w-3.5" />
          Galerie
        </button>
        {displayUrl && onChange && (
          <button
            type="button"
            onClick={() => { onChange(null); setResolvedUrl(null) }}
            className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-700/50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Retirer
          </button>
        )}
      </div>
      <ImageBrowser
        open={browserOpen}
        onClose={() => setBrowserOpen(false)}
        onSelect={handleBrowseSelect}
        currentAssetId={val}
      />
    </div>
  )
}

export function FilePicker({
  val,
  onChange,
  accept = 'video/mp4,video/webm',
  label = 'Choisir un fichier',
}: {
  val?: string
  onChange: (assetId: string | null) => void
  accept?: string
  label?: string
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null)

  useEffect(() => {
    if (val && val.startsWith('file-')) {
      fetch(`/api/admin/media/resolve?ref=${val}`)
        .then(r => r.json())
        .then(d => d.url && setResolvedUrl(d.url))
    } else {
      setResolvedUrl(null)
    }
  }, [val])

  const handle = async (file: File) => {
    setBusy(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/media', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) {
        onChange(data.assetId)
      }
      else alert(data.error || 'Upload échoué')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handle(e.target.files[0])}
      />
      {resolvedUrl ? (
        <div className="flex items-center gap-3 p-3 border rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30 relative overflow-hidden">
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm z-10">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <Loader2 className="h-4 w-4 animate-spin" />
                Upload en cours...
              </div>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400 truncate">
              Fichier sélectionné
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500/70 truncate">
              {resolvedUrl}
            </p>
          </div>
          <button
            onClick={() => ref.current?.click()}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white shrink-0"
            disabled={busy}
          >
            Changer
          </button>
          <button
            onClick={() => onChange(null)}
            className="text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 shrink-0"
            disabled={busy}
          >
            Retirer
          </button>
        </div>
      ) : (
        <button
          onClick={() => ref.current?.click()}
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-6 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          {busy ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Upload en cours...</>
          ) : (
            <><Upload className="h-5 w-5" /> {label}</>
          )}
        </button>
      )}
    </div>
  )
}

/** Petit système de notification (toast). */
export function useToast() {
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const notify = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }
  const ToastView = () =>
    toast ? (
      <div
        className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-lg ${
          toast.ok ? 'bg-emerald-600' : 'bg-red-600'
        }`}
      >
        {toast.msg}
      </div>
    ) : null
  const toastWrapper = (options: { title?: string, description?: string, variant?: 'default' | 'destructive' }) => {
    notify(options.description || options.title || '', options.variant !== 'destructive')
  }

  return { notify, ToastView, toast: toastWrapper }
}
