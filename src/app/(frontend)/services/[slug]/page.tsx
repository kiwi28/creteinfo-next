import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { ArrowLeft, MapPin, Phone, Mail, Globe, Star, MessageCircle } from 'lucide-react'
import { getServices } from '@/lib/services'

interface Service {
  id: string
  name: string
  slug: string
  category: string
  location?: string
  contact?: string
  phone?: string
  email?: string
  website?: string
  airbnb?: string
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

interface ServicePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const services = await getServices({})
  return services.map((service) => ({
    slug: service.slug,
  }))
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params
  const services = await getServices({})
  const service = services.find(s => s.slug === slug)

  if (!service) {
    return {
      title: 'Service Not Found - Crete Info',
      description: 'The requested service could not be found.',
    }
  }

  return {
    title: `${service.meta?.title || service.name} - Crete Info`,
    description: service.meta?.description || service.description || `Discover ${service.name} in Crete.`,
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params
  const services = await getServices({})
  const service = services.find(s => s.slug === slug)

  if (!service) {
    notFound()
    return null
  }

  const categoryLabel = categoryLabels[service.category] || service.category

  return (
    <main className="min-h-screen bg-white pt-32 pb-16">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            href="/"
            className="text-sm text-[#1a5276]/60 hover:text-[#1a5276] transition-colors"
          >
            Home
          </Link>
          <span className="mx-2 text-[#1a5276]/40">/</span>
          <Link
            href={`/?category=${service.category}`}
            className="text-sm text-[#1a5276]/60 hover:text-[#1a5276] transition-colors"
          >
            {categoryLabel}
          </Link>
          <span className="mx-2 text-[#1a5276]/40">/</span>
          <span className="text-sm font-medium text-[#1a5276]">{service.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-[#1a5276] mb-2">
                {service.name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#1a5276] text-white">
                  {categoryLabel}
                </span>
                {service.location && (
                  <span className="flex items-center gap-1 text-xs text-[#1a5276]/60">
                    <MapPin className="w-3 h-3" />
                    {service.location.charAt(0).toUpperCase() + service.location.slice(1).replace(/-/g, ' ')}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {service.description && (
              <div className="bg-[#f8f9fa] rounded-xl p-6">
                <p className="text-[#1a5276]/80 leading-relaxed">
                  {service.description}
                </p>
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-[#1a5276]">
                Contact Information
              </h2>

              <div className="space-y-3">
                {service.contact && (
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-[#1a5276]/60" />
                    <span className="text-[#1a5276]">{service.contact}</span>
                  </div>
                )}
                {service.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#1a5276]/60" />
                    <a href={`tel:${service.phone}`} className="text-[#1a5276] hover:text-[#2980b9] transition-colors">
                      {service.phone}
                    </a>
                  </div>
                )}
                {service.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#1a5276]/60" />
                    <a href={`mailto:${service.email}`} className="text-[#1a5276] hover:text-[#2980b9] transition-colors">
                      {service.email}
                    </a>
                  </div>
                )}
                {service.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-[#1a5276]/60" />
                    <a
                      href={service.website.startsWith('http') ? service.website : `https://${service.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1a5276] hover:text-[#2980b9] transition-colors"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
                {service.airbnb && (
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#1a5276]/60" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    </svg>
                    <a
                      href={service.airbnb.startsWith('http') ? service.airbnb : `https://${service.airbnb}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1a5276] hover:text-[#2980b9] transition-colors"
                    >
                      View on Airbnb
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Gallery */}
          <div className="lg:col-span-1">
            <h2 className="font-display text-xl font-semibold text-[#1a5276] mb-4">
              Gallery
            </h2>
            {service.images && service.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {service.images.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden bg-[#f8f9fa]"
                  >
                    {img.image?.url ? (
                      <Image
                        src={img.image.url}
                        alt={`${service.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a5276]/20 to-[#2980b9]/20">
                        <span className="text-[#1a5276]/40 text-sm">No image</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="aspect-square rounded-lg bg-[#f8f9fa] flex items-center justify-center">
                <span className="text-[#1a5276]/40 text-sm">No images available</span>
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#1a5276] hover:text-[#2980b9] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
