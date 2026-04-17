'use client'

import React from 'react'
import { Toaster } from 'sonner'
import { AdminAuthProvider, useAdminAuth } from '@/components/admin/AdminAuthContext'
import { Loader2, LogOut } from 'lucide-react'
import './admin.css'

function AdminTopBar() {
  const { isAuthenticated, logout } = useAdminAuth()

  if (!isAuthenticated) return null

  return (
    <div className="bg-[#1a5276] text-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#d4a84b] flex items-center justify-center">
          <span className="text-white font-bold text-sm">C</span>
        </div>
        <span className="font-semibold">Crete Info Admin</span>
      </div>
      <button
        onClick={logout}
        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  )
}

function AdminLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-[#1a5276] animate-spin" />
    </div>
  )
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAdminAuth()

  if (isLoading) return <AdminLoadingScreen />

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTopBar />
      <main>{children}</main>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <Toaster position="top-right" richColors />
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  )
}
