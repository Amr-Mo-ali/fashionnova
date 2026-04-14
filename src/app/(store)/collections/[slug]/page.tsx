import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

type PageProps = { params: { slug: string } }

export default async function CollectionPage({ params }: PageProps) {
  let collection = null

  try {
    collection = await prisma.collection.findUnique({
      where: { slug: params.slug },
    })
  } catch (error) {
    console.error('Failed to load collection:', error)
    notFound()
  }

  if (!collection) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-8">
      <div className="mb-10 space-y-4">
        <p className="text-sm font-bold uppercase tracking-[0.08em] text-[rgba(250,250,250,0.6)]">Collection</p>
        <h1 className="text-4xl font-black text-[#FAFAFA]">{collection.name}</h1>
        {collection.description ? (
          <p className="max-w-2xl text-base leading-7 text-[rgba(250,250,250,0.6)]">
            {collection.description}
          </p>
        ) : null}
      </div>

      {collection.image ? (
        <div className="mb-10 overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#111113]">
          <img src={collection.image} alt={collection.name} className="w-full object-cover" />
        </div>
      ) : null}

      <div className="rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#111113] p-8">
        <p className="text-base leading-7 text-[rgba(250,250,250,0.6)]">
          This collection is managed from the admin console. Add a cover image and description to make it shine on the shop homepage.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center rounded-xl border border-[#8B5CF6] px-5 py-3 text-sm font-bold text-[#8B5CF6] transition hover:bg-[#8B5CF6]/15"
          >
            Back to shop
          </Link>
        </div>
      </div>
    </div>
  )
}
