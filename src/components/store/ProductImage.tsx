export default function ProductImage({
  src,
  alt,
  className = '',
}: {
  src: string | null
  alt: string
  className?: string
}) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-zinc-800 text-sm text-zinc-500 ${className}`}
      >
        No image
      </div>
    )
  }
  /* eslint-disable-next-line @next/next/no-img-element -- remote product URLs */
  return <img src={src} alt={alt} className={`object-cover ${className}`} loading="lazy" />
}
