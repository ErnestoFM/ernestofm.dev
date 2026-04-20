import { getOptimizedUrl, uploadImage, deleteImage } from '@/services/image-service';

// Mock cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn(),
      destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
    },
  },
}));

describe('image-service', () => {
  beforeEach(() => {
    process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
  });

  describe('getOptimizedUrl', () => {
    it('generates correct Cloudinary URL with dimensions', () => {
      const url = getOptimizedUrl('portfolio/test-image', 800, 450);

      expect(url).toContain('test-cloud');
      expect(url).toContain('w_800');
      expect(url).toContain('h_450');
      expect(url).toContain('f_webp');
      expect(url).toContain('portfolio/test-image');
    });

    it('generates different URLs for different dimensions', () => {
      const url1 = getOptimizedUrl('img', 400, 300);
      const url2 = getOptimizedUrl('img', 800, 600);

      expect(url1).not.toBe(url2);
      expect(url1).toContain('w_400');
      expect(url2).toContain('w_800');
    });
  });

  describe('uploadImage', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
      process.env.CLOUDINARY_API_KEY = 'test-key';
      process.env.CLOUDINARY_API_SECRET = 'test-secret';
    });

    it('uploads a Buffer and returns UploadResult', async () => {
      const cloudinary = require('cloudinary').v2;
      const mockUploadStream = {
        end: jest.fn(),
      };
      cloudinary.uploader.upload_stream.mockImplementation((opts, callback) => {
        callback(null, {
          secure_url: 'http://example.com/image.webp',
          public_id: 'portfolio/test-image',
          width: 800,
          height: 450,
        });
        return mockUploadStream;
      });

      const buffer = Buffer.from('test-image-data');
      const result = await uploadImage(buffer, 'portfolio');

      expect(result.url).toBe('http://example.com/image.webp');
      expect(result.publicId).toBe('portfolio/test-image');
      expect(result.width).toBe(800);
      expect(result.height).toBe(450);
    });

    it('uploads a base64 string and returns UploadResult', async () => {
      const cloudinary = require('cloudinary').v2;
      const mockUploadStream = {
        end: jest.fn(),
      };
      cloudinary.uploader.upload_stream.mockImplementation((opts, callback) => {
        callback(null, {
          secure_url: 'http://example.com/image.webp',
          public_id: 'portfolio/base64-image',
          width: 640,
          height: 360,
        });
        return mockUploadStream;
      });

      const base64 = 'data:image/png;base64,iVBORw0KGgo=';
      const result = await uploadImage(base64, 'portfolio');

      expect(result.publicId).toBe('portfolio/base64-image');
      expect(result.width).toBe(640);
    });

    it('rejects with error if upload fails', async () => {
      const cloudinary = require('cloudinary').v2;
      const mockUploadStream = {
        end: jest.fn(),
      };
      cloudinary.uploader.upload_stream.mockImplementation((opts, callback) => {
        callback(new Error('Upload failed'));
        return mockUploadStream;
      });

      await expect(uploadImage(Buffer.from('test'), 'portfolio')).rejects.toThrow('Upload failed');
    });

    it('returns error when upload result is null', async () => {
      const cloudinary = require('cloudinary').v2;
      const mockUploadStream = {
        end: jest.fn(),
      };
      cloudinary.uploader.upload_stream.mockImplementation((opts, callback) => {
        callback(null, null);
        return mockUploadStream;
      });

      await expect(uploadImage(Buffer.from('test'), 'portfolio')).rejects.toThrow('Upload failed: no result');
    });
  });

  describe('deleteImage', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
      process.env.CLOUDINARY_API_KEY = 'test-key';
      process.env.CLOUDINARY_API_SECRET = 'test-secret';
    });

    it('deletes an image by publicId', async () => {
      const cloudinary = require('cloudinary').v2;
      await deleteImage('portfolio/test-image');
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('portfolio/test-image');
    });
  });
});
