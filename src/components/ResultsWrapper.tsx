'use client'

import { useEffect } from 'react'
import { useLoading } from '@/context/LoadingContext'
import type { Service } from '@/types/service'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star } from 'lucide-react'
import { categoryLabels, locationsMap } from '@/types/service'
import { getServiceCoverUrl } from '@/lib/utils'

/**
 * ResultsWrapper - Client component that wraps the search results
 *
 * WHY THIS IS A CLIENT COMPONENT:
 * - Server components can't use hooks like useLoading()
 * - We need to react to loading state changes
 * - Client components can show/hide the spinner based on context
 *
 * HOW IT WORKS:
 * 1. Receives services data as props from parent (server component)
 * 2. Uses useLoading() hook to get current loading state
 * 3. When isLoading is true, shows a spinner overlay
 * 4. When isLoading is false, shows the actual results
 *
 * IMPORTANT: The useEffect stops loading when services prop changes
 * This is how we know the server has finished fetching new data
 */

interface ResultsWrapperProps {
  // Services data passed from the server component
  services: Service[]
  // Filter params for display
  searchQuery?: string
  category?: string
  location?: string
}

// Simple spinner component
function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Animated spinner using Tailwind CSS */}
      <div className="relative w-12 h-12">
        {/* Outer ring - static */}
        <div className="absolute inset-0 border-4 border-[#1a5276]/20 rounded-full" />
        {/* Inner ring - animated */}
        <div className="absolute inset-0 border-4 border-transparent border-t-[#1a5276] rounded-full animate-spin" />
      </div>
      {/* Loading text */}
      <p className="mt-4 text-[#1a5276]/60 text-sm font-medium">Searching...</p>
    </div>
  )
}

export function ResultsWrapper({ services, searchQuery, category, location }: ResultsWrapperProps) {
  // Get loading state from context
  const { isLoading, stopLoading } = useLoading()

  // IMPORTANT: This effect stops loading when new services arrive
  // This is the key connection between server data and client loading state
  // When services prop changes (server re-rendered with new data), we know loading is complete
  useEffect(() => {
    if (isLoading) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        stopLoading()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [services, isLoading, stopLoading])

  // Show spinner when loading
  if (isLoading) {
    return (
      <section className="pt-48 md:pt-12 pb-8 ">
        <div className="max-w-7xl mx-auto">
          <Spinner />
        </div>
      </section>
    )
  }

  // Show results when not loading
  return (
    <div className="max-w-7xl mx-auto">
      {/* Results Header */}

      {/* Results Grid or Empty State */}
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
  const categoryLabel = categoryLabels[categoryKey] || categoryKey

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
