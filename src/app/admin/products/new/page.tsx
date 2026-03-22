import ProductForm from '@/app/admin/components/ProductForm'

export default function NewProductPage() {
  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
      <ProductForm />
    </div>
  )
}