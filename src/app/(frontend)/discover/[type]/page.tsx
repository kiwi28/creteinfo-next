import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, MapPin } from 'lucide-react'
import { getServices } from '@/lib/services'
import { getServiceCoverUrl } from '@/lib/utils'
import type { Service } from '@/types/service'
import { categoryLabels, locationsMap } from '@/types/service'

interface PageProps {
  params: Promise<{ type: string }>
  searchParams: Promise<{ location?: string }>
}

// Map URL slugs to category IDs
const categorySlugMap: Record<string, string> = {
  restaurants: 'restaurants',
  'cretan-groups': 'cretan-groups',
  shops: 'shops',
  taxi: 'taxi',
  boats: 'boats',
  excursions: 'excursions',
  'rent-a-car': 'rent-a-car',
  accommodations: 'accommodations',
  'info-site': 'info-site',
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params
  const categoryId = categorySlugMap[type]
  const categoryName = categoryLabels[categoryId] || type

  return {
    title: `${categoryName} in Crete`,
    description: `Discover the best ${categoryName.toLowerCase()} in Crete. Browse our curated selection.`,
  }
}

// Service Card Component
function ServiceCard({ service }: { service: Service }) {
  const imageUrl = getServiceCoverUrl(service) || '/images/placeholder-service.jpg'
  const categoryKey = service.category?.[0] || ''
  const categoryLabel = categoryLabels[categoryKey] || categoryKey

  return (
    <Link
      href={`/services/${service.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#1a5276]/10">
        <Image
          src={imageUrl}
          alt={service.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <div className="p-3 md:p-4">
        <h3 className="font-semibold text-[#1a5276] text-sm md:text-base mb-1 group-hover:text-[#2980b9] transition-colors line-clamp-1">
          {service.name}
        </h3>
        <div className="flex items-center gap-2 text-xs text-[#1a5276]/60">
          <span className="font-medium">{categoryLabel}</span>
          {service.location && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {locationsMap[service.location as keyof typeof locationsMap] || ''}
              </span>
            </>
          )}
        </div>
        {service.description && (
          <p className="text-xs text-[#1a5276]/50 mt-2 line-clamp-2">{service.description}</p>
        )}
      </div>
    </Link>
  )
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { type } = await params
  const { location } = await searchParams

  const categoryId = categorySlugMap[type]
  const categoryName = categoryLabels[categoryId] || type

  let services: Service[] = []
  try {
    services = await getServices({ category: categoryId, location })
  } catch (error) {
    console.error('Failed to fetch services:', error)
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="md:mt-16">
        {/* Header */}
        <section className="py-12 md:py-16 px-4 md:px-8 bg-gradient-to-b from-[#f8f9fa] to-white">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 text-[#1a5276]/60 hover:text-[#1a5276] mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to categories
            </Link>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-[#1a5276] mb-2">
              {categoryName}
            </h1>
            <p className="text-[#1a5276]/70">
              {services.length} service{services.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="pb-12 md:pb-16 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            {services.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#f8f9fa] rounded-2xl">
                <p className="text-[#1a5276]/60 mb-4">No services found in this category yet.</p>
                <Link
                  href="/discover"
                  className="text-[#1a5276] font-medium hover:text-[#d4a84b] underline"
                >
                  Browse other categories
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
