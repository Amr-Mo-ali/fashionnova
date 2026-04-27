import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

type PageProps = { params: Promise<{ id: string }> }

export default async function LegacyEditCollectionPage({ params }: PageProps) {
  const { id } = await params
  const collection = await prisma.collection.findUnique({
    where: { id },
    select: { slug: true },
  })

  if (!collection) {
    notFound()
  }

  redirect(`/admin/collections/${collection.slug}`)
}
