import React from 'react'

import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { NavigationLoadingProvider } from '@/hooks/useNavigationLoading'

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InitTheme />
      <Providers>
        <NavigationLoadingProvider>
          <Header />
          {children}
          <Footer />
        </NavigationLoadingProvider>
      </Providers>
    </>
  )
}
