'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { X, Search, MapPin } from 'lucide-react'
import { locationsMap } from '@/types/service'
import { useNavigationLoading } from '@/hooks/useNavigationLoading'
import { useServiceCategories } from '@/providers/ServiceCategories'

export function HeaderClient() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { startNavigation } = useNavigationLoading()

  // Ref to track if we're syncing from URL (prevents circular updates)
  const isSyncingFromUrl = useRef(false)

  // Check if we're on the homepage
  const isHomePage = pathname === '/'

  // Check if we're on a services page (hide filters there)
  const isServicesPage = pathname?.startsWith('/services')

  const serviceTypesData = useServiceCategories()
  const serviceTypes = serviceTypesData.serviceCategories

  // Read URL params on mount or when returning to homepage
  useEffect(() => {
    // Only sync from URL on homepage
    if (!isHomePage) return

    const q = searchParams.get('q') ?? ''
    const category = searchParams.get('category')
    const location = searchParams.get('location')

    // Prevent this URL sync from triggering a URL update
    isSyncingFromUrl.current = true
    setSearchQuery(q)
    setSelectedCategory(category)
    setSelectedLocation(location)
    // Reset the flag after a microtask
    queueMicrotask(() => {
      isSyncingFromUrl.current = false
    })
  }, [searchParams, isHomePage])

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (!isHomePage) return
    if (!isSyncingFromUrl.current) {
      handleSearch()
    }
  }, [selectedCategory, selectedLocation, isHomePage])

  // Handle search submission
  const handleSearch = useCallback(() => {
    // if (!isHomePage) return

    const params = new URLSearchParams()

    if (searchQuery.trim()) params.set('q', searchQuery.trim())
    if (isServicesPage) {
      params.set('category', '')
      params.set('location', '')
    } else {
      if (selectedCategory) params.set('category', selectedCategory)
      if (selectedLocation) params.set('location', selectedLocation)
    }

    const newUrl = params.toString() ? `/?${params.toString()}` : '/'
    startNavigation()
    router.replace(newUrl, { scroll: false })
  }, [searchQuery, selectedCategory, selectedLocation, router, isHomePage, startNavigation])

  // Handle Enter key in search input
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSearch()
      }
    },
    [handleSearch],
  )

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedCategory(null)
    setSelectedLocation(null)
    startNavigation()
    router.push('/', { scroll: false })
  }, [router, startNavigation])

  // Check if any filters are active
  const hasActiveFilters = searchQuery || selectedCategory || selectedLocation

  return (
    <header className="bg-white">
      {/* Main Header Row */}
      <div
        className={`px-4 md:px-0 fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-[#1a5276]/5' : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto py-4">
          <div className="flex items-center justify-between gap-20">
            {/* Brand - Offset Left */}
            <Link href="/" className="group flex items-center gap-3 z-10 shrink-0">
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-gradient-to-br from-[#1a5276] to-[#2980b9] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Image
                    src="/logo.png"
                    alt="Crete Info"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#d4a84b] rounded-full opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-[#1a5276] text-lg md:text-xl font-semibold tracking-tight leading-tight">
                  Welcome to
                </span>
                <span className="font-display text-[#1a5276] text-xl md:text-2xl font-bold tracking-tight leading-tight">
                  Crete Info
                </span>
              </div>
            </Link>

            <div className="relative grow-1 gap-2 hidden md:flex">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a5276]/50" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search services..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#1a5276]/20 focus:border-[#1a5276] focus:ring-2 focus:ring-[#1a5276]/20 outline-none transition-all text-[#1a5276] placeholder:text-[#1a5276]/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[#1a5276]/10 transition-colors"
                  >
                    <X className="w-4 h-4 text-[#1a5276]/50" />
                  </button>
                )}
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-[#1a5276] text-white rounded-xl hover:bg-[#2980b9] transition-colors font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative z-10 p-2 rounded-lg hover:bg-[#1a5276]/5 transition-colors"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <div className="w-6 h-6 relative">
                <Search
                  className={`absolute inset-0 w-6 h-6 text-[#1a5276] transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`}
                />
                <X
                  className={`absolute inset-0 w-6 h-6 text-[#1a5276] transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filters Section - Desktop only, Hidden on /services pages */}
      {!isServicesPage && (
        <div className="px-4 md:px-0 hidden md:block max-w-7xl mx-auto py-4 pt-28 border-t border-[#1a5276]/10">
          {/* Service Type Buttons */}
          <div>
            <p className="text-xs font-semibold text-[#1a5276]/60 uppercase tracking-wider mb-2">
              Service Type
            </p>
            <div className="flex flex-wrap gap-2">
              {serviceTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setSelectedCategory(selectedCategory === type.id ? null : type.id)
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === type.id
                      ? 'bg-[#1a5276] text-white'
                      : 'bg-[#1a5276]/10 text-[#1a5276] hover:bg-[#1a5276]/20'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-3 text-sm text-[#1a5276]/60 hover:text-[#1a5276] underline underline-offset-2"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Mobile Menu Overlay */}
      <div
        className={`z-10 fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`z-20 fixed top-10 right-0 bottom-0 w-[85%] max-w-sm bg-white md:hidden transition-transform duration-500 ease-out shadow-2xl ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Mobile Search & Filters - Only show if not on services page */}
          <div className="p-4 border-b mt-14 border-[#1a5276]/10">
            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a5276]/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search services..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#1a5276]/20 focus:border-[#1a5276] focus:ring-2 focus:ring-[#1a5276]/20 outline-none transition-all text-[#1a5276] placeholder:text-[#1a5276]/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[#1a5276]/10 transition-colors"
                >
                  <X className="w-4 h-4 text-[#1a5276]/50" />
                </button>
              )}
            </div>

            {/* Service Type Buttons */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-[#1a5276]/60 uppercase tracking-wider mb-2">
                Service Type
              </p>
              <div className="flex flex-wrap gap-2">
                {serviceTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() =>
                      setSelectedCategory(selectedCategory === type.id ? null : type.id)
                    }
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === type.id
                        ? 'bg-[#1a5276] text-white'
                        : 'bg-[#1a5276]/10 text-[#1a5276] hover:bg-[#1a5276]/20'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Buttons */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-[#1a5276]/60 uppercase tracking-wider mb-2">
                <MapPin className="w-3 h-3 inline mr-1" />
                Location
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(locationsMap).map((entry) => {
                  const [value, label] = entry
                  return (
                    <button
                      key={value}
                      onClick={() => setSelectedLocation(selectedLocation === value ? null : value)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedLocation === value
                          ? 'bg-[#d4a84b] text-white'
                          : 'bg-[#d4a84b]/10 text-[#d4a84b] hover:bg-[#d4a84b]/20'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-[#1a5276]/60 hover:text-[#1a5276] underline underline-offset-2"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Search Button Footer */}
          <div className="p-6 border-t border-[#1a5276]/10 bg-gradient-to-b from-[#f8f9fa] to-white mt-auto">
            <button
              onClick={() => {
                handleSearch()
                setIsMenuOpen(false)
              }}
              className="w-full py-3 bg-[#1a5276] text-white rounded-xl hover:bg-[#2980b9] transition-colors font-medium flex items-center justify-center gap-2 shadow-lg"
            >
              <Search className="w-5 h-5" />
              See results
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
