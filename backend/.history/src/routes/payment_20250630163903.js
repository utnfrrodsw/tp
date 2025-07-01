const express = require('express');
const router = express.Router();
const { createPreference } = require('../controllers/paymentController');
const authenticate = require('../middlewares/authMiddleware'); 

// Ruta para crear la preferencia de pago Mercado Pago
router.post('/create', authenticate, createPreference);


module.exports = router;


