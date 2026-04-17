'use client'

import React, { useState } from 'react'
import { useAdminAuth } from '@/components/admin/AdminAuthContext'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const { login, isAuthenticated, isLoading } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#1a5276] animate-spin" />
      </div>
    )
  }

  if (isAuthenticated) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }
    setIsSubmitting(true)
    try {
      await login(email, password)
    } catch {
      toast.error('Invalid email or password')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1a5276] to-[#2980b9] flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1a5276]">Crete Info Admin</h1>
          <p className="text-[#1a5276]/60 mt-1">Sign in to manage services</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#1a5276] mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#1a5276]/20 focus:border-[#1a5276] focus:ring-2 focus:ring-[#1a5276]/20 outline-none transition-all text-[#1a5276]"
              placeholder="admin@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#1a5276] mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#1a5276]/20 focus:border-[#1a5276] focus:ring-2 focus:ring-[#1a5276]/20 outline-none transition-all text-[#1a5276]"
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-[#1a5276] text-white rounded-lg hover:bg-[#2980b9] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
