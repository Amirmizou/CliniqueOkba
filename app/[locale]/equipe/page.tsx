import { Suspense } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { getDoctors } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import { GraduationCap, Languages, Calendar, User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ScrollAnimation from '@/components/ui/scroll-animation'
import StaggerContainer from '@/components/ui/stagger-container'

interface Doctor {
    _id: string
    name: string
    slug: { current: string }
    specialty: string
    title: string
    image: any
    bio: string
    qualifications: string[]
    languages: string[]
    consultationDays: string
}

export const metadata = {
    title: 'Notre Équipe Médicale | Clinique OKBA',
    description: 'Découvrez notre équipe de médecins spécialistes dévoués à votre santé à la Clinique OKBA.',
}

async function DoctorsList() {
    const doctors: Doctor[] = await getDoctors()

    if (!doctors || doctors.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="bg-muted/30 rounded-2xl p-12 max-w-lg mx-auto">
                    <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-lg">
                        L'équipe médicale sera bientôt présentée ici.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Ajoutez des médecins via le Studio Sanity.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor: Doctor, index: number) => (
                <ScrollAnimation key={doctor._id} variant="fadeUp" delay={index * 0.1}>
                    <Card className="glass-card h-full border-0 hover-lift overflow-hidden group">
                        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                            {doctor.image ? (
                                <Image
                                    src={urlFor(doctor.image).width(400).height(400).url()}
                                    alt={doctor.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <User className="h-24 w-24 text-primary/30" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <Badge className="bg-primary/90 text-white mb-2">
                                    {doctor.specialty}
                                </Badge>
                            </div>
                        </div>
                        <CardContent className="pt-6">
                            <h3 className="text-xl font-bold mb-1">
                                {doctor.title} {doctor.name}
                            </h3>

                            {doctor.bio && (
                                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                                    {doctor.bio}
                                </p>
                            )}

                            <div className="space-y-2 text-sm">
                                {doctor.qualifications && doctor.qualifications.length > 0 && (
                                    <div className="flex items-start gap-2">
                                        <GraduationCap className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                        <span className="text-muted-foreground line-clamp-2">
                                            {doctor.qualifications.join(', ')}
                                        </span>
                                    </div>
                                )}

                                {doctor.languages && doctor.languages.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Languages className="h-4 w-4 text-primary shrink-0" />
                                        <span className="text-muted-foreground">
                                            {doctor.languages.join(', ')}
                                        </span>
                                    </div>
                                )}

                                {doctor.consultationDays && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-primary shrink-0" />
                                        <span className="text-muted-foreground">
                                            {doctor.consultationDays}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </ScrollAnimation>
            ))}
        </StaggerContainer>
    )
}

export default function EquipePage() {
    return (
        <>
            <Header />
            <main className="min-h-screen pt-24">
                <section className="py-16 md:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <ScrollAnimation variant="fadeUp" className="text-center mb-16">
                            <Badge variant="outline" className="mb-4">Notre équipe</Badge>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                Équipe Médicale
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Des professionnels de santé qualifiés et dévoués, au service de votre bien-être.
                            </p>
                        </ScrollAnimation>

                        <Suspense fallback={
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-96 bg-muted animate-pulse rounded-xl" />
                                ))}
                            </div>
                        }>
                            <DoctorsList />
                        </Suspense>

                        {/* Contact CTA */}
                        <ScrollAnimation variant="fadeUp" className="mt-16">
                            <div className="glass-card rounded-2xl p-8 text-center">
                                <h3 className="text-2xl font-bold mb-4">
                                    Besoin d'une consultation ?
                                </h3>
                                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                                    Prenez rendez-vous directement par téléphone ou rendez-vous sur place à la clinique.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <a
                                        href="tel:+213555123456"
                                        className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        📞 Appeler maintenant
                                    </a>
                                    <a
                                        href="/#contact"
                                        className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-xl font-medium hover:bg-primary/10 transition-colors"
                                    >
                                        📍 Nous localiser
                                    </a>
                                </div>
                            </div>
                        </ScrollAnimation>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
