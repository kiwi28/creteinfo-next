'use client'

import { useState, useEffect } from 'react'
import { Link as LinkIcon, Check } from 'lucide-react'

/**
 * CopyLinkButton
 * - Copies the current page URL to clipboard
 * - Shows "Copied!" confirmation for a short time
 */
export default function CopyLinkButton({ className = '' }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(t)
  }, [copied])

  const getCurrentUrl = () => {
    if (typeof window === 'undefined') return ''
    return window.location.href
  }

  const copyToClipboard = async () => {
    const url = getCurrentUrl()
    if (!url) return

    // Use modern clipboard API if available
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        // Fallback: create temporary textarea
        const ta = document.createElement('textarea')
        ta.value = url
        // Avoid scrolling to bottom
        ta.style.position = 'fixed'
        ta.style.left = '-9999px'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
    } catch (e) {
      // Optionally handle error (e.g., show UI). For now, log.
      console.error('Copy failed', e)
    }
  }

  return (
    <button
      type="button"
      onClick={copyToClipboard}
      aria-label="Copy link to clipboard"
      className={
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ' +
        'bg-[#1a5276] text-white ' +
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ' +
        className
      }
    >
      <span className="flex items-center">
        {copied ? (
          <Check className="w-4 h-4 text-green-600" aria-hidden="true" />
        ) : (
          <LinkIcon className="w-4 h-4 text-gray-700 dark:text-gray-200" aria-hidden="true" />
        )}
      </span>

      <span>{copied ? 'Copied!' : 'Copy link'}</span>
    </button>
  )
}
