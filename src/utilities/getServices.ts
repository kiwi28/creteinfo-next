import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

export interface ServiceFilter {
  q?: string
  category?: string
  location?: string
  featuredExplore?: boolean
}

export interface Service {
  id: string
  name: string
  slug: string
  category: string
  contact?: string
  phone?: string
  email?: string
  website?: string
  airbnb?: string
  location?: string
  flag?: boolean
  featuredExplore?: boolean
  description?: string
  images?: Array<{
    image?: {
      url?: string
      }
  }>
  meta?: {
    title?: string
    description?: string
  }
}

export async function getServices(filter: ServiceFilter = {}): Promise<Service[]> {
  const payload = await getPayload({ config: configPromise })

  const whereConditions: any[] = []

  // Add search query filter (searches in name and description)
  if (filter.q) {
    whereConditions.push({
      or: [
        {
          name: {
            like: filter.q,
          },
        },
        {
          description: {
            like: filter.q,
          },
        },
      ],
    })
  }

  // Add category filter
  if (filter.category) {
    whereConditions.push({
      category: {
        equals: filter.category,
      },
    })
  }

  // Add location filter
  if (filter.location) {
    whereConditions.push({
      location: {
        equals: filter.location,
      },
    })
  }

  // Add featured filter
  if (filter.featuredExplore !== undefined) {
    whereConditions.push({
      featuredExplore: {
        equals: filter.featuredExplore,
      },
    })
  }

  const result = await payload.find({
    collection: 'services',
    where: whereConditions.length > 0 ? { and: whereConditions } : {},
    depth: 2,
    limit: 100,
  })

  return result.docs as unknown as Service[]
}

/**
 * Returns a cached version of getServices
 */
export const getCachedServices = (filter: ServiceFilter = {}) =>
  unstable_cache(
    async () => getServices(filter),
    ['services', JSON.stringify(filter)],
    {
      tags: ['services'],
    },
  )
