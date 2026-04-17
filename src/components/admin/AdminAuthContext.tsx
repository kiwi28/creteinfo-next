'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { pb } from '@/lib/pocketbase'

interface AdminAuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null)

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setIsAuthenticated(pb.authStore.isValid)
    setIsLoading(false)

    const unsubscribe = pb.authStore.onChange((_token, record) => {
      setIsAuthenticated(!!record)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (isLoading) return

    const isAdminRoute = pathname?.startsWith('/admin')
    const isLoginPage = pathname === '/admin/login'

    if (isAdminRoute && !isAuthenticated && !isLoginPage) {
      router.replace('/admin/login')
    }
  }, [isAuthenticated, isLoading, pathname, router])

  const login = useCallback(
    async (email: string, password: string) => {
      await pb.collection('users').authWithPassword(email, password)
      router.replace('/admin')
    },
    [router],
  )

  const logout = useCallback(() => {
    pb.authStore.clear()
    router.replace('/admin/login')
  }, [router])

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}
