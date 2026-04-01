import { randomUUID } from 'crypto'
import { mkdir, writeFile } from 'fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'
import { requireAdminSession } from '@/lib/api-auth'
import {
  cloudinaryConfigured,
  uploadImageToCloudinary,
} from '@/lib/cloudinary'

export const runtime = 'nodejs'

const MAX_BYTES = 5 * 1024 * 1024

const MIME_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
}

export async function POST(request: Request) {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!file || typeof file === 'string' || !('arrayBuffer' in file)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 })
  }

  const mime = file.type
  const ext = MIME_EXT[mime]
  if (!ext) {
    return NextResponse.json(
      { error: 'Invalid type. Use JPEG, PNG, WebP, or GIF.' },
      { status: 400 }
    )
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  if (buffer.length > MAX_BYTES) {
    return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
  }

  if (cloudinaryConfigured()) {
    try {
      const result = await uploadImageToCloudinary(buffer)
      return NextResponse.json({ url: result.secure_url ?? result.url })
    } catch (error) {
      return NextResponse.json(
        { error: 'Upload failed. Please check Cloudinary configuration.' },
        { status: 500 }
      )
    }
  }

  const dir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(dir, { recursive: true })

  const name = `${randomUUID()}${ext}`
  const diskPath = path.join(dir, name)
  await writeFile(diskPath, buffer)

  const url = `/uploads/${name}`
  return NextResponse.json({ url })
}
