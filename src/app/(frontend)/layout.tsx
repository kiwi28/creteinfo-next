import React from 'react'

import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { NavigationLoadingProvider } from '@/hooks/useNavigationLoading'
import { getServiceCategories } from '@/lib/services'

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  // Fetch server-side
  const serviceCategories = await getServiceCategories()

  return (
    <>
      <InitTheme />
      <Providers serviceCategories={serviceCategories}>
        <NavigationLoadingProvider>
          <Header />
          {children}
          <Footer />
        </NavigationLoadingProvider>
      </Providers>
    </>
  )
}
