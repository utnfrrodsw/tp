const Especialidad = require('../models/especialidad');
const { toPositiveInt, sendError, esErrorDeReferencia } = require('../utils/http');

const nombreValido = (nombre) => typeof nombre === 'string' && nombre.trim().length > 0;

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
    if (!nombreValido(nombre)) return res.status(400).json({ message: 'nombre es obligatorio' });

    const nueva = await Especialidad.create({ nombre: nombre.trim() });
    res.status(201).json(nueva);
  } catch (error) {
    sendError(res, 500, 'Error al crear especialidad', error);
  }
};

// PUT edita una especialidad existente por id
const updateEspecialidad = async (req, res) => {
  try {
    const id = toPositiveInt(req.params.id);
    if (!id) return res.status(400).json({ message: 'id inválido' });

    const especialidad = await Especialidad.findByPk(id);
    if (!especialidad) return res.status(404).json({ message: 'No encontrado' });

    // El único campo editable es el nombre
    const { nombre } = req.body;
    if (!nombreValido(nombre)) return res.status(400).json({ message: 'nombre es obligatorio' });

    await especialidad.update({ nombre: nombre.trim() });
    res.json(especialidad);
  } catch (error) {
    sendError(res, 500, 'Error al actualizar especialidad', error);
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
    // Los profesores que la tenían asignada la pierden solos (CASCADE). Este 409 cubre a tablas
    // que la referencien en el futuro (por ej. clases)
    if (esErrorDeReferencia(error)) {
      return res
        .status(409)
        .json({ message: 'No se puede eliminar: la especialidad tiene registros asociados' });
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
