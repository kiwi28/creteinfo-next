'use client'

import React, { createContext, use, useState, useEffect } from 'react'

import canUseDOM from '@/utilities/canUseDOM'
import { getServiceCategories } from '@/lib/services'
import { ServiceType } from '@/types/service'

export interface ContextType {
  serviceCategories: ServiceType[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

const initialContext: ContextType = {
  serviceCategories: [] as ServiceType[],
  isLoading: false,
  error: null,
  refetch: async () => {},
}

const ServiceCategoriesContext = createContext(initialContext)

export const ServiceCategoriesProvider = ({
  children,
  initialCategories = [],
}: {
  children: React.ReactNode
  initialCategories?: ServiceType[]
}) => {
  const [serviceCategories, setServiceCategories] = useState<ServiceType[]>(initialCategories)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const loadCategories = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const categories = await getServiceCategories()
      setServiceCategories(categories)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch service categories'))
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-load categories on mount if no initial categories provided
  useEffect(() => {
    if (initialCategories.length === 0) {
      loadCategories()
    }
  }, [])

  return (
    <ServiceCategoriesContext
      value={{
        serviceCategories,
        isLoading,
        error,
        refetch: loadCategories,
      }}
    >
      {children}
    </ServiceCategoriesContext>
  )
}

export const useServiceCategories = (): ContextType => use(ServiceCategoriesContext)
