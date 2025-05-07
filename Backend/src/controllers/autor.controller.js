"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAutores = void 0;
const autor_entity_1 = require("../entities/autor.entity");
const getAutores = async (req, res) => {
    const orm = req.app.get('orm');
    const autores = await orm.em.find(autor_entity_1.Autor, {});
    res.json(autores);
};
exports.getAutores = getAutores;
