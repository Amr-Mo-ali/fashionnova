import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import DeleteCollectionButton from '@/app/admin/components/DeleteCollectionButton'

const VIDEO_PATTERN = /\.(mp4|mov|webm)(\?|$)/i

function isVideoUrl(url: string | null | undefined) {
  return typeof url === 'string' && VIDEO_PATTERN.test(url)
}

export default async function AdminCollectionsPage() {
  let collections = [] as Array<{
    id: string
    name: string
    slug: string
    image: string | null
    order: number
    updatedAt: Date
  }>
  let loadError = ''

  try {
    collections = await prisma.collection.findMany({
      orderBy: [{ order: 'desc' }, { updatedAt: 'desc' }],
    })
  } catch (error) {
    console.error('Failed to load collections:', error)
    loadError = 'Unable to load collections right now. Please try again later.'
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Collections</h1>
        <Link
          href="/admin/collections/new"
          className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
        >
          + New Collection
        </Link>
      </div>

      <div className="space-y-4">
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
          <>
            <div className="grid gap-4 sm:hidden">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 p-4"
                >
                  <div className="mb-4 overflow-hidden rounded-3xl bg-zinc-950">
                    {collection.image ? (
                      isVideoUrl(collection.image) ? (
                        <video
                          controls
                          src={collection.image}
                          className="h-52 w-full object-cover"
                        />
                      ) : (
                        <img
                          src={collection.image}
                          alt={collection.name}
                          className="h-52 w-full object-cover"
                        />
                      )
                    ) : (
                      <div className="flex h-52 items-center justify-center bg-zinc-950 text-sm text-zinc-500">
                        No media available
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <div>
                      <p className="text-lg font-semibold text-white">{collection.name}</p>
                      <p className="mt-1 text-sm text-zinc-500">{collection.slug}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs uppercase tracking-[0.18em] text-zinc-400">
                        {isVideoUrl(collection.image) ? 'Video' : 'Image'}
                      </span>
                      <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
                        Updated {new Date(collection.updatedAt).toLocaleDateString()}
                      </span>
                      <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
                        Order {collection.order}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/collections/${collection.id}/edit`}
                        className="rounded-2xl border border-zinc-600 px-4 py-3 text-sm font-medium text-white transition hover:border-zinc-400"
                      >
                        Edit
                      </Link>
                      <DeleteCollectionButton
                        collectionId={collection.id}
                        collectionName={collection.name}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900 sm:block">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-zinc-800 text-left text-sm text-zinc-400">
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Slug</th>
                    <th className="px-6 py-4 font-medium">Media</th>
                    <th className="px-6 py-4 font-medium">Order</th>
                    <th className="px-6 py-4 font-medium">Updated</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {collections.map((collection) => (
                    <tr key={collection.id} className="border-b border-zinc-800/60 text-sm">
                      <td className="px-6 py-4 font-medium text-white">{collection.name}</td>
                      <td className="px-6 py-4 text-zinc-300">{collection.slug}</td>
                      <td className="px-6 py-4 text-zinc-300">
                        {collection.image ? (isVideoUrl(collection.image) ? 'Video' : 'Image') : 'None'}
                      </td>
                      <td className="px-6 py-4 text-zinc-300">{collection.order}</td>
                      <td className="px-6 py-4 text-zinc-300">{new Date(collection.updatedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/collections/${collection.id}/edit`}
                            className="rounded-lg border border-zinc-600 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-zinc-400 hover:text-white"
                          >
                            Edit
                          </Link>
                          <DeleteCollectionButton
                            collectionId={collection.id}
                            collectionName={collection.name}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
