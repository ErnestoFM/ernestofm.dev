/**
 * Image Service — all image upload/retrieval via Cloudinary
 * This is the ONLY service that handles file storage.
 */

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

/**
 * Upload an image buffer to Cloudinary
 * @param file File buffer or base64 data URI
 * @param folder Cloudinary folder name
 * @returns UploadResult with URL and metadata
 */
export async function uploadImage(file: string | Buffer, folder: string = 'portfolio'): Promise<UploadResult> {
  const cloudinary = await import('cloudinary').then(m => m.v2);
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const result = await new Promise<UploadResult>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', format: 'webp' },
      (error, result) => {
        if (error) reject(error);
        else if (result)
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
          });
        else reject(new Error('Upload failed: no result'));
      }
    );
    if (Buffer.isBuffer(file)) {
      uploadStream.end(file);
    } else {
      uploadStream.end(Buffer.from(file.split(',')[1] ?? file, 'base64'));
    }
  });

  return result;
}

/**
 * Delete an image from Cloudinary by public ID
 * @param publicId The Cloudinary public ID
 */
export async function deleteImage(publicId: string): Promise<void> {
  const cloudinary = await import('cloudinary').then(m => m.v2);
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  await cloudinary.uploader.destroy(publicId);
}

/**
 * Get an optimized image URL with transformations
 * @param publicId Cloudinary public ID
 * @param width Target width
 * @param height Target height
 */
export function getOptimizedUrl(publicId: string, width: number, height: number): string {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,w_${width},h_${height},f_webp,q_auto/${publicId}`;
}
