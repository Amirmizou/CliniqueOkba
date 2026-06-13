'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Save } from 'lucide-react'
import { Text, Lines, ImagePicker, inputCls, Field, useToast } from '@/components/admin/ui'

export default function SettingsPage() {
  const [data, setData] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((res) => {
        if (res.settings) {
          setData(res.settings)
        } else {
          setData({ _type: 'siteSettings' })
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
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Erreur')
      const json = await res.json()
      setData(json.settings)
      toast({ title: 'Succès', description: 'Paramètres enregistrés.' })
    } catch (e) {
      toast({ title: 'Erreur', description: 'Impossible de sauvegarder.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" /></div>

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Paramètres du Site</h1>
        <Button onClick={handleSave} disabled={saving} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Général</h2>
            <Field label="Nom de la clinique (FR)"><Text val={data.clinicName} onChange={(v) => setData({ ...data, clinicName: v })} /></Field>
            <Field label="Nom de la clinique (AR)"><Text val={data.clinicName_ar} onChange={(v) => setData({ ...data, clinicName_ar: v })} dir="rtl" /></Field>
            <Field label="Description (FR)"><Lines val={data.description} onChange={(v) => setData({ ...data, description: v })} rows={3} /></Field>
            <Field label="Description (AR)"><Lines val={data.description_ar} onChange={(v) => setData({ ...data, description_ar: v })} rows={3} dir="rtl" /></Field>
            <Field label="Logo">
              <ImagePicker
                val={data.logo?._ref}
                onChange={(ref) => setData({ ...data, logo: ref ? { _ref: ref } : null })}
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Contact & Localisation</h2>
            <Field label="Téléphone"><Text val={data.phone} onChange={(v) => setData({ ...data, phone: v })} /></Field>
            <Field label="Email"><Text val={data.email} onChange={(v) => setData({ ...data, email: v })} /></Field>
            <Field label="WhatsApp (Numéro international)"><Text val={data.whatsappNumber} onChange={(v) => setData({ ...data, whatsappNumber: v })} /></Field>
            <Field label="Message WhatsApp (FR)"><Lines val={data.appointmentMessage} onChange={(v) => setData({ ...data, appointmentMessage: v })} rows={2} /></Field>
            <Field label="Message WhatsApp (AR)"><Lines val={data.appointmentMessage_ar} onChange={(v) => setData({ ...data, appointmentMessage_ar: v })} rows={2} dir="rtl" /></Field>
            
            <Field label="Adresse (FR)"><Lines val={data.address} onChange={(v) => setData({ ...data, address: v })} rows={2} /></Field>
            <Field label="Adresse (AR)"><Lines val={data.address_ar} onChange={(v) => setData({ ...data, address_ar: v })} rows={2} dir="rtl" /></Field>
            
            <div className="grid grid-cols-2 gap-4">
              <Field label="Latitude (GPS)">
                <input type="number" className={inputCls} value={data.coordinates?.lat || ''} onChange={(e) => setData({ ...data, coordinates: { ...data.coordinates, lat: parseFloat(e.target.value) }})} />
              </Field>
              <Field label="Longitude (GPS)">
                <input type="number" className={inputCls} value={data.coordinates?.lng || ''} onChange={(e) => setData({ ...data, coordinates: { ...data.coordinates, lng: parseFloat(e.target.value) }})} />
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Horaires (FR)</h2>
            <Field label="Urgences"><Text val={data.hours?.emergency} onChange={(v) => setData({ ...data, hours: { ...data.hours, emergency: v }})} /></Field>
            <Field label="Jours ouvrables"><Text val={data.hours?.weekdays} onChange={(v) => setData({ ...data, hours: { ...data.hours, weekdays: v }})} /></Field>
            <Field label="Vendredi/Samedi"><Text val={data.hours?.saturday} onChange={(v) => setData({ ...data, hours: { ...data.hours, saturday: v }})} /></Field>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Horaires (AR)</h2>
            <Field label="Urgences"><Text val={data.hours_ar?.emergency} onChange={(v) => setData({ ...data, hours_ar: { ...data.hours_ar, emergency: v }})} dir="rtl" /></Field>
            <Field label="Jours ouvrables"><Text val={data.hours_ar?.weekdays} onChange={(v) => setData({ ...data, hours_ar: { ...data.hours_ar, weekdays: v }})} dir="rtl" /></Field>
            <Field label="Vendredi/Samedi"><Text val={data.hours_ar?.saturday} onChange={(v) => setData({ ...data, hours_ar: { ...data.hours_ar, saturday: v }})} dir="rtl" /></Field>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Réseaux Sociaux</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Facebook"><Text val={data.socialLinks?.facebook} onChange={(v) => setData({ ...data, socialLinks: { ...data.socialLinks, facebook: v }})} /></Field>
              <Field label="Instagram"><Text val={data.socialLinks?.instagram} onChange={(v) => setData({ ...data, socialLinks: { ...data.socialLinks, instagram: v }})} /></Field>
              <Field label="LinkedIn"><Text val={data.socialLinks?.linkedin} onChange={(v) => setData({ ...data, socialLinks: { ...data.socialLinks, linkedin: v }})} /></Field>
              <Field label="Twitter / X"><Text val={data.socialLinks?.twitter} onChange={(v) => setData({ ...data, socialLinks: { ...data.socialLinks, twitter: v }})} /></Field>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
