'use client'

import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ServiceEditForm } from '@/components/admin/ServiceEditForm'
import { ServiceViewMode } from '@/components/admin/ServiceViewMode'
import type { Service } from '@/types/service'

interface ServiceModalProps {
  isOpen: boolean
  service: Service | null
  mode: 'view' | 'edit' | 'create'
  onEdit: () => void
  onDelete: () => void
  onSave: () => void
  onCancel: () => void
  onClose: () => void
}

export function ServiceModal({
  isOpen,
  service,
  mode,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  onClose,
}: ServiceModalProps) {
  const title =
    mode === 'create' ? 'Add New Service' : mode === 'edit' ? `Edit: ${service?.name}` : service?.name || 'Service'

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-2xl w-[95vw] max-w-3xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
            <Dialog.Title className="text-lg font-semibold text-[#1a5276] truncate pr-4">
              {title}
            </Dialog.Title>
            <Dialog.Close className="p-1 rounded-lg hover:bg-gray-100 transition-colors shrink-0">
              <X className="w-5 h-5 text-[#1a5276]/60" />
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {mode === 'view' && service && (
              <ServiceViewMode service={service} onEdit={onEdit} onDelete={onDelete} />
            )}
            {(mode === 'edit' || mode === 'create') && (
              <ServiceEditForm
                service={mode === 'edit' ? service : null}
                onSave={onSave}
                onCancel={onCancel}
              />
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
