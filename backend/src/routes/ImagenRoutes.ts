import express from 'express';
import { ImagenController, upload } from '../controllers/ImagenController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.post('/upload', authMiddleware, upload.single('imagen'), ImagenController.uploadImagen);

export default router;