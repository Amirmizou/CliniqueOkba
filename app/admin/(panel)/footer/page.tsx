'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Save, Plus, Trash2 } from 'lucide-react'
import { Text, Lines, inputCls, Field, useToast } from '@/components/admin/ui'

export default function FooterPage() {
  const [data, setData] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetch('/api/admin/footer')
      .then((r) => r.json())
      .then((res) => {
        if (res.footer) {
          setData(res.footer)
        } else {
          setData({ _type: 'footerContent' })
        }
        setLoading(false)
      })
      .catch((e) => {
        console.error(e)
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/footer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Erreur')
      const json = await res.json()
      setData(json.footer)
      toast({ title: 'Succès', description: 'Pied de page enregistré.' })
    } catch (e) {
      toast({ title: 'Erreur', description: 'Impossible de sauvegarder.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const renderLinksEditor = (field: string, title: string, isRtl = false) => {
    const links = data[field] || []
    return (
      <div className="space-y-4 border p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50">
        <h3 className="font-semibold text-sm">{title}</h3>
        {links.map((link: any, idx: number) => (
          <div key={idx} className="flex gap-2 items-start">
            <div className="flex-1 space-y-2">
              <input 
                type="text" 
                placeholder="Label" 
                className={inputCls} 
                dir={isRtl ? 'rtl' : 'ltr'}
                value={link.label || ''} 
                onChange={(e) => {
                  const arr = [...links]
                  arr[idx].label = e.target.value
                  setData({ ...data, [field]: arr })
                }}
              />
              <input 
                type="text" 
                placeholder="URL / Lien" 
                className={inputCls} 
                value={link.href || ''} 
                onChange={(e) => {
                  const arr = [...links]
                  arr[idx].href = e.target.value
                  setData({ ...data, [field]: arr })
                }}
              />
            </div>
            <Button 
              variant="destructive" 
              size="icon" 
              onClick={() => {
                const arr = [...links]
                arr.splice(idx, 1)
                setData({ ...data, [field]: arr })
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            setData({ ...data, [field]: [...links, { label: '', href: '' }] })
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" /> Ajouter un lien
        </Button>
      </div>
    )
  }

  if (loading) return <div className="p-8 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" /></div>

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Pied de page (Footer)</h1>
        <Button onClick={handleSave} disabled={saving} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Description Globale</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Description (FR)"><Lines val={data.description} onChange={(v) => setData({ ...data, description: v })} rows={3} /></Field>
              <Field label="Description (AR)"><Lines val={data.description_ar} onChange={(v) => setData({ ...data, description_ar: v })} rows={3} dir="rtl" /></Field>
              <Field label="Copyright (FR)"><Text val={data.copyright} onChange={(v) => setData({ ...data, copyright: v })} placeholder="© {year} Clinique OKBA..." /></Field>
              <Field label="Copyright (AR)"><Text val={data.copyright_ar} onChange={(v) => setData({ ...data, copyright_ar: v })} placeholder="© {year} عيادة عقبة..." dir="rtl" /></Field>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Liens Rapides (FR)</h2>
            {renderLinksEditor('quickLinks', 'Liens Rapides (Accueil, À propos...)')}
            <h2 className="text-lg font-semibold border-b pb-2 mt-6">Liens Services (FR)</h2>
            {renderLinksEditor('servicesLinks', 'Liens Services (Urgences, Labo...)')}
            <h2 className="text-lg font-semibold border-b pb-2 mt-6">Liens Légaux (FR)</h2>
            {renderLinksEditor('legalLinks', 'Liens Légaux (Confidentialité...)')}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Liens Rapides (AR)</h2>
            {renderLinksEditor('quickLinks_ar', 'Liens Rapides (AR)', true)}
            <h2 className="text-lg font-semibold border-b pb-2 mt-6">Liens Services (AR)</h2>
            {renderLinksEditor('servicesLinks_ar', 'Liens Services (AR)', true)}
            <h2 className="text-lg font-semibold border-b pb-2 mt-6">Liens Légaux (AR)</h2>
            {renderLinksEditor('legalLinks_ar', 'Liens Légaux (AR)', true)}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-lg font-semibold">Newsletter</h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={!!data.showNewsletter} 
                  onChange={(e) => setData({ ...data, showNewsletter: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                />
                <span className="text-sm font-medium">Activer la section Newsletter</span>
              </label>
            </div>
            
            {data.showNewsletter && (
              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <Field label="Titre (FR)"><Text val={data.newsletterTitle} onChange={(v) => setData({ ...data, newsletterTitle: v })} /></Field>
                <Field label="Titre (AR)"><Text val={data.newsletterTitle_ar} onChange={(v) => setData({ ...data, newsletterTitle_ar: v })} dir="rtl" /></Field>
                <Field label="Description (FR)"><Lines val={data.newsletterDescription} onChange={(v) => setData({ ...data, newsletterDescription: v })} rows={2} /></Field>
                <Field label="Description (AR)"><Lines val={data.newsletterDescription_ar} onChange={(v) => setData({ ...data, newsletterDescription_ar: v })} rows={2} dir="rtl" /></Field>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
