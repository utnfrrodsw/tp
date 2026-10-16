const TipoClase = require('../models/tipoClase');
const { toPositiveInt, sendError } = require('../utils/http');

const getTiposClase = async (req, res) => {
  try {
    const tipos = await TipoClase.findAll({ order: [['idClase', 'ASC']] });
    res.json(tipos);
  } catch (error) {
    sendError(res, 500, 'Error al obtener los tipos de clase', error);
  }
};

const getTipoClaseById = async (req, res) => {
  try {
    const idClase = toPositiveInt(req.params.id);
    if (!idClase) return res.status(400).json({ message: 'idClase inválido' });

    const tipo = await TipoClase.findByPk(idClase);
    if (!tipo) return res.status(404).json({ message: 'Tipo de clase no encontrado' });
    res.json(tipo);
  } catch (error) {
    sendError(res, 500, 'Error al obtener el tipo de clase', error);
  }
};

const createTipoClase = async (req, res) => {
  try {
    const { nombre, descripcion = null } = req.body;
    if (typeof nombre !== 'string' || !nombre.trim()) {
      return res.status(400).json({ message: 'nombre es obligatorio y debe ser texto' });
    }
    if (descripcion !== null && typeof descripcion !== 'string') {
      return res.status(400).json({ message: 'descripcion debe ser texto o null' });
    }

    const tipo = await TipoClase.create({
      nombre: nombre.trim(),
      descripcion: descripcion === null ? null : descripcion.trim() || null
    });
    res.status(201).json(tipo);
  } catch (error) {
    sendError(res, 500, 'Error al crear el tipo de clase', error);
  }
};

const updateTipoClase = async (req, res) => {
  try {
    const idClase = toPositiveInt(req.params.id);
    if (!idClase) return res.status(400).json({ message: 'idClase inválido' });

    const tipo = await TipoClase.findByPk(idClase);
    if (!tipo) return res.status(404).json({ message: 'Tipo de clase no encontrado' });

    const values = {};
    if (req.body.nombre !== undefined) {
      if (typeof req.body.nombre !== 'string' || !req.body.nombre.trim()) {
        return res.status(400).json({ message: 'nombre debe ser texto no vacío' });
      }
      values.nombre = req.body.nombre.trim();
    }
    if (req.body.descripcion !== undefined) {
      if (req.body.descripcion !== null && typeof req.body.descripcion !== 'string') {
        return res.status(400).json({ message: 'descripcion debe ser texto o null' });
      }
      values.descripcion =
        req.body.descripcion === null ? null : req.body.descripcion.trim() || null;
    }
    if (!Object.keys(values).length) {
      return res.status(400).json({ message: 'No hay campos válidos para actualizar' });
    }

    await tipo.update(values);
    res.json(tipo);
  } catch (error) {
    sendError(res, 500, 'Error al actualizar el tipo de clase', error);
  }
};

const deleteTipoClase = async (req, res) => {
  try {
    const idClase = toPositiveInt(req.params.id);
    if (!idClase) return res.status(400).json({ message: 'idClase inválido' });

    const tipo = await TipoClase.findByPk(idClase);
    if (!tipo) return res.status(404).json({ message: 'Tipo de clase no encontrado' });

    await tipo.destroy();
    res.json({ message: 'Tipo de clase eliminado' });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({
        message: 'No se puede eliminar: el tipo de clase tiene turnos asociados'
      });
    }
    sendError(res, 500, 'Error al eliminar el tipo de clase', error);
  }
};

module.exports = {
  getTiposClase,
  getTipoClaseById,
  createTipoClase,
  updateTipoClase,
  deleteTipoClase
};
