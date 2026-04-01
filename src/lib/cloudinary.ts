import { Readable } from 'stream'
import { v2 as cloudinary } from 'cloudinary'

function configure() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })
  return cloudinary
}

export function cloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  )
}

export async function uploadToCloudinary(
  buffer: Buffer,
  options: { folder?: string; resource_type?: 'image' | 'video' | 'auto' } = {}
): Promise<{ secure_url: string; public_id: string; resource_type: string }> {
  if (!cloudinaryConfigured()) {
    throw new Error('Cloudinary env vars missing')
  }

  const cld = configure()

  return new Promise((resolve, reject) => {
    const stream = cld.uploader.upload_stream(
      {
        folder: options.folder ?? 'fashionnova',
        resource_type: options.resource_type ?? 'auto',
        quality: 'auto',
        fetch_format: 'auto',
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Upload failed'))
          return
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type,
        })
      }
    )

    Readable.from(buffer).pipe(stream)
  })
}
