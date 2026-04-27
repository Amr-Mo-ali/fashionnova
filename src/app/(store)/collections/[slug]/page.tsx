/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

type PageProps = { params: Promise<{ slug: string }> }

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params

  let collection = null

  try {
    collection = await prisma.collection.findUnique({
      where: { slug },
    })
  } catch (error) {
    console.error('Failed to load collection:', error)
    notFound()
  }

  if (!collection) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 md:py-24">
      <div className="mb-10 space-y-4">
        <p className="text-label text-[#b8976a]">Collection</p>
        <h1 className="font-serif text-[42px] leading-none text-[#0f0e0d] sm:text-[56px]">
          <span className="font-[300]">Curated </span>
          <span className="font-[900]">{collection.name}</span>
        </h1>
        {collection.description ? (
          <p className="max-w-2xl text-[14px] leading-7 text-[#7a7068] sm:text-[16px]">
            {collection.description}
          </p>
        ) : null}
      </div>

      {collection.image ? (
        <div className="dramatic-card mb-10 overflow-hidden">
          <img src={collection.image} alt={`${collection.name} collection image`} className="w-full object-cover" />
        </div>
      ) : null}

      <div className="dramatic-card p-8">
        <p className="text-[14px] leading-7 text-[#7a7068]">
          This collection is managed from the admin console. Add a cover image and
          description to make it shine on the shop homepage.
        </p>
        <div className="mt-8">
          <Link href="/" className="btn-secondary">
            Back to shop
          </Link>
        </div>
      </div>
    </div>
  )
}
