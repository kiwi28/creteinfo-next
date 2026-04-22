'use client'

import React from 'react'
import Image from 'next/image'
import { Loader2, ChevronUp, ChevronDown } from 'lucide-react'
import { locationsMap } from '@/types/service'
import { getServiceCoverUrl } from '@/lib/utils'
import type { Service, ServiceType } from '@/types/service'

interface ServicesTableProps {
  services: Service[]
  isLoading: boolean
  onRowClick: (service: Service) => void
  sortConfig: { field: string | null; direction: 'asc' | 'desc' | null }
  onSort: (field: string) => void
}

type SortableField = 'name' | 'order' | 'updated' | 'created'

interface SortableHeaderProps {
  children: React.ReactNode
  field: SortableField
  sortConfig: { field: string | null; direction: 'asc' | 'desc' | null }
  onSort: (field: string) => void
}

function SortableHeader({ children, field, sortConfig, onSort }: SortableHeaderProps) {
  const isActive = sortConfig.field === field
  const direction = isActive ? sortConfig.direction : null

  return (
    <th
      className="text-left px-4 py-3 text-xs font-semibold text-[#1a5276]/70 uppercase tracking-wider cursor-pointer hover:bg-[#1a5276]/5 transition-colors select-none group"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <span className="ml-1 inline-flex">
          {isActive && direction === 'asc' && <ChevronUp className="w-3 h-3 text-[#1a5276]" />}
          {isActive && direction === 'desc' && <ChevronDown className="w-3 h-3 text-[#1a5276]" />}
          {!isActive && (
            <span className="w-3 h-3 flex items-center justify-center text-[#1a5276]/30 opacity-0 group-hover:opacity-50 transition-opacity">
              <ChevronUp className="w-3 h-3" />
            </span>
          )}
        </span>
      </div>
    </th>
  )
}

export function ServicesTable({
  services,
  isLoading,
  onRowClick,
  sortConfig,
  onSort,
}: ServicesTableProps) {
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
              <SortableHeader field="name" sortConfig={sortConfig} onSort={onSort}>
                Name
              </SortableHeader>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#1a5276]/70 uppercase tracking-wider">
                Category
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#1a5276]/70 uppercase tracking-wider">
                Location
              </th>
              <SortableHeader field="order" sortConfig={sortConfig} onSort={onSort}>
                Order
              </SortableHeader>
              <SortableHeader field="updated" sortConfig={sortConfig} onSort={onSort}>
                Updated
              </SortableHeader>
              <SortableHeader field="created" sortConfig={sortConfig} onSort={onSort}>
                Created
              </SortableHeader>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => {
              const imageUrl = getServiceCoverUrl(service)
              const categories = service.expand.category?.map((cat) => cat.label).join(', ')
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
                    <span className="text-sm text-[#1a5276]/70">{service.order || '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-[#1a5276]/50">
                      {new Date(service.updated).toLocaleString('ro-RO', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-[#1a5276]/50">
                      {new Date(service.created).toLocaleString('ro-RO', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
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
