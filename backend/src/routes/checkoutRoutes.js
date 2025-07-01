const express = require('express');
const router = express.Router();

const { createCheckout } = require('../controllers/checkoutController');

router.post('/', createCheckout);  
module.exports = router;
