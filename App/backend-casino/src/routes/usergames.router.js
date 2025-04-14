const express = require('express');
const router = express.Router();
const usersGamesController = require('../controllers/usergames.controller');

const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware.js')

router
    .get("/", adminMiddleware.adminAuth , usersGamesController.get)
    .post("/", userMiddleware.postAuth, usersGamesController.create)
    .get("/leaderboards", userMiddleware.userAuth, usersGamesController.leaderboard)
    .get("/history/:id", userMiddleware.userAuth, usersGamesController.history);

module.exports = router;