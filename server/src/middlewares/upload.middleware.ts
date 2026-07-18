// src/middlewares/upload.middleware.ts
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from '../cloudinary.config.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'taller-mecanico',  // carpeta en tu Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  } as any,
});

export const upload = multer({ storage });