const express = require('express');
const router = express.Router();
const gameController = require('../controllers/games.controller');

router
    .get("/", gameController.get)
    .get("/:id", gameController.getById)
    .post("/", gameController.create)
    .put("/:id", gameController.update)
    .delete("/:id", gameController._delete);

module.exports = router;