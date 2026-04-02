import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import DeleteProductButton from '../components/DeleteProductButton'

function stockClass(stock: number) {
  if (stock <= 5) return 'bg-red-500/10 text-red-300'
  if (stock <= 10) return 'bg-yellow-500/10 text-yellow-300'
  return 'bg-emerald-500/10 text-emerald-300'
}

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="mt-2 text-sm text-zinc-400">Manage inventory, pricing, and stock.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
        >
          + Add product
        </Link>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:hidden">
          {products.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 p-4"
            >
              <div className="flex gap-4">
                <div className="h-24 w-24 overflow-hidden rounded-3xl bg-zinc-950">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-zinc-500">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-white">{product.name}</p>
                  <p className="mt-1 text-sm text-zinc-400">{product.category}</p>
                  <p className="mt-3 text-sm text-zinc-300">EGP {product.price.toLocaleString()}</p>
                  <div className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${stockClass(product.stock)}`}>
                    Stock {product.stock}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="rounded-2xl border border-zinc-600 px-4 py-3 text-sm font-medium text-white transition hover:border-zinc-400"
                >
                  Edit
                </Link>
                <DeleteProductButton productId={product.id} productName={product.name} />
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 sm:block">
          {products.length === 0 ? (
            <p className="py-16 text-center text-zinc-400">No products yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-zinc-800 text-left text-sm text-zinc-400">
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Stock</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-zinc-800/60 text-sm">
                      <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                      <td className="px-6 py-4 text-zinc-300">{p.category}</td>
                      <td className="px-6 py-4 text-zinc-300">EGP {p.price.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${stockClass(p.stock)}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="rounded-lg border border-zinc-600 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-zinc-400 hover:text-white"
                          >
                            Edit
                          </Link>
                          <DeleteProductButton productId={p.id} productName={p.name} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
