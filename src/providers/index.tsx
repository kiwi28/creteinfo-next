import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { ServiceCategoriesProvider } from './ServiceCategories'
import { ServiceType } from '@/types/service'

export const Providers: React.FC<{
  children: React.ReactNode
  serviceCategories?: ServiceType[]
}> = ({ children, serviceCategories }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <ServiceCategoriesProvider initialCategories={serviceCategories}>
          {children}
        </ServiceCategoriesProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
