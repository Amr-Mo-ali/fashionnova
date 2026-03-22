export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/admin/dashboard',
    '/admin/dashboard/:path*',
    '/admin/products',
    '/admin/products/:path*',
    '/admin/orders',
    '/admin/orders/:path*',
    '/admin/settings',
    '/admin/settings/:path*',
  ],
}
