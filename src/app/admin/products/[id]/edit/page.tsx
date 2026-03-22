import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProductForm from '../../../components/ProductForm'

type PageProps = { params: Promise<{ id: string }> }

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })

  if (!product) {
    notFound()
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Edit product</h1>
      <ProductForm product={product} />
    </div>
  )
}
