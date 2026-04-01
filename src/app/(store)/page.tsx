import HomeView from '@/components/store/HomeView'
import { fetchCollectionsFromApi, fetchProductsFromApi } from '@/lib/store-api'
import { normalizeCategoryParam } from '@/lib/shop-categories'

type PageProps = {
  searchParams?: Promise<{ category?: string }>
}

export default async function HomePage({ searchParams }: PageProps) {
  const [products, collections] = await Promise.all([
    fetchProductsFromApi(),
    fetchCollectionsFromApi(),
  ])
  const sp = (await searchParams) ?? {}
  const initialCategory = normalizeCategoryParam(sp.category)

  return (
    <HomeView
      products={products}
      collections={collections}
      initialCategory={initialCategory}
    />
  )
}
