'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Menu, X, ChevronDown, Search, MapPin } from 'lucide-react'

// Service type options
const serviceTypes = [
  { label: 'Restaurants', value: 'restaurants' },
  { label: 'Taxi', value: 'taxi' },
  { label: 'Boats', value: 'boats' },
  { label: 'Excursions', value: 'excursions' },
  { label: 'Rent a Car', value: 'rent-a-car' },
  { label: 'Accommodations', value: 'accommodations' },
  { label: 'Shops', value: 'shops' },
  { label: 'Cretan Groups', value: 'cretan-groups' },
]

// Location options
const locations = [
  { label: 'Heraklion', value: 'heraklion' },
  { label: 'Chania', value: 'chania' },
  { label: 'Rethymno', value: 'rethymno' },
  { label: 'Agios Nikolaos', value: 'agios-nikolaos' },
  { label: 'Elounda', value: 'elounda' },
  { label: 'Agia Pelagia', value: 'agia-pelagia' },
  { label: 'Malia', value: 'malia' },
  { label: 'Hersonissos', value: 'hersonissos' },
]

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

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

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Read URL params on mount
  useEffect(() => {
    const q = searchParams.get('q')
    const category = searchParams.get('category')
    const location = searchParams.get('location')

    if (q) setSearchQuery(q)
    if (category) setSelectedCategory(category)
    if (location) setSelectedLocation(location)
  }, [searchParams])

  // Update URL when filters change
  useEffect(() => {
    if (debouncedSearch !== searchParams.get('q') ||
        selectedCategory !== searchParams.get('category') ||
        selectedLocation !== searchParams.get('location')) {

      const params = new URLSearchParams()
      if (debouncedSearch) params.set('q', debouncedSearch)
      if (selectedCategory) params.set('category', selectedCategory)
      if (selectedLocation) params.set('location', selectedLocation)

      const newUrl = params.toString() ? `/?${params.toString()}` : '/'

      // Only update if we have active filters
      if (debouncedSearch || selectedCategory || selectedLocation) {
        router.replace(newUrl, { scroll: false })
      }
    }
  }, [debouncedSearch, selectedCategory, selectedLocation, router, searchParams])

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
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedCategory(null)
    setSelectedLocation(null)
    router.push('/', { scroll: false })
  }, [router])

  // Check if any filters are active
  const hasActiveFilters = debouncedSearch || selectedCategory || selectedLocation

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || hasActiveFilters
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-[#1a5276]/5'
          : 'bg-white'
      }`}
    >
      {/* Main Header Row */}
      <div className="w-full px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Brand - Offset Left */}
          <Link href="/" className="group flex items-center gap-3 z-10 shrink-0">
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#1a5276] to-[#2980b9] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <span className="text-white font-display text-lg md:text-xl font-bold">C</span>
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative z-10 p-2 rounded-lg hover:bg-[#1a5276]/5 transition-colors"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <div className="w-6 h-6 relative">
              <Menu className={`absolute inset-0 w-6 h-6 text-[#1a5276] transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`} />
              <X className={`absolute inset-0 w-6 h-6 text-[#1a5276] transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Search & Filters Section */}
      <div className="w-full px-4 md:px-8 pb-4 border-t border-[#1a5276]/10">
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a5276]/50" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
          <p className="text-xs font-semibold text-[#1a5276]/60 uppercase tracking-wider mb-2">Service Type</p>
          <div className="flex flex-wrap gap-2">
            {serviceTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedCategory(selectedCategory === type.value ? null : type.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === type.value
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
        <div>
          <p className="text-xs font-semibold text-[#1a5276]/60 uppercase tracking-wider mb-2">
            <MapPin className="w-3 h-3 inline mr-1" />
            Location
          </p>
          <div className="flex flex-wrap gap-2">
            {locations.map((loc) => (
              <button
                key={loc.value}
                onClick={() => setSelectedLocation(selectedLocation === loc.value ? null : loc.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedLocation === loc.value
                    ? 'bg-[#d4a84b] text-white'
                    : 'bg-[#d4a84b]/10 text-[#d4a84b] hover:bg-[#d4a84b]/20'
                }`}
              >
                {loc.label}
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

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white md:hidden transition-transform duration-500 ease-out shadow-2xl ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-[#1a5276]/10">
            <div className="flex items-center justify-between">
              <span className="font-display text-[#1a5276] text-xl font-semibold">Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-lg hover:bg-[#1a5276]/5">
                <X className="w-5 h-5 text-[#1a5276]" />
              </button>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            {serviceTypes.map((type) => (
              <Link
                key={type.value}
                href={`/?category=${type.value}`}
                className="block px-6 py-3 text-base font-medium text-[#1a5276]/70 hover:text-[#1a5276] hover:bg-[#1a5276]/5"
                onClick={() => setIsMenuOpen(false)}
              >
                {type.label}
              </Link>
            ))}
          </nav>
          <div className="p-6 border-t border-[#1a5276]/10 bg-gradient-to-b from-[#f8f9fa] to-white">
            <p className="text-sm text-[#1a5276]/60 text-center font-medium">
              Discover the beauty of Crete
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
