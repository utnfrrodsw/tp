const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cities.controller');

router
    .get("/", cityController.get)
    .get("/:id", cityController.getById)
    .get("/province/:id", cityController.getByProvince)
    .get("/country/:id", cityController.getByCountry)
    .post("/", cityController.create)
    .put("/:id", cityController.update)
    .delete("/:id", cityController._delete);


module.exports = router;