'use client'

import Image from 'next/image'
import { useMemo } from 'react'

function resolveImageSrc(src: string): string {
  const trimmed = src.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  if (trimmed.startsWith('/')) return trimmed
  return `/${trimmed.replace(/^\/+/, '')}`
}

export default function ProductImage({
  src,
  alt,
  className = '',
}: {
  src: string | null
  alt: string
  className?: string
}) {
  const resolved = useMemo(() => (src ? resolveImageSrc(src) : null), [src])

  if (!resolved) {
    return (
      <div
        className={`flex items-center justify-center bg-[#EEEBE6] text-sm text-[#6B6B6B] ${className}`}
      >
        <span className="font-semibold uppercase tracking-[0.25em]">FN</span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={resolved}
        alt={alt}
        fill
        unoptimized
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}
