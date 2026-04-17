import { pb } from '@/lib/pocketbase'
import type { Service, ServiceFormData } from '@/types/service'

export async function fetchServices(): Promise<Service[]> {
  const records = await pb.collection('services').getFullList({
    sort: '-updated',
  })
  return records as unknown as Service[]
}

export async function fetchServiceById(id: string): Promise<Service> {
  const record = await pb.collection('services').getOne(id)
  return record as unknown as Service
}

export async function createService(data: ServiceFormData): Promise<Service> {
  const formData = new FormData()
  formData.append('name', data.name)
  formData.append('category', JSON.stringify(data.category || []))
  formData.append('location', data.location || '')
  formData.append('contact', data.contact || '')
  formData.append('phone', data.phone || '')
  formData.append('email', data.email || '')
  formData.append('website', data.website || '')
  formData.append('airbnb', data.airbnb || '')
  formData.append('description', data.description || '')
  formData.append('flag', String(data.flag ?? false))
  formData.append('featuredExplore', String(data.featuredExplore ?? false))
  formData.append('var', data.var || '')

  if (data.coverImage) {
    formData.append('coverImage', data.coverImage)
  }

  for (const file of data.detailImages) {
    formData.append('detailImages', file)
  }

  const record = await pb.collection('services').create(formData)
  return record as unknown as Service
}

export async function updateService(id: string, data: ServiceFormData): Promise<Service> {
  const formData = new FormData()
  formData.append('name', data.name)
  formData.append('category', JSON.stringify(data.category || []))
  formData.append('location', data.location || '')
  formData.append('contact', data.contact || '')
  formData.append('phone', data.phone || '')
  formData.append('email', data.email || '')
  formData.append('website', data.website || '')
  formData.append('airbnb', data.airbnb || '')
  formData.append('description', data.description || '')
  formData.append('flag', String(data.flag ?? false))
  formData.append('featuredExplore', String(data.featuredExplore ?? false))
  formData.append('var', data.var || '')

  if (data.removeCoverImage) {
    formData.append('coverImage', '')
  } else if (data.coverImage) {
    formData.append('coverImage', data.coverImage)
  }

  // If removing all detail images
  if (data.removeDetailImages.length > 0 && data.detailImages.length === 0) {
    formData.append('detailImages', JSON.stringify([]))
  } else if (data.detailImages.length > 0) {
    // Adding new detail images
    for (const file of data.detailImages) {
      formData.append('detailImages', file)
    }
  }

  const record = await pb.collection('services').update(id, formData)
  return record as unknown as Service
}

export async function deleteService(id: string): Promise<void> {
  await pb.collection('services').delete(id)
}
