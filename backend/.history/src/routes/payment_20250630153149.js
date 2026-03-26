const express = require('express');
const router = express.Router();
const { createPreference } = require('../controllers/paymentController');
const authenticate = require('../middlewares/authMiddleware'); // si querés que sea con auth

// Ruta para crear la preferencia de pago Mercado Pago
router.post('/create_preference', authenticate, createPreference);

module.exports = router;


