'use client'

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

/**
 * Navigation Loading Context
 *
 * Tracks navigation state for showing loading indicators.
 * Works with both link clicks and programmatic navigation (router.replace/push).
 *
 * Usage:
 * 1. Wrap your app with NavigationLoadingProvider
 * 2. Use useNavigationLoading() to read the loading state
 * 3. Call startNavigation() before programmatic navigation (router.replace/push)
 */

interface NavigationLoadingState {
  isPending: boolean
  isLoading: boolean
  startNavigation: () => void
}

const NavigationLoadingContext = createContext<NavigationLoadingState>({
  isPending: false,
  isLoading: false,
  startNavigation: () => {},
})

interface NavigationLoadingProviderProps {
  children: ReactNode
}

export function NavigationLoadingProvider({ children }: NavigationLoadingProviderProps) {
  const [isPending, setIsPending] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const prevUrlRef = useRef('')

  // Reset loading state when URL changes (navigation completed)
  useEffect(() => {
    const currentUrl = `${pathname}?${searchParams.toString()}`

    if (prevUrlRef.current && prevUrlRef.current !== currentUrl) {
      setIsPending(false)
    }

    prevUrlRef.current = currentUrl
  }, [pathname, searchParams])

  // Listen for navigation events via link clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href]')

      if (link && !link.hasAttribute('target') && !e.metaKey && !e.ctrlKey) {
        const href = link.getAttribute('href')
        // Only track internal navigation
        if (href && (href.startsWith('/') || href.startsWith(window.location.origin))) {
          setIsPending(true)
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const startNavigation = () => setIsPending(true)

  const value: NavigationLoadingState = {
    isPending,
    isLoading: isPending,
    startNavigation,
  }

  return (
    <NavigationLoadingContext.Provider value={value}>
      {children}
    </NavigationLoadingContext.Provider>
  )
}

/**
 * Hook to access navigation loading state.
 *
 * Requires NavigationLoadingProvider to be wrapped around your app
 * for the loading state to be tracked.
 */
export function useNavigationLoading(): NavigationLoadingState {
  return useContext(NavigationLoadingContext)
}
