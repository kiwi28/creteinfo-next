import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { ArrowRight, MapPin, Star } from 'lucide-react'
import { getServices } from '@/lib/services'

export const metadata: Metadata = {
  title: 'Crete Info - Your Gateway to the Island of Crete',
  description: 'Discover the best restaurants, taxis, boat tours, accommodations, and services in Crete. Your complete guide to exploring this beautiful Greek island.',
}

interface Service {
  id: string
  name: string
  slug: string
  category: string
  location?: string
  description?: string
  featuredExplore?: boolean
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

interface HomePageProps {
  searchParams: {
    q?: string
    category?: string
    location?: string
  }
}

// Category display names
const categoryLabels: Record<string, string> = {
  restaurants: 'Restaurants',
  taxi: 'Taxi',
  boats: 'Boats',
  excursions: 'Excursions',
  'rent-a-car': 'Rent a Car',
  accommodations: 'Accommodations',
  shops: 'Shops',
  'cretan-groups': 'Cretan Groups',
}

export default async function HomePage({ searchParams }: HomePageProps) {
  // Build filter object
  const filter: { q?: string; category?: string; location?: string } = {}
  if (searchParams.q) filter.q = searchParams.q
  if (searchParams.category) filter.category = searchParams.category
  if (searchParams.location) filter.location = searchParams.location

  // Check if any filters are active
  const hasActiveFilters = Boolean(searchParams.q || searchParams.category || searchParams.location)

  // Fetch services based on filters
  let services: Service[] = []
  let featuredServices: Service[] = []

  try {
    if (hasActiveFilters) {
      services = await getServices(filter)
    }
    // Always fetch featured services for explore section
    featuredServices = await getServices({ featuredExplore: true })
  } catch (error) {
    console.error('Failed to fetch services:', error)
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section - Only show when no filters are active */}
      {!hasActiveFilters && (
        <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a5276]/60 via-[#1a5276]/40 to-white" />
            <div className="w-full h-full bg-gradient-to-br from-[#2980b9] to-[#1a5276]" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4">
            <div className="mb-6">
              <div className="w-16 h-1 bg-[#d4a84b] rounded-full mx-auto" />
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              Welcome to <span className="text-[#d4a84b]">Crete</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-xl mb-8">
              Discover pristine beaches, ancient ruins, and authentic Cretan hospitality
            </p>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 bg-white text-[#1a5276] px-6 py-3 rounded-full font-semibold hover:bg-[#d4a84b] hover:text-white transition-all duration-300 shadow-lg"
            >
              Discover Crete
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Search Results Section - Only show when filters are active */}
      {hasActiveFilters && (
        <section className="pt-48 md:pt-44 pb-8 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Results Header */}
            <div className="mb-6">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1a5276]">
                {services.length > 0
                  ? `${services.length} result${services.length !== 1 ? 's' : ''} found`
                  : 'No results found'}
              </h2>
              {(searchParams.q || searchParams.category || searchParams.location) && (
                <p className="text-[#1a5276]/60 mt-1">
                  {searchParams.q && `Search: "${searchParams.q}"`}
                  {searchParams.category && `${searchParams.q ? ' • ' : ''}${categoryLabels[searchParams.category] || searchParams.category}`}
                  {searchParams.location && `${searchParams.q || searchParams.category ? ' • ' : ''}${searchParams.location.charAt(0).toUpperCase() + searchParams.location.slice(1).replace(/-/g, ' ')}`}
                </p>
              )}
            </div>

            {/* Results Grid */}
            {services.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-[#1a5276]/60 mb-4">No services match your search criteria.</p>
                <Link
                  href="/"
                  className="text-[#1a5276] font-medium hover:text-[#d4a84b] underline"
                >
                  Clear filters and start over
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Explore Crete Section - Always show */}
      <section className="py-12 md:py-16 px-4 md:px-8 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1a5276]">
                Explore Crete
              </h2>
              <p className="text-[#1a5276]/60 mt-1">
                Featured services handpicked for you
              </p>
            </div>
            <Link
              href="/discover"
              className="hidden md:inline-flex items-center gap-2 text-[#1a5276] font-medium hover:text-[#d4a84b] transition-colors"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Featured Services Grid */}
          {featuredServices.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredServices.slice(0, 8).map((service) => (
                <ServiceCard key={service.id} service={service} featured />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl">
              <p className="text-[#1a5276]/60">
                Featured services coming soon...
              </p>
            </div>
          )}

          {/* Mobile View All Link */}
          <div className="md:hidden text-center mt-6">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 text-[#1a5276] font-medium hover:text-[#d4a84b]"
            >
              View all services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 md:py-16 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1a5276] mb-4">
            About Crete
          </h2>
          <p className="text-[#1a5276]/70 leading-relaxed mb-6">
            Crete is the largest and most populous of the Greek islands, known for its stunning beaches,
            ancient Minoan ruins, and vibrant culture. From the Palace of Knossos to the beaches of Elafonisi,
            Crete offers something for every traveler.
          </p>
          <Link
            href="/info"
            className="inline-flex items-center gap-2 text-[#1a5276] font-semibold hover:text-[#d4a84b] transition-colors"
          >
            Learn More About Crete
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}

// Service Card Component
function ServiceCard({ service, featured = false }: { service: Service; featured?: boolean }) {
  const imageUrl = service.images?.[0]?.image?.url || '/images/placeholder-service.jpg'
  const categoryLabel = categoryLabels[service.category] || service.category

  return (
    <Link
      href={`/services/${service.slug}`}
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
        {featured && (
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
                {service.location.charAt(0).toUpperCase() + service.location.slice(1).replace(/-/g, ' ')}
              </span>
            </>
          )}
        </div>
        {service.description && (
          <p className="text-xs text-[#1a5276]/50 mt-2 line-clamp-2">
            {service.description}
          </p>
        )}
      </div>
    </Link>
  )
}
