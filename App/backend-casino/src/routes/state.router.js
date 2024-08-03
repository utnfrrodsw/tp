const express = require('express');
const router = express.Router();
const stateController = require('../controllers/states.controller');

router
    .get("/", stateController.get)
    .get("/:id", stateController.getById)
    .post("/", stateController.create)
    .put("/:id", stateController.update)
    .delete("/:id", stateController._delete);

module.exports = router;