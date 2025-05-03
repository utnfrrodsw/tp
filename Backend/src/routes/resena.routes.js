"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resena_controller_1 = require("../controllers/resena.controller");
const router = (0, express_1.Router)();
// Usa async/await correctamente con Express y pasa la función de manejo de errores
router.get('/:id', async (req, res, next) => {
    try {
        await resena_controller_1.resenaController.getResenaById(req, res);
    }
    catch (err) {
        next(err); // Pasa el error al manejador global de errores de Express
    }
});
router.post('/', async (req, res, next) => {
    try {
        await resena_controller_1.resenaController.createResena(req, res);
    }
    catch (err) {
        next(err);
    }
});
router.put('/:id', async (req, res, next) => {
    try {
        await resena_controller_1.resenaController.updateResena(req, res);
    }
    catch (err) {
        next(err);
    }
});
router.delete('/:id', async (req, res, next) => {
    try {
        await resena_controller_1.resenaController.deleteResena(req, res);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
