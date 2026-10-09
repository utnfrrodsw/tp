const express = require('express');
const { rateLimit } = require('express-rate-limit');
const router = express.Router();
const { login, logout, me, cambiarPassword } = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');

// Frena ataques de fuerza bruta: solo cuentan los intentos fallidos
const limitarIntentos = () =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message: 'Demasiados intentos. Probá de nuevo en unos minutos.' }
  });

router.post('/login', limitarIntentos(), login);
router.post('/logout', logout);
router.get('/me', authenticate, me);
router.put('/password', authenticate, limitarIntentos(), cambiarPassword);

module.exports = router;
