export const siteConfig = {
    name: "Clinique OKBA",
    description: "Clinique privée moderne",
    contact: {
        email: "Cliniqueokba2025@gmail.com",
        phone: "+213 770 88 42 42 /+213 770 88 43 43",
        address: "Adresse : Nouvelle ville Ali mendjeli, extension ouest en mitoyenneté avec la pompe à essence Boudersa et à proximité du grand rond-point en allant vers ain smara., Constantine, Algeria",
        coordinates: {
            lat: 36.241485,
            lng: 6.550478
        }
    },
    social: {
        facebook: "https://www.facebook.com/p/Clinique-OKBA-61576965629601/",
        instagram: "https://www.instagram.com/clinique_okba/",
    },
    hours: {
        emergency: "24h/24 - 7j/7",
        consultation: "08:00 - 18:00",
        weekdays: "08:00 - 18:00",
        saturday: "08:00 - 14:00"
    }
}

export type SiteConfig = typeof siteConfig
