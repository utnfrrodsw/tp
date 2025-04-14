const express = require('express');
const router = express.Router();
const gameController = require('../controllers/games.controller');

const adminMiddleware = require('../middleware/adminMiddleware');
const userMiddleware = require('../middleware/userMiddleware.js')

router
    .get("/", adminMiddleware.adminAuth, gameController.get)
    .get("/:id", adminMiddleware.adminAuth, gameController.getById)
    .get("/category/:id", adminMiddleware.adminAuth, gameController.getByCategory)
    .post("/", adminMiddleware.adminPost, gameController.create)
    .put("/:id", adminMiddleware.adminPost, gameController.update)
    .delete("/:id", adminMiddleware.adminPost, gameController._delete);

module.exports = router;