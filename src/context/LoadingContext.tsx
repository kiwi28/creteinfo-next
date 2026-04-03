'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

/**
 * LoadingContext - Shares loading state between Header and Page components
 *
 * WHY WE NEED THIS:
 * - Header (client component) triggers URL changes when filters change
 * - Page (server component) re-fetches data when URL params change
 * - We need to show a spinner during this fetch
 * - But Header and Page don't share a parent-child relationship
 * - Context allows us to share state across the component tree
 *
 * HOW IT WORKS:
 * 1. Header calls setLoading(true) when filters change
 * 2. ResultsWrapper (client component in Page) reads isLoading and shows spinner
 * 3. When new data arrives (component re-renders with new props), loading is set to false
 */

// Define the shape of our context
interface LoadingContextType {
  // Current loading state - true when filters are changing and data is being fetched
  isLoading: boolean
  // Function to set loading state - called from Header when filters change
  setLoading: (loading: boolean) => void
  // Convenience function to start loading
  startLoading: () => void
  // Convenience function to stop loading
  stopLoading: () => void
}

// Create the context with undefined default (we'll check for this in the hook)
const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

// Provider component - wraps the app to provide loading state
interface LoadingProviderProps {
  children: ReactNode
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  // Local state for loading - this is the "source of truth"
  const [isLoading, setIsLoading] = useState(false)

  // Stable reference functions using useCallback
  // These won't change on re-renders, preventing unnecessary re-renders of consumers
  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading)
  }, [])

  const startLoading = useCallback(() => {
    setIsLoading(true)
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

  // The value object is what all consumers will receive
  const value: LoadingContextType = {
    isLoading,
    setLoading,
    startLoading,
    stopLoading,
  }

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
}

// Custom hook to use the loading context
// This makes it easy to consume the context and provides good error messages
export function useLoading() {
  const context = useContext(LoadingContext)

  // This check ensures the hook is used within a LoadingProvider
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }

  return context
}
