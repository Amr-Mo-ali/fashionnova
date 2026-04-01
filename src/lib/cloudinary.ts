import { Readable } from 'stream'
import { v2 as cloudinary } from 'cloudinary'

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env

export function cloudinaryConfigured(): boolean {
  return Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET)
}

if (cloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  })
}

export async function uploadImageToCloudinary(
  buffer: Buffer,
  folder = 'fashionnova'
): Promise<any> {
  if (!cloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured')
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        format: 'auto',
        quality: 'auto',
      },
      (error, result) => {
        if (error) {
          reject(error)
          return
        }
        if (!result) {
          reject(new Error('Cloudinary upload failed'))
          return
        }
        resolve(result)
      }
    )

    Readable.from(buffer).pipe(uploadStream)
  })
}
