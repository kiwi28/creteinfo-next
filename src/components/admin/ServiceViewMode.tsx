'use client'

import React from 'react'
import Image from 'next/image'
import { Pencil, Trash2, ExternalLink, Phone, Mail, MapPin } from 'lucide-react'
import { locationsMap } from '@/types/service'
import { getServiceCoverUrl, getServiceDetailUrls } from '@/lib/utils'
import type { Service } from '@/types/service'

interface ServiceViewModeProps {
  service: Service
  onEdit: () => void
  onDelete: () => void
}

export function ServiceViewMode({ service, onEdit, onDelete }: ServiceViewModeProps) {
  const coverUrl = getServiceCoverUrl(service)
  const detailUrls = getServiceDetailUrls(service)

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      {coverUrl && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
          <Image src={coverUrl} alt={service.name} fill className="object-cover" sizes="600px" />
        </div>
      )}

      {/* Detail Images */}
      {detailUrls.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#1a5276]/60 uppercase tracking-wider mb-2">
            Gallery ({detailUrls.length} images)
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {detailUrls.map((url, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
              >
                <Image
                  src={url}
                  alt={`${service.name} image ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="150px"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-[#1a5276]/60 uppercase tracking-wider">
            Name
          </label>
          <p className="text-[#1a5276] font-medium mt-0.5">{service.name}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-[#1a5276]/60 uppercase tracking-wider">
            Category
          </label>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {service.expand?.category?.map((c) => (
              <span
                key={c.id}
                className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#1a5276]/10 text-[#1a5276]"
              >
                {c.label}
              </span>
            ))}
            {!service.expand?.category || service.expand.category.length === 0 ? (
              <span className="text-sm text-[#1a5276]/50">—</span>
            ) : null}
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-[#1a5276]/60 uppercase tracking-wider">
            Location
          </label>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {(Array.isArray(service.location)
              ? service.location
              : service.location
                ? [service.location]
                : []
            ).map((l) => (
              <span
                key={l}
                className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#d4a84b]/10 text-[#d4a84b] flex items-center gap-1"
              >
                <MapPin className="w-3 h-3" />
                {locationsMap[l as keyof typeof locationsMap] || l}
              </span>
            ))}
            {!service.location && <span className="text-sm text-[#1a5276]/50">—</span>}
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div>
        <h3 className="text-sm font-semibold text-[#1a5276]/60 uppercase tracking-wider mb-2">
          Contact
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {service.contact && (
            <div className="text-sm text-[#1a5276]">
              <span className="text-[#1a5276]/50">Contact:</span> {service.contact}
            </div>
          )}
          {service.phone && (
            <div className="text-sm text-[#1a5276] flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <a href={`tel:${service.phone}`} className="hover:underline">
                {service.phone}
              </a>
            </div>
          )}
          {service.email && (
            <div className="text-sm text-[#1a5276] flex items-center gap-1">
              <Mail className="w-3 h-3" />
              <a href={`mailto:${service.email}`} className="hover:underline">
                {service.email}
              </a>
            </div>
          )}
          {service.website && (
            <div className="text-sm text-[#1a5276] flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              <a
                href={service.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline truncate"
              >
                Website
              </a>
            </div>
          )}
          {service.airbnb && (
            <div className="text-sm text-[#1a5276] flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              <a
                href={service.airbnb}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline truncate"
              >
                Airbnb
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Description - content from admin's own PocketBase editor (trusted) */}
      {service.description && (
        <div>
          <h3 className="text-sm font-semibold text-[#1a5276]/60 uppercase tracking-wider mb-2">
            Description
          </h3>
          {/* eslint-disable-next-line react/no-danger */}
          <div
            className="text-sm text-[#1a5276]/80 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: service.description }}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={onEdit}
          className="flex-1 py-2.5 bg-[#1a5276] text-white rounded-lg hover:bg-[#2980b9] transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-6 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  )
}
