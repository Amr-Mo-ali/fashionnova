'use client'
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react'

export default function ProductImage({
  src,
  alt,
  className = '',
}: {
  src: string | null
  alt: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-[#e8e0d4] text-sm uppercase tracking-[0.2em] text-[#7a7068] ${className}`}>
        Image unavailable
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover ${className}`}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}
