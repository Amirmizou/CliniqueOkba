// Types & libellés des événements (partagés entre la liste et le détail)

export interface ClinicEvent {
    _id: string
    title: string
    slug: { current: string }
    eventType?: string
    description?: string
    startDate: string
    endDate?: string
    location?: string
    image: any
    registrationDeadline?: string
    contact?: string
}

export const EVENT_TYPE_LABELS: Record<string, string> = {
    depistage: 'Dépistage',
    sensibilisation: 'Sensibilisation',
    conference: 'Conférence',
    formation: 'Formation',
    'portes-ouvertes': 'Portes ouvertes',
    prevention: 'Prévention',
}
