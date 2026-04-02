import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import DeleteCollectionButton from '@/app/admin/components/DeleteCollectionButton'

export default async function AdminCollectionsPage() {
  let collections = [] as Array<{
    id: string
    name: string
    slug: string
    updatedAt: Date
  }>
  let loadError = ''

  try {
    collections = await prisma.collection.findMany({
      orderBy: { updatedAt: 'desc' },
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
          className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
        >
          Add collection
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        {loadError ? (
          <p className="py-16 text-center text-red-400">{loadError}</p>
        ) : collections.length === 0 ? (
          <p className="py-16 text-center text-zinc-400">No collections yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-zinc-800 text-left text-sm text-zinc-400">
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Slug</th>
                  <th className="px-6 py-4 font-medium">Updated</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {collections.map((collection) => (
                  <tr key={collection.id} className="border-b border-zinc-800/60 text-sm">
                    <td className="px-6 py-4 font-medium text-white">{collection.name}</td>
                    <td className="px-6 py-4 text-zinc-300">{collection.slug}</td>
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
        )}
      </div>
    </div>
  )
}
