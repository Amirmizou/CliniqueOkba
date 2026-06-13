'use client'

import { useRef, useState, useEffect, type ReactNode } from 'react'
import Image from 'next/image'
import { Loader2, Upload } from 'lucide-react'

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

/** Upload d'image vers Sanity (retourne l'assetId + l'URL d'aperçu). */
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
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => ref.current?.click()}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {displayUrl ? "Changer l'image" : 'Choisir une image'}
        </button>
        {displayUrl && onChange && (
          <button
            onClick={() => onChange(null)}
            className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-700/50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Retirer
          </button>
        )}
      </div>
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
