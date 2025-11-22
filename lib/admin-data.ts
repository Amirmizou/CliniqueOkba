export interface ClinicData {
  hero: {
    title: string
    subtitle: string
    stats: {
      patients: string
    }
  }
  contact: {
    email: string
    phone: string
    address: string
  }
  social: {
    facebook: string
    instagram: string
    linkedin: string
  }
  hours: {
    emergency: string
    consultation: string
  }
}

export interface GalleryImage {
  id: string
  image: string
  title: string
  description: string
  category: string
  caption: string
  published?: boolean
}
