const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');

router
    .get("/", locationController.get)
    .get("/:id", locationController.getById)
    .post("/", locationController.create)
    .put("/:id", locationController.update)
    .delete("/:id", locationController._delete);

module.exports = router;