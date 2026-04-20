import { Router } from 'express';
import { searchAuthor, getAuthor } from '../controllers/externalAuthor.controller';

const router = Router();

router.get('/search-author', searchAuthor);
router.get('/author/:id', getAuthor);

export { router as externalAuthorRoutes };
