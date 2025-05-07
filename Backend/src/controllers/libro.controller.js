"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLibro = exports.updateLibro = exports.createLibro = exports.getLibroById = exports.getLibros = void 0;
const libro_entity_1 = require("../entities/libro.entity");
const getLibros = async (req, res) => {
    const orm = req.app.get('orm');
    const libros = await orm.em.find(libro_entity_1.Libro, {});
    res.json(libros);
};
exports.getLibros = getLibros;
const getLibroById = async (req, res) => {
    const orm = req.app.get('orm');
    const libro = await orm.em.findOne(libro_entity_1.Libro, { id: parseInt(req.params.id) });
    if (!libro)
        return res.status(404).json({ error: 'Libro no encontrado' });
    res.json(libro);
};
exports.getLibroById = getLibroById;
const createLibro = async (req, res) => {
    const orm = req.app.get('orm');
    const nuevoLibro = orm.em.create(libro_entity_1.Libro, req.body);
    await orm.em.persistAndFlush(nuevoLibro);
    res.status(201).json(nuevoLibro);
};
exports.createLibro = createLibro;
const updateLibro = async (req, res) => {
    const orm = req.app.get('orm');
    const libro = await orm.em.findOne(libro_entity_1.Libro, { id: parseInt(req.params.id) });
    if (!libro)
        return res.status(404).json({ error: 'Libro no encontrado' });
    orm.em.assign(libro, req.body);
    await orm.em.flush();
    res.json(libro);
};
exports.updateLibro = updateLibro;
const deleteLibro = async (req, res) => {
    const orm = req.app.get('orm');
    const libro = await orm.em.findOne(libro_entity_1.Libro, { id: parseInt(req.params.id) });
    if (!libro)
        return res.status(404).json({ error: 'Libro no encontrado' });
    await orm.em.removeAndFlush(libro);
    res.json({ mensaje: 'Libro eliminado' });
};
exports.deleteLibro = deleteLibro;
