import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import CollectionForm from '@/app/admin/components/CollectionForm'
import CollectionProductsManager from '@/app/admin/components/CollectionProductsManager'

type PageProps = { params: Promise<{ slug: string }> }

export default async function CollectionDetailPage({ params }: PageProps) {
  const { slug } = await params

  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: {
      products: {
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        include: { product: true },
      },
    },
  })

  if (!collection) {
    notFound()
  }

  const allProducts = await prisma.product.findMany({
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div className="space-y-10 text-white">
      <div>
        <h1 className="text-3xl font-bold">Manage collection</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Edit collection details and assign products to {collection.title}.
        </p>
      </div>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
        <CollectionForm collection={collection} />
      </section>

      <CollectionProductsManager
        collectionSlug={collection.slug}
        initialProducts={collection.products.map((entry) => entry.product)}
        allProducts={allProducts}
      />
    </div>
  )
}
