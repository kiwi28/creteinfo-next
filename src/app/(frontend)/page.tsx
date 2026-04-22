import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getServiceCategories, getServices } from '@/lib/services'
// import { getServiceCoverUrl } from '@/lib/utils'
import type { Service, ServiceType } from '@/types/service'
import { locationsMap } from '@/types/service'
import { ResultsSection } from '@/components/ResultsSection'
import CopyLinkButton from '@/components/CopyLinkBtn'
import { getFileUrl } from '@/lib/utils'

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

  // Check if any filters are active
  const hasActiveFilters = Boolean(params.q || params.category || params.location)

  // Fetch services AND categories in parallel
  let services: Service[] = []
  let categories: ServiceType[] = []

  try {
    // Fetch both in parallel for better performance
    const [servicesData, categoriesData] = await Promise.all([
      hasActiveFilters ? getServices(filter) : Promise.resolve([]),
      getServiceCategories(), // Fetch from PocketBase
    ])

    services = servicesData
    categories = categoriesData
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }

  // Create a mapping from slug to label for easy lookup
  const categoryLabelsMap = categories.reduce(
    (acc, categ) => {
      acc[categ.slug] = categ.label
      return acc
    },
    {} as Record<string, string>,
  )

  // Create a mapping from ID to label for category filter display
  const categoryLabelsByIdMap = categories.reduce(
    (acc, categ) => {
      acc[categ.id] = categ.label
      return acc
    },
    {} as Record<string, string>,
  )

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section - Only show when no filters are active */}
      <div className="md:mt-16">
        {!hasActiveFilters && (
          <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-linear-to-b from-[#1a5276]/60 via-[#1a5276]/40 to-white" />
              <div className="w-full h-full bg-linear-to-br from-[#2980b9] to-[#1a5276]" />
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

              {/* Location Filters */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2 md:gap-3">
                {Object.entries(locationsMap).map(([value, label]) => (
                  <Link
                    key={value}
                    href={`/?location=${value}`}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white hover:bg-[#d4a84b] hover:text-white backdrop-blur-sm transition-all border border-white/30"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Search Results Section - Only show when filters are active */}
        {hasActiveFilters && (
          <section className="pt-24 md:pt-0 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
              {/* Location Filters - Show at top of results too */}
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  {Object.entries(locationsMap).map(([value, label]) => {
                    const isActive = params.location === value
                    return (
                      <Link
                        key={value}
                        href={
                          isActive
                            ? `/?${params.q ? `q=${params.q}` : ''}${params.category ? `&category=${params.category}` : ''}`
                            : `/?location=${value}${params.q ? `&q=${params.q}` : ''}${params.category ? `&category=${params.category}` : ''}`
                        }
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-[#d4a84b] text-white'
                            : 'bg-[#1a5276]/10 text-[#1a5276] hover:bg-[#1a5276]/20'
                        }`}
                      >
                        {label}
                      </Link>
                    )
                  })}
                </div>
              </div>

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
                      `${params.q ? ' • ' : ''}${categoryLabelsByIdMap[params.category] || params.category}`}
                    {params.location &&
                      `${params.q || params.category ? ' • ' : ''}${params.location.charAt(0).toUpperCase() + params.location.slice(1).replace(/-/g, ' ')}`}
                  </p>
                )}
              </div>

              {/* Results Grid */}
              {services.length > 0 ? (
                // <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                //   {services.map((service) => (
                //     <ServiceCard key={service.slug} service={service} />
                //   ))}
                // </div>
                <ResultsSection services={services} />
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

      <section className="py-12 md:py-16 px-4 md:px-8">
        <div id="discover" className="relative bottom-24"></div>
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#1a5276] mb-8 text-center">
            Discover Crete
          </h1>
          {/* <div className="text-[#1a5276]/70 max-w-fit mx-auto space-y-2 text-center"> */}
          <div className="text-[#1a5276]/70 max-w-fit mx-auto space-y-2 text-left md:relative md:left-20">
            <p>Crete is not just a vacation... it&apos;s a state of mind</p>
            <br />
            <p>It&apos;s that morning when you drink your coffee looking at the sea.</p>
            <p>It&apos;s the smell of warm bread in a small village, where no one is in a hurry.</p>
            <p>
              It&apos;s the sound of the waves and the silence that makes you forget everything.
            </p>
            <br />
            <p>Crete cannot be explained. It can be felt.</p>
            <br />
            <p>It all started simply... from the desire to help.</p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="pb-12 md:pb-16 px-4 md:px-8 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => {
              return <CategoryCard key={category.slug} category={category} />
            })}
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
            Crete is the largest and most populous of the Greek islands, known for its stunning
            beaches, ancient Minoan ruins, and vibrant culture. From the Palace of Knossos to the
            beaches of Elafonisi, Crete offers something for every traveler.
          </p>
        </div>
      </section>
    </main>
  )
}

function CategoryCard({ category }: { category: ServiceType }) {
  const serviceImageUrl = getFileUrl(category.collectionId, category.id, category.coverImage)
  return (
    <Link
      href={`/?category=${category.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#1a5276]/10">
        <Image
          src={serviceImageUrl}
          alt={category.label}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>

      {/* Content */}
      <div className="p-3 md:p-4">
        <h3 className="font-semibold text-[#1a5276] text-sm md:text-base mb-1 group-hover:text-[#2980b9] transition-colors line-clamp-1">
          {category.label}
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
