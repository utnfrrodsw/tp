const express = require('express');
const router = express.Router();
const { createPreference } = require('../controllers/paymentController');

router.post('/create_preference', createPreference);

module.exports = router;
