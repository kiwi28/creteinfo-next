import { pb } from '@/lib/pocketbase'
import type { Service, ServiceFormData } from '@/types/service'

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

async function triggerRevalidation(serviceId?: string) {
  try {
    await fetch(`${SITE_URL}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId }),
    })
  } catch {
    // Revalidation is best-effort — don't block the user
  }
}

export async function fetchServices(options?: {
  query?: string
  category?: string
  sort?: string
}): Promise<Service[]> {
  const filterParts: string[] = []

  if (options?.query?.trim()) {
    const keywords = options.query.trim().split(/\s+/)
    const keywordFilters = keywords.map(
      (keyword) =>
        `(name ~ "${keyword}" || description ~ "${keyword}" || category.slug ~ "${keyword}" || location ~ "${keyword}" || contact ~ "${keyword}" || phone ~ "${keyword}")`,
    )
    filterParts.push(`(${keywordFilters.join(' && ')})`)
  }

  if (options?.category && options.category !== 'all') {
    // Filter by relation field - use expanded field syntax
    filterParts.push(`category.slug = "${options.category}"`)
  }

  const filterString = filterParts.length > 0 ? filterParts.join(' && ') : ''

  const records = await pb.collection('services').getFullList({
    sort: options?.sort || '-updated',
    filter: filterString,
    expand: 'category',
  })
  return records as unknown as Service[]
}

export async function fetchServiceById(id: string): Promise<Service> {
  const record = await pb.collection('services').getOne(id, { expand: 'category' })
  return record as unknown as Service
}

function appendBaseFields(formData: FormData, data: ServiceFormData) {
  formData.append('name', data.name)
  formData.append('category', JSON.stringify(data.category || []))

  const locationArr = Array.isArray(data.location)
    ? data.location
    : data.location
      ? [data.location]
      : []
  formData.append('location', JSON.stringify(locationArr))

  formData.append('contact', data.contact || '')
  formData.append('phone', data.phone || '')
  formData.append('email', data.email || '')
  formData.append('website', data.website || '')
  formData.append('airbnb', data.airbnb || '')
  formData.append('description', data.description || '')
}

export async function createService(data: ServiceFormData): Promise<Service> {
  const formData = new FormData()
  appendBaseFields(formData, data)

  if (data.coverImage) {
    formData.append('coverImage', data.coverImage)
  }

  for (const file of data.detailImages) {
    formData.append('detailImages', file)
  }

  const record = await pb.collection('services').create(formData)
  await triggerRevalidation()
  return record as unknown as Service
}

export async function updateService(
  id: string,
  data: ServiceFormData,
  existingDetailImages: string[] = [],
): Promise<Service> {
  const formData = new FormData()
  appendBaseFields(formData, data)

  // Cover image: new file > remove > keep existing
  if (data.coverImage) {
    formData.append('coverImage', data.coverImage)
  } else if (data.removeCoverImage) {
    formData.append('coverImage', '')
  }
  // If neither: don't include field → existing cover preserved

  // Detail images: keep existing (not removed) by appending filenames, add new File objects
  const hasDetailChanges = data.removeDetailImages.length > 0 || data.detailImages.length > 0

  if (hasDetailChanges) {
    const kept = existingDetailImages.filter((f) => !data.removeDetailImages.includes(f))
    for (const filename of kept) {
      formData.append('detailImages', filename)
    }
    for (const file of data.detailImages) {
      formData.append('detailImages', file)
    }
  }
  // If no changes: don't include field → existing detail images preserved

  const record = await pb.collection('services').update(id, formData)
  await triggerRevalidation(id)
  return record as unknown as Service
}

export async function deleteService(id: string): Promise<void> {
  await pb.collection('services').delete(id)
  await triggerRevalidation(id)
}
