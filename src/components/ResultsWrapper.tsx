'use client'

import type { Service } from '@/types/service'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star } from 'lucide-react'
import { locationsMap } from '@/types/service'
import { getServiceCoverUrl } from '@/lib/utils'
import { useServiceCategories } from '@/providers/ServiceCategories'

interface ResultsWrapperProps {
  services: Service[]
}

export function ResultsWrapper({ services }: ResultsWrapperProps) {
  return (
    <div className="max-w-7xl mx-auto">
      {services.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-[#1a5276]/60 mb-4">No services match your search criteria.</p>
          <Link href="/" className="text-[#1a5276] font-medium hover:text-[#d4a84b] underline">
            Clear filters and start over
          </Link>
        </div>
      )}
    </div>
  )
}

// Service Card Component - extracted from page.tsx
function ServiceCard({ service }: { service: Service }) {
  const imageUrl = getServiceCoverUrl(service) || '/images/placeholder-service.png'
  const categoryKey = service.category?.[0] || ''

  const serviceTypesData = useServiceCategories()
  const serviceTypes = serviceTypesData.serviceCategories
  const categoryLabelsMap = serviceTypes.reduce(
    (acc, categ) => {
      acc[categ.slug] = categ.label
      return acc
    },
    {} as Record<string, string>,
  )
  const categoryLabel = categoryLabelsMap[categoryKey] || categoryKey

  return (
    <Link
      href={`/services/${service.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#1a5276]/10">
        <Image
          src={imageUrl}
          alt={service.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {service.featured && (
          <div className="absolute top-2 right-2 bg-[#d4a84b] text-white px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 md:p-4">
        <h3 className="font-semibold text-[#1a5276] text-sm md:text-base mb-1 group-hover:text-[#2980b9] transition-colors line-clamp-1">
          {service.name}
        </h3>
        <div className="flex items-center gap-2 text-xs text-[#1a5276]/60">
          <span className="font-medium">{categoryLabel}</span>
          {(() => {
            const locs = Array.isArray(service.location)
              ? service.location
              : service.location
                ? [service.location]
                : []
            const labels = locs
              .map((l) => locationsMap[l as keyof typeof locationsMap] || l)
              .filter(Boolean)
            return labels.length > 0 ? (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {labels.join(', ')}
                </span>
              </>
            ) : null
          })()}
        </div>
        {service.description && (
          /* Content from admin's own PocketBase editor (trusted) */
          /* eslint-disable-next-line react/no-danger */
          <div
            className="text-xs text-[#1a5276]/50 mt-2 line-clamp-2 [&_p]:line-clamp-2"
            dangerouslySetInnerHTML={{ __html: service.description }}
          />
        )}
      </div>
    </Link>
  )
}
