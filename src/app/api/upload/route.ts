import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/api-auth'
import { uploadToCloudinary } from '@/lib/cloudinary'

export const runtime = 'nodejs'

const IMAGE_MAX_BYTES = 10 * 1024 * 1024
const VIDEO_MAX_BYTES = 50 * 1024 * 1024
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const VIDEO_TYPES = new Set(['video/mp4', 'video/quicktime', 'video/webm'])

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
  const isImage = IMAGE_TYPES.has(mime)
  const isVideo = VIDEO_TYPES.has(mime)

  if (!isImage && !isVideo) {
    return NextResponse.json(
      { error: 'Invalid type. Use JPEG, PNG, WebP, GIF, MP4, MOV, or WEBM.' },
      { status: 400 }
    )
  }

  const maxBytes = isVideo ? VIDEO_MAX_BYTES : IMAGE_MAX_BYTES
  if (file.size > maxBytes) {
    return NextResponse.json(
      {
        error: `File too large (max ${isVideo ? '50MB' : '10MB'})`,
      },
      { status: 400 }
    )
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  if (buffer.length > maxBytes) {
    return NextResponse.json(
      {
        error: `File too large (max ${isVideo ? '50MB' : '10MB'})`,
      },
      { status: 400 }
    )
  }

  try {
    const result = await uploadToCloudinary(buffer, {
      folder: 'fashionnova/products',
      resource_type: isVideo ? 'video' : 'image',
    })
    return NextResponse.json({ url: result.secure_url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed. Please check Cloudinary configuration.' },
      { status: 500 }
    )
  }
}
