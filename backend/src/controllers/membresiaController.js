const Membresia = require('../models/membresia');
const Cliente = require('../models/Cliente');
const { sendError, toPositiveInt } = require('../utils/http');
const { fechaValida, valorValido, calcularEstado } = require('../utils/membresia');

const incluirCliente = {
  model: Cliente,
  as: 'cliente',
  attributes: ['dni', 'nombre', 'apellido', 'email']
};

// El estado se calcula con las fechas; el valor (DECIMAL) llega como texto desde la base
const aRespuesta = (membresia) => {
  const datos = membresia.toJSON();
  return { ...datos, valor: Number(datos.valor), estado: calcularEstado(datos) };
};

// Qué membresías puede ver quien hace el pedido: el admin todas y el cliente solo las suyas.
// Devuelve null si no puede ver ninguna (el profesor no tiene acceso a las membresías)
const getScope = async (user) => {
  if (user.rol === 'admin') return {};
  if (user.rol === 'cliente') {
    const cliente = await Cliente.findOne({ where: { idUsuario: user.id }, attributes: ['dni'] });
    return cliente ? { dniCliente: cliente.dni } : null;
  }
  return null;
};

// Valida y normaliza los campos. Con parcial (edición) solo revisa los enviados.
// Devuelve { datos } o { error }
const validarCampos = ({ fechaPago, fechaInicio, fechaVencimiento, valor }, parcial = false) => {
  const datos = {};
  const omitido = (v) => parcial && v === undefined;

  for (const [campo, v] of Object.entries({ fechaPago, fechaInicio, fechaVencimiento })) {
    if (omitido(v)) continue;
    const fecha = fechaValida(v);
    if (!fecha)
      return { error: `${campo} es obligatoria y tiene que ser una fecha válida (AAAA-MM-DD)` };
    datos[campo] = fecha;
  }
  if (!omitido(valor)) {
    const numero = valorValido(valor);
    if (numero === null) {
      return { error: 'valor es obligatorio y tiene que ser un número entre 0 y 99999999.99' };
    }
    datos.valor = numero;
  }
  return { datos };
};

// GET /api/membresias - todas (admin) o las del cliente que inició sesión
const getMembresias = async (req, res) => {
  try {
    const scope = await getScope(req.user);
    if (!scope) return res.json([]);

    const membresias = await Membresia.findAll({
      where: scope,
      include: incluirCliente,
      order: [
        ['fechaVencimiento', 'DESC'],
        ['idMembresia', 'DESC']
      ]
    });
    res.json(membresias.map(aRespuesta));
  } catch (error) {
    sendError(res, 500, 'Error al obtener las membresías', error);
  }
};

// GET /api/membresias/:id - una membresía (el cliente solo puede ver las suyas)
const getMembresiaById = async (req, res) => {
  try {
    const id = toPositiveInt(req.params.id);
    if (!id) return res.status(400).json({ message: 'id inválido' });

    const scope = await getScope(req.user);
    if (!scope) return res.status(404).json({ message: 'Membresía no encontrada' });

    const membresia = await Membresia.findOne({
      where: { idMembresia: id, ...scope },
      include: incluirCliente
    });
    if (!membresia) return res.status(404).json({ message: 'Membresía no encontrada' });
    res.json(aRespuesta(membresia));
  } catch (error) {
    sendError(res, 500, 'Error al obtener la membresía', error);
  }
};

// GET /api/membresias/cliente/:dni - las membresías de un cliente (solo admin)
const getMembresiasByCliente = async (req, res) => {
  try {
    const dniCliente = toPositiveInt(req.params.dni);
    if (!dniCliente) return res.status(400).json({ message: 'dni inválido' });

    const membresias = await Membresia.findAll({
      where: { dniCliente },
      include: incluirCliente,
      order: [
        ['fechaVencimiento', 'DESC'],
        ['idMembresia', 'DESC']
      ]
    });
    res.json(membresias.map(aRespuesta));
  } catch (error) {
    sendError(res, 500, 'Error al obtener las membresías del cliente', error);
  }
};

// POST /api/membresias - registrar una membresía (solo admin)
const createMembresia = async (req, res) => {
  try {
    const dniCliente = toPositiveInt(req.body.dniCliente);
    if (!dniCliente) {
      return res
        .status(400)
        .json({ message: 'dniCliente es obligatorio y tiene que ser un entero' });
    }
    const { datos, error } = validarCampos(req.body);
    if (error) return res.status(400).json({ message: error });
    if (datos.fechaInicio > datos.fechaVencimiento) {
      return res
        .status(400)
        .json({ message: 'fechaInicio no puede ser posterior a fechaVencimiento' });
    }

    if (!(await Cliente.findByPk(dniCliente))) {
      return res.status(404).json({ message: 'El cliente especificado no existe' });
    }

    const nueva = await Membresia.create({ dniCliente, ...datos });
    res
      .status(201)
      .json(aRespuesta(await Membresia.findByPk(nueva.idMembresia, { include: incluirCliente })));
  } catch (error) {
    sendError(res, 500, 'Error al crear la membresía', error);
  }
};

// PUT /api/membresias/:id - actualizar fechas y valor (solo admin). El cliente no se puede cambiar
const updateMembresia = async (req, res) => {
  try {
    const id = toPositiveInt(req.params.id);
    if (!id) return res.status(400).json({ message: 'id inválido' });

    const membresia = await Membresia.findByPk(id);
    if (!membresia) return res.status(404).json({ message: 'Membresía no encontrada' });

    const { datos, error } = validarCampos(req.body, true);
    if (error) return res.status(400).json({ message: error });
    if (!Object.keys(datos).length) {
      return res.status(400).json({ message: 'No se envió ningún campo para actualizar' });
    }
    // El orden de las fechas se valida con el resultado final, no solo con lo que se envía
    const inicio = datos.fechaInicio ?? membresia.fechaInicio;
    const vencimiento = datos.fechaVencimiento ?? membresia.fechaVencimiento;
    if (inicio > vencimiento) {
      return res
        .status(400)
        .json({ message: 'fechaInicio no puede ser posterior a fechaVencimiento' });
    }

    await membresia.update(datos);
    res.json(aRespuesta(await Membresia.findByPk(id, { include: incluirCliente })));
  } catch (error) {
    sendError(res, 500, 'Error al actualizar la membresía', error);
  }
};

// DELETE /api/membresias/:id - eliminar una membresía (solo admin)
const deleteMembresia = async (req, res) => {
  try {
    const id = toPositiveInt(req.params.id);
    if (!id) return res.status(400).json({ message: 'id inválido' });

    const membresia = await Membresia.findByPk(id);
    if (!membresia) return res.status(404).json({ message: 'Membresía no encontrada' });

    await membresia.destroy();
    res.json({ message: 'Membresía eliminada correctamente' });
  } catch (error) {
    sendError(res, 500, 'Error al eliminar la membresía', error);
  }
};

module.exports = {
  getMembresias,
  getMembresiaById,
  getMembresiasByCliente,
  createMembresia,
  updateMembresia,
  deleteMembresia
};
