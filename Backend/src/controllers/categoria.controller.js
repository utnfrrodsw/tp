"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategorias = void 0;
const categoria_entity_1 = require("../entities/categoria.entity");
const getCategorias = async (req, res) => {
    const orm = req.app.get('orm');
    const categorias = await orm.em.find(categoria_entity_1.Categoria, {});
    res.json(categorias);
};
exports.getCategorias = getCategorias;
