'use client'

import { Loader2 } from 'lucide-react'

interface LoadingWrapperProps {
  isLoading: boolean
  children: React.ReactNode
  className?: string
}

export function LoadingWrapper({ isLoading, children, className = '' }: LoadingWrapperProps) {
  return (
    <div className={`relative ${className}`}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center transition-opacity">
          <Loader2 className="w-8 h-8 text-[#1a5276] animate-spin" />
        </div>
      )}
    </div>
  )
}
