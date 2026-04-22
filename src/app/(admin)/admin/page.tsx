'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/components/admin/AdminAuthContext'
import { ServicesTable } from '@/components/admin/ServicesTable'
import { ServiceModal } from '@/components/admin/ServiceModal'
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog'
import { fetchServices } from '@/lib/admin-services'
import { Plus, Search, X } from 'lucide-react'
import type { Service, ServiceType } from '@/types/service'
// import { useServiceCategories } from '@/providers/ServiceCategories'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getServiceCategories } from '@/lib/services'

export default function AdminPage() {
  const { isAuthenticated, isLoading: authLoading } = useAdminAuth()
  const [services, setServices] = useState<Service[]>([])
  const [serviceCategories, setServiceCategories] = useState<ServiceType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Sort state: { field: string | null, direction: 'asc' | 'desc' | null }
  const [sortConfig, setSortConfig] = useState<{
    field: string | null
    direction: 'asc' | 'desc' | null
  }>({
    field: null,
    direction: null,
  })

  // Modal state
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view')

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null)

  const loadServices = useCallback(async (query?: string, category?: string, sort?: string) => {
    setIsLoading(true)
    try {
      const data = await fetchServices({ query, category, sort })
      setServices(data)
    } catch {
      // error handled by toast in caller
    } finally {
      setIsLoading(false)
    }
  }, [])
  const loadServiceCategories = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getServiceCategories()
      setServiceCategories(data)
    } catch {
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      // Build sort string from config
      let sortString = '-order' // default
      if (sortConfig.field && sortConfig.direction) {
        sortString = `${sortConfig.direction === 'desc' ? '-' : ''}${sortConfig.field}`
      }
      loadServices(searchQuery || undefined, selectedCategory, sortString)
      loadServiceCategories()
    }
  }, [isAuthenticated, searchQuery, selectedCategory, sortConfig, loadServices])

  const getSortString = () => {
    if (sortConfig.field && sortConfig.direction) {
      return `${sortConfig.direction === 'desc' ? '-' : ''}${sortConfig.field}`
    }
    return '-order'
  }

  const handleSort = (field: string) => {
    setSortConfig((current) => {
      if (current.field !== field) {
        // New field - start with ascending
        return { field, direction: 'asc' }
      }
      if (current.direction === 'asc') {
        // Same field, was ascending - switch to descending
        return { field, direction: 'desc' }
      }
      if (current.direction === 'desc') {
        // Same field, was descending - clear sort
        return { field: null, direction: null }
      }
      // Was null - start with ascending
      return { field, direction: 'asc' }
    })
  }

  const handleClearAll = () => {
    setSearchInput('')
    setSearchQuery('')
    setSelectedCategory('all')
    setSortConfig({ field: null, direction: null })
  }

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || sortConfig.field

  if (authLoading || !isAuthenticated) return null

  const handleRowClick = (service: Service) => {
    setSelectedService(service)
    setModalMode('view')
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setSelectedService(null)
    setModalMode('create')
    setIsModalOpen(true)
  }

  const handleEdit = () => {
    setModalMode('edit')
  }

  const handleDelete = () => {
    setDeleteTarget(selectedService)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    const { deleteService } = await import('@/lib/admin-services')
    const { toast } = await import('sonner')
    try {
      await deleteService(deleteTarget.id)
      toast.success('Service deleted successfully')
      const sortString = getSortString()
      await loadServices(searchQuery || undefined, selectedCategory, sortString)
      setIsModalOpen(false)
      setSelectedService(null)
    } catch {
      toast.error('Failed to delete service')
    }
    setDeleteTarget(null)
  }

  const handleSave = async () => {
    const sortString = getSortString()
    await loadServices(searchQuery || undefined, selectedCategory, sortString)
    setIsModalOpen(false)
    setSelectedService(null)
  }

  const handleCancel = () => {
    if (modalMode === 'edit') {
      setModalMode('view')
    } else {
      setIsModalOpen(false)
      setSelectedService(null)
    }
  }

  const handleSearch = () => {
    const q = searchInput.trim()
    setSearchQuery(q)
    const sortString = getSortString()
    loadServices(q || undefined, selectedCategory, sortString)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a5276]">Services</h1>
          <p className="text-sm text-[#1a5276]/60">
            {searchQuery ? `${services.length} results` : `${services.length} total records`}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {/* Clear All Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="shrink-0 px-4 py-2 border border-[#1a5276]/20 text-[#1a5276] rounded-lg hover:bg-[#1a5276]/5 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          )}

          {/* Category Filter */}
          <div className="w-48">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {serviceCategories.map((category) => {
                  return (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.label}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a5276]/40" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search services..."
              className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-lg border border-[#1a5276]/20 focus:border-[#1a5276] focus:ring-2 focus:ring-[#1a5276]/20 outline-none transition-all text-sm text-[#1a5276]"
            />
          </div>
          <button
            onClick={handleSearch}
            className="shrink-0 px-4 py-2 bg-[#1a5276] text-white rounded-lg hover:bg-[#2980b9] transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
          <button
            onClick={handleAddNew}
            className="shrink-0 px-4 py-2 bg-[#d4a84b] text-white rounded-lg hover:bg-[#d4a84b]/90 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add New</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <ServicesTable
        services={services}
        isLoading={isLoading}
        onRowClick={handleRowClick}
        sortConfig={sortConfig}
        onSort={handleSort}
      />

      {/* Service Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        service={selectedService}
        mode={modalMode}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSave={handleSave}
        onCancel={handleCancel}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedService(null)
        }}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        serviceName={deleteTarget?.name || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
