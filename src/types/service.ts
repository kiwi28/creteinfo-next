export interface Service {
  id: string
  name: string
  category: string[]
  contact: string
  phone: string
  email: string
  website: string
  airbnb: string
  location: string
  description: string
  flag: boolean
  featuredExplore: boolean
  coverImage: string
  detailImages: string[]
  created: string
  updated: string
}

export interface ServiceFilter {
  q?: string
  category?: string
  location?: string
  featuredExplore?: boolean
}

export const categoryLabels: Record<string, string> = {
  restaurants: 'Restaurants',
  taxi: 'Taxi',
  boats: 'Boats',
  excursions: 'Excursions',
  'rent-a-car': 'Rent a Car',
  accommodations: 'Accommodations',
  shops: 'Shops',
  'cretan-groups': 'Cretan Groups',
}

export const locations = [
  { label: 'Heraklion', value: 'heraklion' },
  { label: 'Chania', value: 'chania' },
  { label: 'Rethymno', value: 'rethymno' },
  { label: 'Agios Nikolaos', value: 'agios-nikolaos' },
  { label: 'Elounda', value: 'elounda' },
  { label: 'Agia Pelagia', value: 'agia-pelagia' },
  { label: 'Malia', value: 'malia' },
  { label: 'Hersonissos', value: 'hersonissos' },
]
