const Especialidad = require('../models/especialidad');
const { toPositiveInt, sendError } = require('../utils/http');

// GET /especialidades - trae todas
const getEspecialidades = async (req, res) => {
  try {
    const especialidades = await Especialidad.findAll();
    res.json(especialidades);
  } catch (error) {
    sendError(res, 500, 'Error al obtener especialidades', error);
  }
};

// GET trae una especialidad por id
const getEspecialidadByPk = async (req, res) => {
  try {
    const id = toPositiveInt(req.params.id);
    if (!id) return res.status(400).json({ message: 'id inválido' });

    const especialidad = await Especialidad.findByPk(id);
    if (!especialidad) return res.status(404).json({ message: 'No encontrado' });
    res.json(especialidad);
  } catch (error) {
    sendError(res, 500, 'Error al obtener especialidad', error);
  }
};

// POST - crea nueva especialidad
const createEspecialidad = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
      return res.status(400).json({ message: 'nombre es obligatorio' });
    }

    const nueva = await Especialidad.create({ nombre: nombre.trim() });
    res.status(201).json(nueva);
  } catch (error) {
    sendError(res, 400, 'Error al crear especialidad', error);
  }
};

// PUT edita una especialidad existente por id
const updateEspecialidad = async (req, res) => {
  try {
    const id = toPositiveInt(req.params.id);
    if (!id) return res.status(400).json({ message: 'id inválido' });

    const especialidad = await Especialidad.findByPk(id); //busca
    if (!especialidad) return res.status(404).json({ message: 'No encontrado' });

    const { id: _id, ...datos } = req.body; // la PK no se puede modificar por este endpoint
    await especialidad.update(datos); //actualiza
    res.json(especialidad);
  } catch (error) {
    sendError(res, 400, 'Error al actualizar', error);
  }
};

// DELETE elimina una especialidad por id
const deleteEspecialidad = async (req, res) => {
  try {
    const id = toPositiveInt(req.params.id);
    if (!id) return res.status(400).json({ message: 'id inválido' });

    const especialidad = await Especialidad.findByPk(id); //busca
    if (!especialidad) return res.status(404).json({ message: 'No encontrado' });

    await especialidad.destroy(); //elimina
    res.json({ message: 'Especialidad eliminada' });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res
        .status(409)
        .json({ message: 'No se puede eliminar: la especialidad tiene profesores asignados' });
    }
    sendError(res, 500, 'Error al eliminar', error);
  }
};

module.exports = {
  getEspecialidades,
  getEspecialidadByPk,
  createEspecialidad,
  updateEspecialidad,
  deleteEspecialidad
};
