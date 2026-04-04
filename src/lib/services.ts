import { unstable_cache } from 'next/cache'
import { pb } from './pocketbase'
import type { Service, ServiceFilter } from '@/types/service'

export async function getServices(filter: ServiceFilter = {}): Promise<Service[]> {
  const filterParts: string[] = []

  // Add search query filter (searches in name and description)
  // if (filter.q) {
  //   filterParts.push(
  //     `(name ~ "${filter.q}" || description ~ "${filter.q}" || category ~ "${filter.q}" || location ~ "${filter.q}")`,
  //   )
  // }
  if (filter.q) {
    // Split the query into individual keywords
    const keywords = filter.q.trim().split(/\s+/)

    // For each keyword, search across all fields
    const keywordFilters = keywords.map((keyword) => {
      return `(name ~ "${keyword}" || description ~ "${keyword}" || category ~ "${keyword}" || location ~ "${keyword}")`
    })

    // Combine all keyword filters with AND logic
    filterParts.push(`(${keywordFilters.join(' && ')})`)
  }

  // Add category filter
  if (filter.category) {
    filterParts.push(`category ~ "${filter.category}"`)
  }

  // Add location filter
  if (filter.location) {
    filterParts.push(`location ~ "${filter.location}"`)
  }

  // Add featured filter
  if (filter.featuredExplore !== undefined) {
    filterParts.push(`featuredExplore = ${filter.featuredExplore}`)
  }

  const filterString = filterParts.length > 0 ? filterParts.join(' && ') : ''

  try {
    const result = await pb.collection('services').getList(1, 500, {
      filter: filterString,
      sort: '-created',
    })

    return result.items as unknown as Service[]
  } catch (error) {
    console.error('Failed to fetch services:', error)
    return []
  }
}

export async function getServiceById(id: string): Promise<Service | null> {
  try {
    const record = await pb.collection('services').getOne(id)
    return record as unknown as Service
  } catch (error) {
    console.error('Failed to fetch service:', error)
    return null
  }
}

export async function getServicesByCategory(category: string): Promise<Service[]> {
  return getServices({ category })
}

export async function getFeaturedServices(): Promise<Service[]> {
  return getServices({ featuredExplore: true })
}

/**
 * Returns a cached version of getServices
 */
export const getCachedServices = (filter: ServiceFilter = {}) =>
  unstable_cache(async () => getServices(filter), ['services', JSON.stringify(filter)], {
    tags: ['services'],
    revalidate: 60, // Revalidate every 60 seconds
  })
