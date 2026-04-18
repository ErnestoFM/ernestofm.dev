import { getOptimizedUrl } from '@/services/image-service';

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
});
