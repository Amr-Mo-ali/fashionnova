import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@fashionnova.com' },
    update: {},
    create: {
      email: 'admin@fashionnova.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'SUPERADMIN',
    },
  })

  console.log('Admin created:', admin.email)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())