import cloudinary from './config';

export const uploadToCloudinary = async (fileBuffer, folder = 'mindscribe') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

export const extractPublicId = (url) => {
  // Extract public ID from Cloudinary URL
  const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.(?:jpg|jpeg|png|gif)/);
  return matches ? matches[1] : null;
};