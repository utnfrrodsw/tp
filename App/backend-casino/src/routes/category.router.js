const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categories.controller');

const adminMiddleware = require('../middleware/adminMiddleware.js')

router
    .get("/", adminMiddleware.adminAuth, categoryController.get)
    .get("/:id", adminMiddleware.adminAuth, categoryController.getById)
    .post("/", adminMiddleware.adminPost, categoryController.create)
    .put("/:id", adminMiddleware.adminPost, categoryController.update)
    .delete("/:id", adminMiddleware.adminPost, categoryController._delete);

module.exports = router;