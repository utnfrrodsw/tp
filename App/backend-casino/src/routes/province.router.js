const express = require('express');
const router = express.Router();
const provinceController = require('../controllers/provinces.controller');

router
    .get("/", provinceController.get)
    .get("/:id", provinceController.getById)
    .get("/country/:id", provinceController.getByCountry)
    .post("/", provinceController.create)
    .put("/:id", provinceController.update)
    .delete("/:id", provinceController._delete);

module.exports = router;