'use client'

import React from 'react'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { locationsMap } from '@/types/service'
import { getServiceCoverUrl } from '@/lib/utils'
import type { Service, ServiceType } from '@/types/service'

interface ServicesTableProps {
  services: Service[]
  isLoading: boolean
  categories: ServiceType[]
  onRowClick: (service: Service) => void
}

export function ServicesTable({ services, categories, isLoading, onRowClick }: ServicesTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-12 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#1a5276] animate-spin" />
      </div>
    )
  }

  if (services.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
        <p className="text-[#1a5276]/60">No services found</p>
      </div>
    )
  }

  const categoryLabels = categories.reduce(
    (acc, categ) => {
      acc[categ.slug] = categ.label
      return acc
    },
    {} as Record<string, string>,
  )

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-[#1a5276]/5">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#1a5276]/70 uppercase tracking-wider">
                Image
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#1a5276]/70 uppercase tracking-wider">
                Name
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#1a5276]/70 uppercase tracking-wider">
                Category
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#1a5276]/70 uppercase tracking-wider">
                Location
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#1a5276]/70 uppercase tracking-wider">
                Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => {
              const imageUrl = getServiceCoverUrl(service)
              const categories = service.category?.map((c) => categoryLabels[c] || c).join(', ')
              const rawLocations = Array.isArray(service.location)
                ? service.location
                : service.location
                  ? [service.location]
                  : []
              const location = rawLocations
                .map((l) => locationsMap[l as keyof typeof locationsMap] || l)
                .join(', ')

              return (
                <tr
                  key={service.id}
                  onClick={() => onRowClick(service)}
                  className="border-b last:border-b-0 hover:bg-[#1a5276]/5 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 relative">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={service.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No img
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-[#1a5276]">{service.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[#1a5276]/70">{categories || '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[#1a5276]/70">{location || '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-[#1a5276]/50">
                      {new Date(service.updated).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
