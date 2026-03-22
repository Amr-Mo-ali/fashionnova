import ProductDetailForm from '@/components/store/ProductDetailForm'
import { fetchProductFromApi } from '@/lib/store-api'
import { notFound } from 'next/navigation'

type PageProps = { params: Promise<{ id: string }> }

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params
  const product = await fetchProductFromApi(id)
  if (!product) notFound()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <ProductDetailForm product={product} />
    </div>
  )
}
