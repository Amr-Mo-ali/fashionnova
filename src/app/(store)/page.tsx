import HomeView from '@/components/store/HomeView'
import { fetchProductsFromApi } from '@/lib/store-api'

export default async function HomePage() {
  const products = await fetchProductsFromApi()

  return <HomeView products={products} />
}
