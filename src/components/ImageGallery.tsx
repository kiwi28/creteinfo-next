'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

interface ImageGalleryProps {
  images: string[]
  serviceName: string
}

export function ImageGallery({ images, serviceName }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const slides = images.map((src) => ({ src }))

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {images.map((url, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setIndex(i)
              setIsOpen(true)
            }}
            className="relative aspect-square rounded-lg overflow-hidden bg-[#f8f9fa] cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Image
              src={url}
              alt={`${serviceName} - Image ${i + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        index={index}
        slides={slides}
      />
    </>
  )
}
