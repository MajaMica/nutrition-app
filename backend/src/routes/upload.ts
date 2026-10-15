import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { supabase, RECIPE_IMAGES_BUCKET } from '../lib/supabase';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/heic',
      'image/heif',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Tip fajla nije podrzan: ${file.mimetype}`));
    }
  },
});

router.post(
  '/recipe-image',
  authenticate,
  requireAdmin,
  upload.single('image'),
  async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nema fajla' });
      }

      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 8);
      const fileName = `recipe-${timestamp}-${randomId}.webp`;

      const processedBuffer = await sharp(req.file.buffer)
        .resize({
          width: 1200,
          height: 1200,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toBuffer();

      const { error: uploadError } = await supabase.storage
        .from(RECIPE_IMAGES_BUCKET)
        .upload(fileName, processedBuffer, {
          contentType: 'image/webp',
          upsert: false,
          cacheControl: '31536000',
        });

      if (uploadError) {
        return res.status(500).json({ error: uploadError.message });
      }

      const { data: urlData } = supabase.storage
        .from(RECIPE_IMAGES_BUCKET)
        .getPublicUrl(fileName);

      res.json({
        url: urlData.publicUrl,
        size: processedBuffer.length,
        originalSize: req.file.size,
      });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  }
);

export default router;
