import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Discover Crete - Explore Services',
  description:
    'Browse all service categories in Crete - restaurants, taxis, boat tours, accommodations, and more.',
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
  {
    id: 'info-site',
    title: 'Info Site',
    description: 'Discover useful information and resources about Crete',
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  },
]

function CategoryCard({ category }: { category: (typeof categories)[0] }) {
  return (
    <Link
      href={`/discover/${category.id}`}
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

export default function DiscoverPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="md:mt-16">
        {/* Header */}
        <section className="py-12 md:py-16 px-4 md:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-[#1a5276] mb-4">
              Discover Crete
            </h1>
            <p className="text-[#1a5276]/70 max-w-2xl mx-auto">
              Explore our curated selection of services and experiences across the island. From
              authentic restaurants to boat tours, find everything you need for your Crete
              adventure.
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
      </div>
    </main>
  )
}
