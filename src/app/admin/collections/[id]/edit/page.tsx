import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import CollectionForm from '@/app/admin/components/CollectionForm'

type PageProps = { params: Promise<{ id: string }> }

export default async function EditCollectionPage({ params }: PageProps) {
  const { id } = await params
  const collection = await prisma.collection.findUnique({ where: { id } })

  if (!collection) {
    notFound()
  }

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-8">Edit collection</h1>
      <CollectionForm collection={collection} />
    </div>
  )
}
