import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { ArrowLeft, MapPin, Phone, Mail, Globe, MessageCircle } from 'lucide-react'
import { getServiceById, getServices } from '@/lib/services'
import { getServiceCoverUrl, getServiceDetailUrls } from '@/lib/utils'
import type { Service } from '@/types/service'
import { categoryLabels, locationsMap } from '@/types/service'

// Revalidate service detail pages every 5 minutes as a safety net
export const revalidate = 300
import CopyLinkButton from '@/components/CopyLinkBtn'
import { ImageGallery } from '@/components/ImageGallery'

interface ServicePageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateStaticParams() {
  const services = await getServices({})
  return services.map((service) => ({
    id: service.id,
  }))
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { id } = await params
  const service = await getServiceById(id)

  if (!service) {
    return {
      title: 'Service Not Found - Crete Info',
      description: 'The requested service could not be found.',
    }
  }

  // const categoryLabel = categoryLabels[service.category?.[0]] || service.category?.[0] || 'Service'

  return {
    title: `${service.name} - Crete Info`,
    description: service.description || `Discover ${service.name} in Crete.`,
    openGraph: {
      title: service.name,
      description: service.description || `Discover ${service.name} in Crete.`,
      images: getServiceCoverUrl(service) ? [getServiceCoverUrl(service)!] : [],
    },
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { id } = await params
  const service = await getServiceById(id)

  console.log('----> service page:', id, service)

  if (!service) {
    notFound()
    return null
  }

  const categoryLabel = categoryLabels[service.category?.[0]] || service.category?.[0] || 'Service'
  const coverImageUrl = getServiceCoverUrl(service)
  const detailImageUrls = getServiceDetailUrls(service)

  return (
    <main className="min-h-screen bg-white pt-32 pb-16 ">
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
            href={`/?category=${service.category?.[0]}`}
            className="text-sm text-[#1a5276]/60 hover:text-[#1a5276] transition-colors"
          >
            {categoryLabel}
          </Link>
          <span className="mx-2 text-[#1a5276]/40">/</span>
          <span className="text-sm font-medium text-[#1a5276]">{service.name}</span>
        </nav>

        {/* Cover Image */}
        {coverImageUrl && (
          <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-8">
            <Image src={coverImageUrl} alt={service.name} fill className="object-cover" priority />
          </div>
        )}

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
                {(() => {
                  const locs = Array.isArray(service.location)
                    ? service.location
                    : service.location
                      ? [service.location]
                      : []
                  return locs
                    .map((l) => locationsMap[l as keyof typeof locationsMap] || l)
                    .filter(Boolean)
                    .map((label, i) => (
                      <span key={i} className="flex items-center gap-1 text-xs text-[#1a5276]/60">
                        <MapPin className="w-3 h-3" />
                        {label}
                      </span>
                    ))
                })()}
                <CopyLinkButton />
              </div>
            </div>

            {/* Description */}
            {service.description && (
              <div className="bg-[#f8f9fa] rounded-xl p-6">
                <div
                  className="text-[#1a5276]/80 leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: service.description }}
                />
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
                    <a
                      href={`tel:${service.phone}`}
                      className="text-[#1a5276] hover:text-[#2980b9] transition-colors"
                    >
                      {service.phone}
                    </a>
                  </div>
                )}
                {service.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#1a5276]/60" />
                    <a
                      href={`mailto:${service.email}`}
                      className="text-[#1a5276] hover:text-[#2980b9] transition-colors"
                    >
                      {service.email}
                    </a>
                  </div>
                )}
                {service.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-[#1a5276]/60" />
                    <a
                      href={
                        service.website.startsWith('http')
                          ? service.website
                          : `https://${service.website}`
                      }
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
                    <svg
                      className="w-5 h-5 text-[#1a5276]/60"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12.001 18.5c-1.64-2.326-3.2-4.124-3.2-5.9 0-1.768 1.433-3.2 3.2-3.2 1.768 0 3.2 1.432 3.2 3.2 0 1.776-1.56 3.574-3.2 5.9zm0-13.5c-4.478 0-8.5 3.624-8.5 7.6 0 3.316 2.542 6.383 4.96 8.883a29.46 29.46 0 003.54 3.117 29.46 29.46 0 003.54-3.117c2.418-2.5 4.96-5.567 4.96-8.883 0-3.976-4.022-7.6-8.5-7.6z" />
                    </svg>
                    <a
                      href={
                        service.airbnb.startsWith('http')
                          ? service.airbnb
                          : `https://${service.airbnb}`
                      }
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
            <h2 className="font-display text-xl font-semibold text-[#1a5276] mb-4">Gallery</h2>
            {detailImageUrls.length > 0 ? (
              <ImageGallery images={detailImageUrls} serviceName={service.name} />
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
