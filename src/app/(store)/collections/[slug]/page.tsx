import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

type PageProps = { params: { slug: string } }

export default async function CollectionPage({ params }: PageProps) {
  const collection = await prisma.collection.findUnique({
    where: { slug: params.slug },
  })

  if (!collection) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-8">
      <div className="mb-10 space-y-4">
        <p className="text-sm uppercase tracking-[0.24em] text-[#999]">Collection</p>
        <h1 className="text-4xl font-semibold text-[var(--ink)]">{collection.name}</h1>
        {collection.description ? (
          <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
            {collection.description}
          </p>
        ) : null}
      </div>

      {collection.image ? (
        <div className="mb-10 overflow-hidden rounded-[4px] border border-[var(--border)] bg-white">
          <img src={collection.image} alt={collection.name} className="w-full object-cover" />
        </div>
      ) : null}

      <div className="rounded-[4px] border border-[var(--border)] bg-white p-8">
        <p className="text-base leading-7 text-[var(--muted)]">
          This collection is managed from the admin console. Add a cover image and description to make it shine on the shop homepage.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center rounded-xl border border-black px-5 py-3 text-sm font-semibold text-black transition hover:bg-black/5"
          >
            Back to shop
          </Link>
        </div>
      </div>
    </div>
  )
}
