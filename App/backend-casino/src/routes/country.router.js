const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countries.controller');

router
    .get("/", countryController.get)
    .get("/:id", countryController.getById)
    .post("/", countryController.create)
    .put("/:id", countryController.update)
    .delete("/:id", countryController._delete);

module.exports = router;