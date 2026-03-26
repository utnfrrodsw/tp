const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authenticate = require('../middlewares/authMiddleware');

// Crear reseña (usuario autenticado)
router.post('/',authenticate, reviewController.createReview);

// Borrar reseña (usuario autenticado)
router.delete('/:id', authenticate, reviewController.deleteReview);

// Obtener reseñas (público)
router.get('/product/:productId', reviewController.getReviewsByProduct);

router.get('/:id', reviewController.getReviewById);
router.put('/:id', reviewController.updateReview);


module.exports = router;
