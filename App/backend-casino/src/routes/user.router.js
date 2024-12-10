const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const adminMiddleware = require('../middleware/adminMiddleware');
const userMiddleware = require('../middleware/userMiddleware');

router
    .get("/", adminMiddleware.adminAuth, userController.get)
    .get("/:id", adminMiddleware.adminAuth, userController.getById)
    .post("/", adminMiddleware.adminPost, userController.create)
    .put("/:id", userMiddleware.postAuth, userController.update)
    .delete("/:id", adminMiddleware.adminAuth, userController._delete)
    .get("/read/:id", adminMiddleware.adminAuth, userController.read)
    .get("/readBalance/:id", userMiddleware.userAuth, userController.readBalance);

module.exports = router;