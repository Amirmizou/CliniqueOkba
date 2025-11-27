'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, Loader2, Plus, Trash2, LogOut, ImageIcon, Star } from 'lucide-react'

interface Article {
    id: string
    title: string
    excerpt: string
    content: string
    image: string
    date: string
    published: boolean
}

interface GalleryImage {
    id: string
    image: string
    caption: string
    category: string
}

interface Service {
    id: string
    title: string
    description: string
    icon: string
}

interface Testimonial {
    id: string
    name: string
    role: string
    content: string
    rating: number
    image: string
    visible: boolean
}

interface HeroSlide {
    id: string
    image: string
    title: string
    subtitle: string
    order: number
    active: boolean
}

interface Equipment {
    id: string
    name: string
    brand: string
    model: string
    category: string
    description: string
    icon: string
    image: string
    features: string[]
}

export default function AdminDashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [data, setData] = useState<any>(null)
    const [articles, setArticles] = useState<Article[]>([])
    const [gallery, setGallery] = useState<GalleryImage[]>([])
    const [services, setServices] = useState<Service[]>([])
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)

    // Forms state
    const [newArticle, setNewArticle] = useState<Partial<Article>>({
        title: '', excerpt: '', content: '', image: '', published: true
    })
    const [newGalleryImage, setNewGalleryImage] = useState<Partial<GalleryImage>>({
        image: '', caption: '', category: 'exterior'
    })
    const [newService, setNewService] = useState<Partial<Service>>({
        title: '', description: '', icon: 'Activity'
    })
    const [newTestimonial, setNewTestimonial] = useState<Partial<Testimonial>>({
        name: '', role: 'Patient', content: '', rating: 5, image: '', visible: true
    })
    const [newHeroSlide, setNewHeroSlide] = useState<Partial<HeroSlide>>({
        image: '', title: '', subtitle: '', order: 1, active: true
    })
    const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
    const [newEquipment, setNewEquipment] = useState<Partial<Equipment>>({
        name: '', brand: '', model: '', category: 'imaging', description: '', icon: 'Activity', image: '', features: []
    })

    useEffect(() => {
        // Check authentication with NextAuth
        if (status === 'unauthenticated') {
            router.push('/auth/signin?callbackUrl=/admin/dashboard')
            return
        }

        if (status === 'authenticated') {
            // Load data only when authenticated
            Promise.all([
                fetch('/api/admin/clinic').then(r => r.json()),
                fetch('/api/admin/articles').then(r => r.json()),
                fetch('/api/admin/gallery').then(r => r.json()),
                fetch('/api/admin/services').then(r => r.json()),
                fetch('/api/admin/testimonials').then(r => r.json()),
                fetch('/api/admin/hero-slides').then(r => r.json())
            ]).then(([clinicData, articlesData, galleryData, servicesData, testimonialsData, heroSlidesData]) => {
                setData(clinicData)
                setArticles(articlesData)
                setGallery(galleryData)
                setServices(servicesData)
                setTestimonials(testimonialsData)
                setHeroSlides(heroSlidesData)
                setLoading(false)
            }).catch(err => {
                console.error(err)
                setLoading(false)
            })
        }
    }, [router, status])

    const handleSave = async () => {
        if (!data) return
        setSaving(true)
        try {
            const res = await fetch('/api/admin/clinic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (res.ok) alert('Modifications enregistrées !')
            else alert('Erreur lors de l\'enregistrement')
        } catch (error) {
            alert('Erreur lors de l\'enregistrement')
        } finally {
            setSaving(false)
        }
    }

    const handleFileUpload = async (file: File, category: string = 'general') => {
        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('category', category)

        try {
            const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
            const result = await res.json()
            if (res.ok) return result.url
            else { alert('Erreur upload'); return null }
        } catch (error) {
            alert('Erreur upload')
            return null
        } finally {
            setUploading(false)
        }
    }

    const handleAddArticle = async () => {
        if (!newArticle.title) return
        const res = await fetch('/api/admin/articles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newArticle)
        })
        if (res.ok) {
            const result = await res.json()
            setArticles([...articles, result.article])
            setNewArticle({ title: '', excerpt: '', content: '', image: '', published: true })
            alert('Article ajouté')
        }
    }

    const handleAddService = async () => {
        if (!newService.title) return
        const res = await fetch('/api/admin/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newService)
        })
        if (res.ok) {
            const result = await res.json()
            setServices([...services, result.service])
            setNewService({ title: '', description: '', icon: 'Activity' })
            alert('Service ajouté')
        }
    }

    const handleAddTestimonial = async () => {
        if (!newTestimonial.name) return
        const res = await fetch('/api/admin/testimonials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTestimonial)
        })
        if (res.ok) {
            const result = await res.json()
            setTestimonials([...testimonials, result.testimonial])
            setNewTestimonial({ name: '', role: 'Patient', content: '', rating: 5, image: '', visible: true })
            alert('Témoignage ajouté')
        }
    }

    const handleAddGalleryImage = async () => {
        if (!newGalleryImage.image) return
        const res = await fetch('/api/admin/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newGalleryImage)
        })
        if (res.ok) {
            const result = await res.json()
            setGallery([...gallery, result.image])
            setNewGalleryImage({ image: '', caption: '', category: 'exterior' })
            alert('Image ajoutée')
        }
    }

    const handleAddHeroSlide = async () => {
        if (!newHeroSlide.image) return

        const method = editingSlide ? 'PUT' : 'POST'
        const body = editingSlide ? { ...newHeroSlide, id: editingSlide.id } : newHeroSlide

        const res = await fetch('/api/admin/hero-slides', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        if (res.ok) {
            const result = await res.json()
            if (editingSlide) {
                setHeroSlides(heroSlides.map(s => s.id === result.slide.id ? result.slide : s))
                alert('Slide modifiée')
            } else {
                setHeroSlides([...heroSlides, result.slide])
                alert('Slide ajoutée')
            }
            setNewHeroSlide({ image: '', title: '', subtitle: '', order: 1, active: true })
            setEditingSlide(null)
        }
    }

    const handleEditSlide = (slide: HeroSlide) => {
        setEditingSlide(slide)
        setNewHeroSlide(slide)
    }

    const handleCancelEdit = () => {
        setEditingSlide(null)
        setNewHeroSlide({ image: '', title: '', subtitle: '', order: 1, active: true })
    }

    const handleAddEquipment = async () => {
        if (!newEquipment.name) return
        const res = await fetch('/api/admin/equipment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEquipment)
        })
        if (res.ok) {
            const result = await res.json()
            const updatedEquipment = data.equipment ? [...data.equipment, result.equipment] : [result.equipment]
            setData({ ...data, equipment: updatedEquipment })
            setNewEquipment({ name: '', brand: '', model: '', category: 'imaging', description: '', icon: 'Activity', image: '', features: [] })
            alert('Équipement ajouté')
        }
    }

    const handleDelete = async (type: string, id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return

        try {
            const res = await fetch(`/api/admin/${type}?id=${id}`, { method: 'DELETE' })

            if (res.ok) {
                // Update local state
                if (type === 'articles') setArticles(articles.filter(i => i.id !== id))
                if (type === 'services') setServices(services.filter(i => i.id !== id))
                if (type === 'testimonials') setTestimonials(testimonials.filter(i => i.id !== id))
                if (type === 'gallery') setGallery(gallery.filter(i => i.id !== id))
                if (type === 'hero-slides') setHeroSlides(heroSlides.filter(i => i.id !== id))
                if (type === 'equipment') {
                    const updatedEquipment = data.equipment.filter((i: Equipment) => i.id !== id)
                    setData({ ...data, equipment: updatedEquipment })
                }

                alert('Élément supprimé avec succès !')
            } else {
                const error = await res.json()
                alert(`Erreur lors de la suppression: ${error.error || 'Erreur inconnue'}`)
            }
        } catch (error) {
            console.error('Delete error:', error)
            alert('Erreur lors de la suppression. Veuillez réessayer.')
        }
    }

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/auth/signin' })
    }

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
    if (!data) return null

    return (
        <div className="min-h-screen bg-muted/30 p-8">
            <div className="mx-auto max-w-7xl space-y-8">
                {/* ... (existing code) */}
                <Tabs defaultValue="hero" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-9">
                        <TabsTrigger value="hero">Hero</TabsTrigger>
                        <TabsTrigger value="carousel">Carrousel</TabsTrigger>
                        <TabsTrigger value="contact">Contact</TabsTrigger>
                        <TabsTrigger value="social">Réseaux</TabsTrigger>
                        <TabsTrigger value="services">Services</TabsTrigger>
                        <TabsTrigger value="equipment">Équipements</TabsTrigger>
                        <TabsTrigger value="articles">Articles</TabsTrigger>
                        <TabsTrigger value="gallery">Galerie</TabsTrigger>
                        <TabsTrigger value="testimonials">Avis</TabsTrigger>
                    </TabsList>

                    {/* Hero Tab */}
                    <TabsContent value="hero">
                        <Card>
                            <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Titre Principal</Label>
                                    <Input value={data.hero.title} onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Sous-titre</Label>
                                    <Textarea value={data.hero.subtitle} onChange={(e) => setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Nombre de Patients</Label>
                                    <Input value={data.hero.stats.patients} onChange={(e) => setData({ ...data, hero: { ...data.hero, stats: { patients: e.target.value } } })} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Hero Carousel Tab */}
                    <TabsContent value="carousel">
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{editingSlide ? 'Modifier la Slide' : 'Ajouter une Slide'}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Image</Label>
                                        <Input type="file" onChange={async (e) => {
                                            const file = e.target.files?.[0]
                                            if (file) {
                                                const url = await handleFileUpload(file, 'hero')
                                                if (url) setNewHeroSlide({ ...newHeroSlide, image: url })
                                            }
                                        }} />
                                        {uploading && <p className="text-sm text-muted-foreground">Upload en cours...</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Titre</Label>
                                        <Input value={newHeroSlide.title} onChange={(e) => setNewHeroSlide({ ...newHeroSlide, title: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Sous-titre</Label>
                                        <Textarea value={newHeroSlide.subtitle} onChange={(e) => setNewHeroSlide({ ...newHeroSlide, subtitle: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Ordre</Label>
                                            <Input type="number" value={newHeroSlide.order} onChange={(e) => setNewHeroSlide({ ...newHeroSlide, order: parseInt(e.target.value) })} />
                                        </div>
                                        <div className="flex items-center space-x-2 pt-8">
                                            <input
                                                type="checkbox"
                                                id="slideActive"
                                                checked={newHeroSlide.active}
                                                onChange={(e) => setNewHeroSlide({ ...newHeroSlide, active: e.target.checked })}
                                                className="h-4 w-4"
                                            />
                                            <Label htmlFor="slideActive">Active</Label>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button onClick={handleAddHeroSlide}>
                                            {editingSlide ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                                            {editingSlide ? 'Modifier Slide' : 'Ajouter Slide'}
                                        </Button>
                                        {editingSlide && (
                                            <Button variant="outline" onClick={handleCancelEdit}>
                                                Annuler
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                            <div className="grid grid-cols-2 gap-4">
                                {heroSlides.map((slide) => (
                                    <div key={slide.id} className="relative group border rounded-lg overflow-hidden">
                                        <img src={slide.image} alt={slide.title} className="w-full h-48 object-cover" />
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleEditSlide(slide)}
                                                className="shadow-lg"
                                            >
                                                <ImageIcon className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete('hero-slides', slide.id)}
                                                className="shadow-lg"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="p-3 bg-white">
                                            <h3 className="font-bold truncate">{slide.title}</h3>
                                            <p className="text-sm text-muted-foreground truncate">{slide.subtitle}</p>
                                            <div className="flex gap-2 mt-2">
                                                <span className="text-xs bg-muted px-2 py-1 rounded">Ordre: {slide.order}</span>
                                                <span className={`text-xs px-2 py-1 rounded ${slide.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                    {slide.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Contact Tab */}
                    < TabsContent value="contact" >
                        <Card>
                            <CardHeader><CardTitle>Informations de Contact</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input value={data.contact.email} onChange={(e) => setData({ ...data, contact: { ...data.contact, email: e.target.value } })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Téléphone</Label>
                                    <Input value={data.contact.phone} onChange={(e) => setData({ ...data, contact: { ...data.contact, phone: e.target.value } })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Adresse</Label>
                                    <Input value={data.contact.address} onChange={(e) => setData({ ...data, contact: { ...data.contact, address: e.target.value } })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Latitude GPS</Label>
                                        <Input
                                            type="number"
                                            step="0.000001"
                                            value={data.coordinates?.lat || ''}
                                            onChange={(e) => setData({
                                                ...data,
                                                coordinates: {
                                                    ...data.coordinates,
                                                    lat: parseFloat(e.target.value) || 0
                                                }
                                            })}
                                            placeholder="Ex: 36.3"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Longitude GPS</Label>
                                        <Input
                                            type="number"
                                            step="0.000001"
                                            value={data.coordinates?.lng || ''}
                                            onChange={(e) => setData({
                                                ...data,
                                                coordinates: {
                                                    ...data.coordinates,
                                                    lng: parseFloat(e.target.value) || 0
                                                }
                                            })}
                                            placeholder="Ex: 6.6"
                                        />
                                    </div>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm text-muted-foreground">
                                        💡 <strong>Astuce :</strong> Pour trouver les coordonnées GPS, allez sur Google Maps,
                                        faites un clic droit sur l'emplacement de la clinique et cliquez sur les coordonnées pour les copier.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent >

                    {/* Social Tab */}
                    < TabsContent value="social" >
                        <Card>
                            <CardHeader><CardTitle>Réseaux Sociaux</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Facebook</Label>
                                    <Input value={data.social.facebook} onChange={(e) => setData({ ...data, social: { ...data.social, facebook: e.target.value } })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Instagram</Label>
                                    <Input value={data.social.instagram} onChange={(e) => setData({ ...data, social: { ...data.social, instagram: e.target.value } })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>LinkedIn</Label>
                                    <Input value={data.social.linkedin} onChange={(e) => setData({ ...data, social: { ...data.social, linkedin: e.target.value } })} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent >

                    {/* Services Tab */}
                    < TabsContent value="services" >
                        <div className="space-y-4">
                            <Card>
                                <CardHeader><CardTitle>Ajouter un Service</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Titre</Label>
                                            <Input value={newService.title} onChange={(e) => setNewService({ ...newService, title: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Icône (Lucide name)</Label>
                                            <Input value={newService.icon} onChange={(e) => setNewService({ ...newService, icon: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} />
                                    </div>
                                    <Button onClick={handleAddService}><Plus className="mr-2 h-4 w-4" /> Ajouter Service</Button>
                                </CardContent>
                            </Card>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {services.map((service) => (
                                    <Card key={service.id}>
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold">{service.title}</h3>
                                                <Button variant="destructive" size="sm" onClick={() => handleDelete('services', service.id)}><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{service.description}</p>
                                            <p className="text-xs mt-2 bg-muted inline-block px-2 py-1 rounded">Icon: {service.icon}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </TabsContent >

                    {/* Equipment Tab */}
                    <TabsContent value="equipment">
                        <div className="space-y-4">
                            <Card>
                                <CardHeader><CardTitle>Ajouter un Équipement</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Nom</Label>
                                            <Input value={newEquipment.name} onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Marque</Label>
                                            <Input value={newEquipment.brand} onChange={(e) => setNewEquipment({ ...newEquipment, brand: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Modèle</Label>
                                            <Input value={newEquipment.model} onChange={(e) => setNewEquipment({ ...newEquipment, model: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Catégorie</Label>
                                            <select
                                                value={newEquipment.category}
                                                onChange={(e) => setNewEquipment({ ...newEquipment, category: e.target.value })}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            >
                                                <option value="imaging">Imagerie</option>
                                                <option value="laboratory">Laboratoire</option>
                                                <option value="facility">Installation</option>
                                                <option value="other">Autre</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea value={newEquipment.description} onChange={(e) => setNewEquipment({ ...newEquipment, description: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Image</Label>
                                        <Input type="file" onChange={async (e) => {
                                            const file = e.target.files?.[0]
                                            if (file) {
                                                const url = await handleFileUpload(file, 'equipment')
                                                if (url) setNewEquipment({ ...newEquipment, image: url })
                                            }
                                        }} />
                                    </div>
                                    <Button onClick={handleAddEquipment}><Plus className="mr-2 h-4 w-4" /> Ajouter Équipement</Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader><CardTitle>Gérer les Équipements</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {data.equipment?.map((item: Equipment, index: number) => (
                                            <div key={item.id} className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
                                                <div className="relative h-48 w-full bg-muted">
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center">
                                                            <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                                                        </div>
                                                    )}
                                                    <div className="absolute top-2 right-2 z-10">
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDelete('equipment', item.id)}
                                                            className="shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                                                        <label className="cursor-pointer rounded-full bg-white p-2 hover:bg-white/90 transition-colors">
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={async (e) => {
                                                                    const file = e.target.files?.[0]
                                                                    if (file) {
                                                                        const url = await handleFileUpload(file, 'equipment')
                                                                        if (url) {
                                                                            const updatedItem = { ...item, image: url }

                                                                            // Auto-save to API
                                                                            const res = await fetch('/api/admin/equipment', {
                                                                                method: 'PUT',
                                                                                headers: { 'Content-Type': 'application/json' },
                                                                                body: JSON.stringify(updatedItem)
                                                                            })

                                                                            if (res.ok) {
                                                                                // Update local state
                                                                                const updatedEquipment = [...data.equipment]
                                                                                updatedEquipment[index] = updatedItem
                                                                                setData({ ...data, equipment: updatedEquipment })
                                                                                alert('Photo mise à jour avec succès!')
                                                                            } else {
                                                                                alert('Erreur lors de la mise à jour de la photo')
                                                                            }
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                            <ImageIcon className="h-5 w-5 text-black" />
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="font-semibold">{item.name}</h3>
                                                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                                            {item.brand}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Articles Tab */}
                    < TabsContent value="articles" >
                        <div className="space-y-4">
                            <Card>
                                <CardHeader><CardTitle>Ajouter un Article</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Titre</Label>
                                        <Input value={newArticle.title} onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Contenu</Label>
                                        <Textarea value={newArticle.content} onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Image</Label>
                                        <Input type="file" onChange={async (e) => {
                                            const file = e.target.files?.[0]
                                            if (file) {
                                                const url = await handleFileUpload(file, 'articles')
                                                if (url) setNewArticle({ ...newArticle, image: url })
                                            }
                                        }} />
                                    </div>
                                    <Button onClick={handleAddArticle}><Plus className="mr-2 h-4 w-4" /> Ajouter Article</Button>
                                </CardContent>
                            </Card>
                            <div className="space-y-4">
                                {articles.map((article) => (
                                    <div key={article.id} className="flex items-center justify-between border p-4 rounded bg-card">
                                        <div className="flex gap-4 items-center">
                                            {article.image && <img src={article.image} alt="" className="h-12 w-12 object-cover rounded" />}
                                            <div>
                                                <h3 className="font-bold">{article.title}</h3>
                                                <p className="text-sm text-muted-foreground truncate max-w-md">{article.excerpt}</p>
                                            </div>
                                        </div>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete('articles', article.id)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent >

                    {/* Gallery Tab */}
                    < TabsContent value="gallery" >
                        <div className="space-y-4">
                            <Card>
                                <CardHeader><CardTitle>Ajouter une Image</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Image</Label>
                                        <Input type="file" onChange={async (e) => {
                                            const file = e.target.files?.[0]
                                            if (file) {
                                                const url = await handleFileUpload(file, 'gallery')
                                                if (url) setNewGalleryImage({ ...newGalleryImage, image: url })
                                            }
                                        }} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Catégorie</Label>
                                        <select
                                            value={newGalleryImage.category}
                                            onChange={(e) => setNewGalleryImage({ ...newGalleryImage, category: e.target.value })}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        >
                                            <option value="exterior">🏢 Extérieur</option>
                                            <option value="interior">🏥 Intérieur</option>
                                            <option value="equipment">🔬 Équipement</option>
                                            <option value="team">👥 Équipe</option>
                                            <option value="other">📷 Autre</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Légende</Label>
                                        <Input value={newGalleryImage.caption} onChange={(e) => setNewGalleryImage({ ...newGalleryImage, caption: e.target.value })} />
                                    </div>
                                    <Button onClick={handleAddGalleryImage}><Plus className="mr-2 h-4 w-4" /> Ajouter Image</Button>
                                </CardContent>
                            </Card>
                            <div className="grid grid-cols-3 gap-4">
                                {gallery.map((img) => (
                                    <div key={img.id} className="relative group border rounded-lg overflow-hidden">
                                        <img src={img.image} alt={img.caption} className="w-full h-48 object-cover" />
                                        <div className="absolute top-2 right-2">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete('gallery', img.id)}
                                                className="shadow-lg"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="p-2 bg-white">
                                            <p className="text-sm truncate">{img.caption}</p>
                                            <p className="text-xs text-muted-foreground">{img.category}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent >

                    {/* Testimonials Tab */}
                    < TabsContent value="testimonials" >
                        <div className="space-y-4">
                            <Card>
                                <CardHeader><CardTitle>Ajouter un Avis</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Nom</Label>
                                            <Input value={newTestimonial.name} onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Rôle</Label>
                                            <Input value={newTestimonial.role} onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Avis</Label>
                                        <Textarea value={newTestimonial.content} onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Note (1-5)</Label>
                                        <Input type="number" min="1" max="5" value={newTestimonial.rating} onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: parseInt(e.target.value) })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Photo (Optionnel)</Label>
                                        <Input type="file" onChange={async (e) => {
                                            const file = e.target.files?.[0]
                                            if (file) {
                                                const url = await handleFileUpload(file, 'testimonials')
                                                if (url) setNewTestimonial({ ...newTestimonial, image: url })
                                            }
                                        }} />
                                    </div>
                                    <Button onClick={handleAddTestimonial}><Plus className="mr-2 h-4 w-4" /> Ajouter Avis</Button>
                                </CardContent>
                            </Card>
                            <div className="grid gap-4 md:grid-cols-2">
                                {testimonials.map((t) => (
                                    <Card key={t.id}>
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    {t.image ? (
                                                        <img src={t.image} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                            {t.name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h3 className="font-bold">{t.name}</h3>
                                                        <p className="text-xs text-muted-foreground">{t.role}</p>
                                                    </div>
                                                </div>
                                                <Button variant="destructive" size="sm" onClick={() => handleDelete('testimonials', t.id)}><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                            <p className="text-sm italic mb-2">"{t.content}"</p>
                                            <div className="flex text-yellow-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'fill-current' : 'text-gray-300'}`} />
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </TabsContent >

                </Tabs >
            </div >
        </div >
    )
}
