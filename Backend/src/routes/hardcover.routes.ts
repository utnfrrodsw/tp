import { Router } from 'express';
import { trendingBooksController, getBookBySlugController } from '../controllers/hardcoverController';

const router = Router();

router.get('/trending', trendingBooksController);
router.get('/libro/:slug', getBookBySlugController);

export default router;
