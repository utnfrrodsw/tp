const destinoService = require('../services/destino.service');

exports.getAll = async (req, res, next) => {
  try {
    const destinos = await destinoService.getAll();
    res.json(destinos);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const destino = await destinoService.getById(req.params.id);
    if (!destino) return res.status(404).json({ error: 'Destino no encontrado' });
    res.json(destino);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { nombre, precio, descripcion } = req.body;
    if (!nombre || !precio || !descripcion) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const destino = await destinoService.create({ nombre, precio, descripcion });
    res.status(201).json(destino);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { nombre, precio, descripcion } = req.body;
    const destino = await destinoService.update(req.params.id, { nombre, precio, descripcion });
    if (!destino) return res.status(404).json({ error: 'Destino no encontrado' });
    res.json(destino);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const destino = await destinoService.remove(req.params.id);
    if (!destino) return res.status(404).json({ error: 'Destino no encontrado' });
    res.json({ mensaje: 'Destino eliminado' });
  } catch (err) {
    next(err);
  }
};
