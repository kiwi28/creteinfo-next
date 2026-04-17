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
  featured: boolean
  var: string
  collectionId: string
}

export interface ServiceFormData {
  name: string
  category: string[]
  location: string | string[]
  contact: string
  phone: string
  email: string
  website: string
  airbnb: string
  description: string
  coverImage: File | null
  detailImages: File[]
  removeCoverImage: boolean
  removeDetailImages: string[]
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

export const locationsMap = {
  heraklion: 'Heraklion',
  chania: 'Chania',
  rethymno: 'Rethymno',
  'agios-nikolaos': 'Agios Nikolaos',
  elounda: 'Elounda',
  'agia-pelagia': 'Agia Pelagia',
  malia: 'Malia',
  hersonissos: 'Hersonissos',
  sougia: 'Sougia',
  kissamos: 'Kissamos',
  crete: 'Crete',
  'south-crete': 'South Crete',
  balos: 'Balos',
}
