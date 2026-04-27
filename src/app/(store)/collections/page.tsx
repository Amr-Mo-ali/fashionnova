/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { fetchCollectionsFromApi } from '@/lib/store-api'

export default async function CollectionsPage() {
  const collections = await fetchCollectionsFromApi()

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 md:py-24">
      <div className="mb-12">
        <p className="text-label text-[#b8976a]">Collections</p>
        <h1 className="mt-4 font-serif text-[42px] leading-none text-[#0f0e0d] sm:text-[56px]">
          <span className="font-[300]">Curated </span>
          <span className="font-[900]">Worlds</span>
        </h1>
        <p className="mt-4 max-w-xl text-[14px] leading-7 text-[#7a7068] sm:text-[16px]">
          Discover every FashionNova collection in one place.
        </p>
      </div>

      {collections.length === 0 ? (
        <div className="dramatic-card p-12 text-center text-[#7a7068]">
          No collections are available yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className="dramatic-card group overflow-hidden"
            >
              <div className="aspect-[4/5] bg-[#e8e0d4]">
                {collection.coverImage ? (
                  <img
                    src={collection.coverImage}
                    alt={`${collection.title} cover image`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-6 text-center text-sm uppercase tracking-[0.2em] text-[#7a7068]">
                    {collection.title}
                  </div>
                )}
              </div>

              <div className="p-6">
                <p className="text-label text-[#7a7068]">Collection</p>
                <h2 className="mt-3 font-serif text-[28px] font-[900] leading-none text-[#0f0e0d]">
                  {collection.title}
                </h2>
                {collection.description ? (
                  <p className="mt-4 text-[14px] leading-7 text-[#7a7068]">
                    {collection.description}
                  </p>
                ) : null}
                <p className="mt-4 text-[11px] font-[900] uppercase tracking-[0.2em] text-[#b8976a]">
                  {collection.productCount} {collection.productCount === 1 ? 'product' : 'products'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
