import { HeaderClient } from './Component.client'
import React, { Suspense } from 'react'

// Simple header fallback for SSR
function HeaderFallback() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="w-full px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="group flex items-center gap-3 z-10 shrink-0">
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#1a5276] to-[#2980b9] flex items-center justify-center shadow-lg">
                <span className="text-white font-display text-lg md:text-xl font-bold">C</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-[#1a5276] text-lg md:text-xl font-semibold tracking-tight leading-tight">
                Welcome to
              </span>
              <span className="font-display text-[#1a5276] text-xl md:text-2xl font-bold tracking-tight leading-tight">
                Crete Info
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export function Header() {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <HeaderClient />
    </Suspense>
  )
}
