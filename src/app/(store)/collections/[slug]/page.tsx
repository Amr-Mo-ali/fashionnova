/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/store/ProductCard'
import { fetchCollectionFromApi } from '@/lib/store-api'

type PageProps = { params: Promise<{ slug: string }> }

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params
  const collection = await fetchCollectionFromApi(slug)

  if (!collection) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 md:py-24">
      <Link
        href="/collections"
        className="mb-8 inline-flex min-h-[44px] items-center text-[11px] font-[900] uppercase tracking-[0.2em] text-[#7a7068] transition hover:text-[#b8976a]"
      >
        Back to collections
      </Link>

      <div className="dramatic-card overflow-hidden">
        <div className="min-h-[280px] bg-[#e8e0d4] sm:min-h-[420px]">
          {collection.coverImage ? (
            <img
              src={collection.coverImage}
              alt={`${collection.title} cover image`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[280px] items-center justify-center px-6 text-center text-sm uppercase tracking-[0.2em] text-[#7a7068] sm:min-h-[420px]">
              {collection.title}
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8 md:p-10">
          <p className="text-label text-[#b8976a]">Collection</p>
          <h1 className="mt-4 font-serif text-[42px] leading-none text-[#0f0e0d] sm:text-[56px]">
            <span className="font-[300]">The </span>
            <span className="font-[900]">{collection.title}</span>
          </h1>
          {collection.description ? (
            <p className="mt-6 max-w-3xl text-[14px] leading-7 text-[#7a7068] sm:text-[16px]">
              {collection.description}
            </p>
          ) : null}
          <p className="mt-6 text-[11px] font-[900] uppercase tracking-[0.2em] text-[#b8976a]">
            {collection.productCount} {collection.productCount === 1 ? 'product' : 'products'}
          </p>
        </div>
      </div>

      <div className="mt-16">
        <div className="mb-10">
          <p className="text-label text-[#b8976a]">Products</p>
          <h2 className="mt-4 font-serif text-[36px] leading-none text-[#0f0e0d] sm:text-[48px]">
            <span className="font-[300]">Inside this </span>
            <span className="font-[900]">Edit</span>
          </h2>
        </div>

        {collection.products.length === 0 ? (
          <div className="dramatic-card p-12 text-center text-[#7a7068]">
            No products have been added to this collection yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collection.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
