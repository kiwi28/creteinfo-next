'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { Upload, X, Plus } from 'lucide-react'
import { getServiceCoverUrl, getServiceDetailUrls } from '@/lib/utils'
import type { Service } from '@/types/service'

interface ImageUploadProps {
  service?: Service | null
  mode: 'cover' | 'detail'
  newFiles: File[]
  onNewFilesChange: (files: File[]) => void
  onRemoveExisting?: (filename: string) => void
  removeCoverImage: boolean
  onRemoveCoverChange: (remove: boolean) => void
  removedFiles?: string[]
}

export function ImageUpload({
  service,
  mode,
  newFiles,
  onNewFilesChange,
  onRemoveExisting,
  removeCoverImage,
  onRemoveCoverChange,
  removedFiles = [],
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const existingUrls =
    mode === 'cover'
      ? service?.coverImage && !removeCoverImage && newFiles.length === 0
        ? [{ url: getServiceCoverUrl(service)!, filename: service.coverImage }]
        : []
      : service?.detailImages
          ?.filter((f) => !removedFiles.includes(f))
          .map((f, i) => {
            const urls = getServiceDetailUrls(service)
            const originalIndex = service.detailImages!.indexOf(f)
            return { url: urls[originalIndex], filename: f }
          }) || []

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return
    const fileArray = Array.from(files)
    if (mode === 'cover') {
      onNewFilesChange(fileArray.slice(0, 1))
    } else {
      onNewFilesChange([...newFiles, ...fileArray])
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const removeNewFile = (index: number) => {
    onNewFilesChange(newFiles.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-[#1a5276]/60 uppercase tracking-wider">
        {mode === 'cover' ? 'Cover Image' : 'Detail Images'}
      </label>
      <p className="text-[10px] text-[#1a5276]/40 -mt-1">Max file size: 5 MB per image</p>

      <div className="flex flex-wrap gap-2">
        {/* Existing images */}
        {existingUrls.map((img) => (
          <div key={img.filename} className="relative group">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 relative">
              <Image src={img.url} alt={img.filename} fill className="object-cover" sizes="80px" />
            </div>
            <button
              type="button"
              onClick={() => {
                if (mode === 'cover') {
                  onRemoveCoverChange(true)
                } else {
                  onRemoveExisting?.(img.filename)
                }
              }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* New file previews */}
        {newFiles.map((file, i) => (
          <div key={i} className="relative group">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 relative">
              <Image
                src={URL.createObjectURL(file)}
                alt={`New file ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <button
              type="button"
              onClick={() => removeNewFile(i)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Add button — hidden for cover if already has an image */}
        {(mode === 'detail' || (existingUrls.length === 0 && newFiles.length === 0)) && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`w-20 h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors ${
              dragOver
                ? 'border-[#1a5276] bg-[#1a5276]/5'
                : 'border-gray-300 hover:border-[#1a5276]/40 hover:bg-gray-50'
            }`}
          >
            {mode === 'cover' ? <Upload className="w-4 h-4 text-gray-400" /> : <Plus className="w-4 h-4 text-gray-400" />}
            <span className="text-[10px] text-gray-400">
              {mode === 'cover' ? 'Upload' : 'Add'}
            </span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={mode === 'detail'}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
    </div>
  )
}
