'use client'

import React, { useState } from 'react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { Loader2, AlertTriangle } from 'lucide-react'

interface DeleteConfirmDialogProps {
  isOpen: boolean
  serviceName: string
  onConfirm: () => Promise<void>
  onCancel: () => void
}

export function DeleteConfirmDialog({ isOpen, serviceName, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/40 z-[60]" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] bg-white rounded-xl shadow-2xl p-6 w-[90vw] max-w-sm">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <AlertDialog.Title className="text-lg font-semibold text-[#1a5276]">
                Delete Service
              </AlertDialog.Title>
              <AlertDialog.Description className="text-sm text-[#1a5276]/60 mt-1">
                Are you sure you want to delete <strong className="text-[#1a5276]">{serviceName}</strong>? This action
                cannot be undone.
              </AlertDialog.Description>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <AlertDialog.Cancel asChild>
              <button
                onClick={onCancel}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg border border-gray-300 text-[#1a5276] hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </AlertDialog.Cancel>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isDeleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
