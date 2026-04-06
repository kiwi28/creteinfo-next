import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin, Star } from 'lucide-react'
import { getServices } from '@/lib/services'
import { getServiceCoverUrl } from '@/lib/utils'
import type { Service } from '@/types/service'
import { categoryLabels, locationsMap } from '@/types/service'
import { ResultsWrapper } from '@/components/ResultsWrapper'
import CopyLinkButton from '@/components/CopyLinkBtn'

export const metadata: Metadata = {
  title: 'Crete Info - Your Gateway to the Island of Crete',
  description:
    'Discover the best restaurants, taxis, boat tours, accommodations, and services in Crete. Your complete guide to exploring this beautiful Greek island.',
}

interface HomePageProps {
  searchParams: {
    q?: string
    category?: string
    location?: string
  }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  // Build filter object
  const params = await searchParams
  const filter: { q?: string; category?: string; location?: string } = {}
  if (params.q) filter.q = params.q
  if (params.category) filter.category = params.category
  if (params.location) filter.location = params.location

  console.log('-----------------------> homepage filter:', filter)

  // Check if any filters are active
  const hasActiveFilters = Boolean(params.q || params.category || params.location)

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
      <div className="md:mt-16">
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
                href="/#discover"
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
          <section className="pt-48 md:pt-0 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
              {/* Results Header */}
              <div className="mb-6">
                <h2 className="flex font-display text-2xl md:text-3xl font-bold text-[#1a5276]">
                  {services.length > 0
                    ? `${services.length} result${services.length !== 1 ? 's' : ''} found`
                    : 'No results found'}
                  <div className="mx-6">
                    <CopyLinkButton />
                  </div>
                </h2>
                {(params.q || params.category || params.location) && (
                  <p className="text-[#1a5276]/60 mt-1">
                    {params.q && `Search: "${params.q}"`}
                    {params.category &&
                      `${params.q ? ' • ' : ''}${categoryLabels[params.category] || params.category}`}
                    {params.location &&
                      `${params.q || params.category ? ' • ' : ''}${params.location.charAt(0).toUpperCase() + params.location.slice(1).replace(/-/g, ' ')}`}
                  </p>
                )}
              </div>

              {/* Results Grid */}
              {services.length > 0 ? (
                // <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                //   {services.map((service) => (
                //     <ServiceCard key={service.id} service={service} />
                //   ))}
                // </div>
                <ResultsWrapper services={services} />
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
      </div>

      {/* Explore Crete Section - Always show */}

      {/* <section className="py-12 md:py-16 px-4 md:px-8 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1a5276]">
                Explore Crete
              </h2>
              <p className="text-[#1a5276]/60 mt-1">Featured services handpicked for you</p>
            </div>
            <Link
              href="/discover"
              className="hidden md:inline-flex items-center gap-2 text-[#1a5276] font-medium hover:text-[#d4a84b] transition-colors"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredServices.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredServices.slice(0, 8).map((service) => (
                <ServiceCard key={service.id} service={service} featured />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl">
              <p className="text-[#1a5276]/60">Featured services coming soon...</p>
            </div>
          )}

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
      </section> */}
      <section className="py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#1a5276] mb-4">
            Discover Crete
          </h1>
          <p className="text-[#1a5276]/70 max-w-2xl mx-auto">
            Explore our curated selection of services and experiences across the island. From
            authentic restaurants to boat tours, find everything you need for your Crete adventure.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="pb-12 md:pb-16 px-4 md:px-8 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>
      <a href="discover" />

      {/* Info Section */}
      <section className="py-12 md:py-16 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1a5276] mb-4">
            About Crete
          </h2>
          <p className="text-[#1a5276]/70 leading-relaxed mb-6">
            Crete is the largest and most populous of the Greek islands, known for its stunning
            beaches, ancient Minoan ruins, and vibrant culture. From the Palace of Knossos to the
            beaches of Elafonisi, Crete offers something for every traveler.
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

const categories = [
  {
    id: 'restaurants',
    title: 'Restaurants',
    description: 'Discover authentic Greek cuisine and international dining options',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 'cretan-groups',
    title: 'Cretan Groups',
    description: 'Join local groups and communities to experience authentic Crete',
    image:
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 'shops',
    title: 'Shops',
    description: 'Find local crafts, souvenirs, and shopping experiences',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 'taxi',
    title: 'Taxi',
    description: 'Reliable transportation services across Crete',
    image:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 'boats',
    title: 'Boats',
    description: 'Explore the Mediterranean with boat tours and rentals',
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 'excursions',
    title: 'Excursions',
    description: 'Guided tours and adventure experiences in Crete',
    image:
      'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 'rent-a-car',
    title: 'Rent a Car',
    description: 'Freedom to explore Crete at your own pace',
    image:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 'accommodations',
    title: 'Accommodations',
    description: 'Find the perfect place to stay during your Crete adventure',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  },
]

function CategoryCard({ category }: { category: (typeof categories)[0] }) {
  return (
    <Link
      href={`/?category=${category.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#1a5276]/10">
        <Image
          src={category.image}
          alt={category.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>

      {/* Content */}
      <div className="p-3 md:p-4">
        <h3 className="font-semibold text-[#1a5276] text-sm md:text-base mb-1 group-hover:text-[#2980b9] transition-colors line-clamp-1">
          {category.title}
        </h3>
        <p className="text-xs text-[#1a5276]/60 line-clamp-2 mb-2">{category.description}</p>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#1a5276] group-hover:text-[#d4a84b] transition-colors">
          View All
          <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  )
}

// Service Card Component
// function ServiceCard({ service, featured = false }: { service: Service; featured?: boolean }) {
//   const imageUrl = getServiceCoverUrl(service) || '/images/placeholder-service.jpg'
//   const categoryKey = service.category?.[0] || ''
//   const categoryLabel = categoryLabels[categoryKey] || categoryKey

//   return (
//     <Link
//       href={`/services/${service.id}`}
//       className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
//     >
//       {/* Image */}
//       <div className="relative aspect-[4/3] overflow-hidden bg-[#1a5276]/10">
//         <Image
//           src={imageUrl}
//           alt={service.name}
//           fill
//           className="object-cover group-hover:scale-105 transition-transform duration-500"
//           sizes="(max-width: 768px) 50vw, 25vw"
//         />
//         {featured && (
//           <div className="absolute top-2 right-2 bg-[#d4a84b] text-white px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
//             <Star className="w-3 h-3 fill-current" />
//             Featured
//           </div>
//         )}
//       </div>

//       {/* Content */}
//       <div className="p-3 md:p-4">
//         <h3 className="font-semibold text-[#1a5276] text-sm md:text-base mb-1 group-hover:text-[#2980b9] transition-colors line-clamp-1">
//           {service.name}
//         </h3>
//         <div className="flex items-center gap-2 text-xs text-[#1a5276]/60">
//           <span className="font-medium">{categoryLabel}</span>
//           {service.location && (
//             <>
//               <span>•</span>
//               <span className="flex items-center gap-1">
//                 <MapPin className="w-3 h-3" />
//                 {locationsMap[service.location as keyof typeof locationsMap] || ''}
//               </span>
//             </>
//           )}
//         </div>
//         {service.description && (
//           <p className="text-xs text-[#1a5276]/50 mt-2 line-clamp-2">{service.description}</p>
//         )}
//       </div>
//     </Link>
//   )
// }
