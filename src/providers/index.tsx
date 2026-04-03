import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { LoadingProvider } from '@/context/LoadingContext'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <HeaderThemeProvider>{children}</HeaderThemeProvider>
      </LoadingProvider>
    </ThemeProvider>
  )
}
