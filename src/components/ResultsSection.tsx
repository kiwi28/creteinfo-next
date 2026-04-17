'use client'

import { useEffect, useRef } from 'react'
import { useNavigationLoading } from '@/hooks/useNavigationLoading'
import { LoadingWrapper } from '@/components/LoadingWrapper'
import { ResultsWrapper } from '@/components/ResultsWrapper'
import type { Service } from '@/types/service'

export function ResultsSection({ services }: { services: Service[] }) {
  const { isPending, stopNavigation } = useNavigationLoading()
  const prevServicesRef = useRef(services)

  useEffect(() => {
    if (isPending && prevServicesRef.current !== services) {
      stopNavigation()
    }
    prevServicesRef.current = services
  }, [services, isPending, stopNavigation])

  return (
    <LoadingWrapper isLoading={isPending} className="min-h-[200px]">
      <ResultsWrapper services={services} />
    </LoadingWrapper>
  )
}
