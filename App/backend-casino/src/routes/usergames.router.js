const express = require('express');
const router = express.Router();
const usersGamesController = require('../controllers/usergames.controller');

router
    .get("/", usersGamesController.get)
    .post("/", usersGamesController.create);

module.exports = router;