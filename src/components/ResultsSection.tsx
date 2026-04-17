'use client'

import { useEffect } from 'react'
import { useNavigationLoading } from '@/hooks/useNavigationLoading'
import { LoadingWrapper } from '@/components/LoadingWrapper'
import { ResultsWrapper } from '@/components/ResultsWrapper'
import type { Service } from '@/types/service'

export function ResultsSection({ services }: { services: Service[] }) {
  const { isPending, stopNavigation } = useNavigationLoading()

  useEffect(() => {
    if (isPending) {
      stopNavigation()
    }
  }, [services, isPending, stopNavigation])

  return (
    <LoadingWrapper isLoading={isPending} className="min-h-[200px]">
      <ResultsWrapper services={services} />
    </LoadingWrapper>
  )
}
