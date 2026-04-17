'use client'

import React from 'react'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { categoryLabels, locationsMap } from '@/types/service'
import { getServiceCoverUrl } from '@/lib/utils'
import type { Service } from '@/types/service'

interface ServicesTableProps {
  services: Service[]
  isLoading: boolean
  onRowClick: (service: Service) => void
}

export function ServicesTable({ services, isLoading, onRowClick }: ServicesTableProps) {
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
                Flags
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#1a5276]/70 uppercase tracking-wider">
                Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => {
              const imageUrl = getServiceCoverUrl(service)
              const categories = service.category
                ?.map((c) => categoryLabels[c] || c)
                .join(', ')
              const location =
                locationsMap[service.location as keyof typeof locationsMap] || service.location

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
                    <div className="flex gap-1.5">
                      {service.featuredExplore && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#d4a84b]/10 text-[#d4a84b]">
                          Featured
                        </span>
                      )}
                      {service.flag && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#1a5276]/10 text-[#1a5276]">
                          Flag
                        </span>
                      )}
                    </div>
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
