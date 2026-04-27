/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import DeleteCollectionButton from '@/app/admin/components/DeleteCollectionButton'

export default async function AdminCollectionsPage() {
  let collections = [] as Array<{
    id: string
    title: string
    slug: string
    coverImage: string | null
    mediaType: string
    order: number
    updatedAt: Date
    _count: { products: number }
  }>
  let loadError = ''

  try {
    collections = await prisma.collection.findMany({
      orderBy: [{ order: 'desc' }, { updatedAt: 'desc' }],
      include: {
        _count: {
          select: { products: true },
        },
      },
    })
  } catch (error) {
    console.error('Failed to load collections:', error)
    loadError = 'Unable to load collections right now. Please try again later.'
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Collections</h1>
          <p className="mt-2 text-sm text-zinc-500">Manage curated storefront edits and the products inside them.</p>
        </div>
        <Link
          href="/admin/collections/new"
          className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
        >
          Add Collection
        </Link>
      </div>

      {loadError ? (
        <div className="rounded-2xl border border-red-500/40 bg-red-950 p-8 text-center text-red-300">
          {loadError}
        </div>
      ) : collections.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-400">
          <p className="text-lg font-medium">No collections yet</p>
          <p className="mt-2 text-sm">Create your first collection to showcase products.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900"
            >
              <div className="h-56 overflow-hidden bg-zinc-950">
                {collection.coverImage ? (
                  <img
                    src={collection.coverImage}
                    alt={collection.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-4 text-sm text-zinc-500">
                    No cover image
                  </div>
                )}
              </div>
              <div className="space-y-5 p-5">
                <div>
                  <p className="text-xl font-semibold text-white">{collection.title}</p>
                  <p className="mt-1 text-sm text-zinc-500">/{collection.slug}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs uppercase tracking-[0.18em] text-zinc-400">
                    {collection.mediaType}
                  </span>
                  <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
                    {collection._count.products} {collection._count.products === 1 ? 'product' : 'products'}
                  </span>
                  <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
                    Order {collection.order}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/collections/${collection.slug}`}
                    className="rounded-2xl border border-zinc-600 px-4 py-3 text-sm font-medium text-white transition hover:border-zinc-400"
                  >
                    Manage
                  </Link>
                  <DeleteCollectionButton
                    collectionSlug={collection.slug}
                    collectionTitle={collection.title}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
