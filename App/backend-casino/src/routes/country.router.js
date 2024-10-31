const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countries.controller');

const adminMiddleware = require('../middleware/adminMiddleware');

router
    .get("/", adminMiddleware.adminAuth, countryController.get)
    .get("/:id", adminMiddleware.adminAuth, countryController.getById)
    .post("/", adminMiddleware.adminPost, countryController.create)
    .put("/:id", adminMiddleware.adminPost, countryController.update)
    .delete("/:id", adminMiddleware.adminPost, countryController._delete);

module.exports = router;