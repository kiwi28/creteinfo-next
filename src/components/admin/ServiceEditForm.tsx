'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Loader2, Save, X } from 'lucide-react'
import { toast } from 'sonner'
import { locationsMap } from '@/types/service'
import { createService, updateService } from '@/lib/admin-services'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { ImageUpload } from '@/components/admin/ImageUpload'
import type { Service, ServiceFormData } from '@/types/service'
import { useServiceCategories } from '@/providers/ServiceCategories'

interface ServiceEditFormProps {
  service: Service | null
  onSave: () => void
  onCancel: () => void
}

export function ServiceEditForm({ service, onSave, onCancel }: ServiceEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newCoverFile, setNewCoverFile] = useState<File[]>([])
  const [newDetailFiles, setNewDetailFiles] = useState<File[]>([])
  const [removeCoverImage, setRemoveCoverImage] = useState(false)
  const [removeDetailImages, setRemoveDetailImages] = useState<string[]>([])

  // Normalize location to array
  const normalizeLocation = (loc: string | string[] | undefined): string[] => {
    if (Array.isArray(loc)) return loc
    if (loc) return [loc]
    return []
  }

  const { register, handleSubmit, setValue, watch } = useForm<ServiceFormData>({
    defaultValues: {
      name: service?.name || '',
      category: service?.category || [],
      location: normalizeLocation(service?.location),
      contact: service?.contact || '',
      phone: service?.phone || '',
      email: service?.email || '',
      website: service?.website || '',
      airbnb: service?.airbnb || '',
      description: service?.description || '',
    },
  })

  const description = watch('description')
  const selectedCategories = watch('category') || []
  const selectedLocations = normalizeLocation(watch('location'))

  const toggleCategory = (value: string) => {
    const current = selectedCategories
    if (current.includes(value)) {
      setValue(
        'category',
        current.filter((c) => c !== value),
      )
    } else if (current.length < 2) {
      setValue('category', [...current, value])
    }
  }

  const toggleLocation = (value: string) => {
    const current = selectedLocations
    if (current.includes(value)) {
      setValue(
        'location',
        current.filter((l) => l !== value),
      )
    } else {
      setValue('location', [...current, value])
    }
  }

  const onSubmit = async (data: ServiceFormData) => {
    if (!data.name.trim()) {
      toast.error('Service name is required')
      return
    }

    setIsSubmitting(true)
    try {
      const payload: ServiceFormData = {
        ...data,
        location: data.location,
        coverImage: newCoverFile[0] || null,
        detailImages: newDetailFiles,
        removeCoverImage,
        removeDetailImages,
      }

      if (service) {
        await updateService(service.id, payload, service.detailImages || [])
        toast.success('Service updated successfully')
      } else {
        await createService(payload)
        toast.success('Service created successfully')
      }
      onSave()
    } catch (err: unknown) {
      let message = 'Failed to save service'
      if (err && typeof err === 'object' && 'data' in err) {
        const validationErrors = (err as { data: Record<string, { message?: string }> }).data
        const firstError = Object.values(validationErrors)[0]
        if (firstError?.message) message = firstError.message
      } else if (err instanceof Error) {
        message = err.message
      }
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const serviceTypesData = useServiceCategories()
  const serviceTypes = serviceTypesData.serviceCategories
  const categoryLabels = serviceTypes.reduce(
    (acc, categ) => {
      acc[categ.slug] = categ.label
      return acc
    },
    {} as Record<string, string>,
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name */}
      <div>
        <label className="block text-xs font-semibold text-[#1a5276]/60 uppercase tracking-wider mb-1">
          Name <span className="text-red-400">*</span>
        </label>
        <input
          {...register('name', { required: true })}
          className="w-full px-3 py-2 rounded-lg border border-[#1a5276]/20 focus:border-[#1a5276] focus:ring-2 focus:ring-[#1a5276]/20 outline-none transition-all text-[#1a5276] text-sm"
          placeholder="Service name"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-semibold text-[#1a5276]/60 uppercase tracking-wider mb-1">
          Category (max 2)
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryLabels).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => toggleCategory(value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategories.includes(value)
                  ? 'bg-[#1a5276] text-white'
                  : 'bg-[#1a5276]/10 text-[#1a5276] hover:bg-[#1a5276]/20'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs font-semibold text-[#1a5276]/60 uppercase tracking-wider mb-1">
          Location
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(locationsMap).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => toggleLocation(value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedLocations.includes(value)
                  ? 'bg-[#d4a84b] text-white'
                  : 'bg-[#d4a84b]/10 text-[#d4a84b] hover:bg-[#d4a84b]/20'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Contact Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#1a5276]/60 uppercase tracking-wider mb-1">
            Contact
          </label>
          <input
            {...register('contact')}
            className="w-full px-3 py-2 rounded-lg border border-[#1a5276]/20 focus:border-[#1a5276] focus:ring-2 focus:ring-[#1a5276]/20 outline-none transition-all text-[#1a5276] text-sm"
            placeholder="Contact name"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#1a5276]/60 uppercase tracking-wider mb-1">
            Phone
          </label>
          <input
            {...register('phone')}
            className="w-full px-3 py-2 rounded-lg border border-[#1a5276]/20 focus:border-[#1a5276] focus:ring-2 focus:ring-[#1a5276]/20 outline-none transition-all text-[#1a5276] text-sm"
            placeholder="Phone number"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#1a5276]/60 uppercase tracking-wider mb-1">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-3 py-2 rounded-lg border border-[#1a5276]/20 focus:border-[#1a5276] focus:ring-2 focus:ring-[#1a5276]/20 outline-none transition-all text-[#1a5276] text-sm"
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#1a5276]/60 uppercase tracking-wider mb-1">
            Website
          </label>
          <input
            {...register('website')}
            type="url"
            className="w-full px-3 py-2 rounded-lg border border-[#1a5276]/20 focus:border-[#1a5276] focus:ring-2 focus:ring-[#1a5276]/20 outline-none transition-all text-[#1a5276] text-sm"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#1a5276]/60 uppercase tracking-wider mb-1">
            Airbnb
          </label>
          <input
            {...register('airbnb')}
            type="url"
            className="w-full px-3 py-2 rounded-lg border border-[#1a5276]/20 focus:border-[#1a5276] focus:ring-2 focus:ring-[#1a5276]/20 outline-none transition-all text-[#1a5276] text-sm"
            placeholder="https://airbnb.com/..."
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-[#1a5276]/60 uppercase tracking-wider mb-1">
          Description
        </label>
        <RichTextEditor
          content={description || ''}
          onChange={(html) => setValue('description', html)}
        />
      </div>

      {/* Images */}
      <ImageUpload
        service={service}
        mode="cover"
        newFiles={newCoverFile}
        onNewFilesChange={setNewCoverFile}
        removeCoverImage={removeCoverImage}
        onRemoveCoverChange={setRemoveCoverImage}
      />

      <ImageUpload
        service={service}
        mode="detail"
        newFiles={newDetailFiles}
        onNewFilesChange={setNewDetailFiles}
        onRemoveExisting={(filename) => setRemoveDetailImages((prev) => [...prev, filename])}
        removeCoverImage={false}
        onRemoveCoverChange={() => {}}
        removedFiles={removeDetailImages}
      />

      {/* Submit */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2.5 bg-[#1a5276] text-white rounded-lg hover:bg-[#2980b9] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-[#1a5276] hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </form>
  )
}
