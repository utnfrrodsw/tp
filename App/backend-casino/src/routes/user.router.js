const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/authMiddleware')

router
    .get("/", authMiddleware, userController.get)
    .get("/:id", authMiddleware, userController.getById)
    .post("/", userController.create)
    .put("/:id", userController.update)
    .delete("/:id", authMiddleware, userController._delete)
    .get("/read/:id", authMiddleware, userController.read);

module.exports = router;