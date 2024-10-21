const express = require('express');
const router = express.Router();
const usersGamesController = require('../controllers/usergames.controller');

router
    .get("/", usersGamesController.get)
    .post("/", usersGamesController.create)
    .get("/query1", usersGamesController.query1)
    .get("/history/:id", usersGamesController.history);

module.exports = router;