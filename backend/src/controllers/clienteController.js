const sequelize = require('../config/database');
const { Cliente, Usuario, Membresia } = require('../models/associations');
const { validatePassword, hashPassword, hashPasswordInicial } = require('../utils/password');
const { toPositiveInt, isValidEmail, sendError, esErrorDeReferencia } = require('../utils/http');
const { calcularEstado } = require('../utils/membresia');

// Todo cliente tiene una cuenta: se trae lo necesario para saber su estado
const incluirUsuario = {
  model: Usuario,
  as: 'usuario',
  attributes: ['id', 'activo', 'debeCambiarPassword']
};

const aRespuesta = (cliente, usuario = cliente.usuario) => ({
  dni: cliente.dni,
  nombre: cliente.nombre,
  apellido: cliente.apellido,
  telefono: cliente.telefono,
  email: cliente.email,
  estado: cliente.estado,
  // Si puede entrar a la app
  activo: usuario.activo,
  // true mientras siga con la contraseña que le dio el admin
  debeCambiarPassword: usuario.debeCambiarPassword
});

// Cuál membresía mostrar de cada cliente: la que está en curso (Activa o Por vencer), si no la
// próxima (Pendiente) y si no la última que tuvo (Vencida)
const PRIORIDAD_ESTADO = { Activa: 0, 'Por vencer': 0, Pendiente: 1, Vencida: 2 };

const membresiaActual = (membresias) => {
  const candidatas = membresias
    .map((m) => ({
      fechaInicio: m.fechaInicio,
      fechaVencimiento: m.fechaVencimiento,
      estado: calcularEstado(m)
    }))
    .sort(
      (a, b) =>
        PRIORIDAD_ESTADO[a.estado] - PRIORIDAD_ESTADO[b.estado] ||
        (a.estado === 'Pendiente'
          ? a.fechaInicio.localeCompare(b.fechaInicio)
          : b.fechaVencimiento.localeCompare(a.fechaVencimiento))
    );
  return candidatas[0] ?? null;
};

// Solo el admin ve las membresías: al profesor no se le agrega el campo
const conMembresia = async (respuestas, user) => {
  if (user.rol !== 'admin' || respuestas.length === 0) return respuestas;
  const membresias = await Membresia.findAll({
    where: { dniCliente: respuestas.map((r) => r.dni) },
    attributes: ['dniCliente', 'fechaInicio', 'fechaVencimiento']
  });
  const porCliente = new Map();
  for (const m of membresias) {
    porCliente.set(m.dniCliente, [...(porCliente.get(m.dniCliente) ?? []), m]);
  }
  return respuestas.map((r) => ({ ...r, membresia: membresiaActual(porCliente.get(r.dni) ?? []) }));
};

const textoValido = (valor) => typeof valor === 'string' && valor.trim().length > 0;

// El teléfono es opcional: vacío o null se guarda como null
const textoOpcional = (valor) =>
  valor === null || valor === undefined || String(valor).trim() === ''
    ? null
    : String(valor).trim();

// Es lo que entra en la columna (STRING(30)); más largo daría un error de la base
const TELEFONO_MAX = 30;

const normalizarEmail = (email) => email.trim().toLowerCase();

const emailEnUso = async (email) => Boolean(await Usuario.findOne({ where: { email } }));

const crearCuenta = async (email, dni, transaction) =>
  Usuario.create(
    {
      email,
      passwordHash: await hashPasswordInicial(dni),
      rol: 'cliente',
      debeCambiarPassword: true
    },
    { transaction }
  );

const manejarError = (res, error, mensaje) => {
  // Respaldo por si dos altas simultáneas pasan los chequeos previos
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res
      .status(409)
      .json({ message: 'Ya existe un cliente con ese DNI o una cuenta con ese email' });
  }
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ message: error.errors.map((e) => e.message).join(', ') });
  }
  if (esErrorDeReferencia(error)) {
    return res.status(409).json({
      message: 'No se puede eliminar: el cliente tiene registros asociados (por ej. rutinas)'
    });
  }
  sendError(res, 500, mensaje, error);
};

// GET /clientes
const getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      include: incluirUsuario,
      order: [
        ['apellido', 'ASC'],
        ['nombre', 'ASC']
      ]
    });
    res.json(
      await conMembresia(
        clientes.map((cliente) => aRespuesta(cliente)),
        req.user
      )
    );
  } catch (error) {
    sendError(res, 500, 'Error al obtener clientes', error);
  }
};

// GET /clientes/me - el cliente que inició sesión ve sus propios datos
const getMiPerfil = async (req, res) => {
  try {
    const cliente = await Cliente.findOne({
      where: { idUsuario: req.user.id },
      include: incluirUsuario
    });
    if (!cliente) return res.status(404).json({ message: 'No encontrado' });
    res.json(aRespuesta(cliente));
  } catch (error) {
    sendError(res, 500, 'Error al obtener el perfil', error);
  }
};

// PUT /clientes/me - el cliente solo puede cambiar su teléfono. El resto de sus datos (nombre,
// email, DNI, acceso) los corrige el admin, porque afectan su cuenta y sus registros
const updateMiPerfil = async (req, res) => {
  try {
    const cliente = await Cliente.findOne({
      where: { idUsuario: req.user.id },
      include: incluirUsuario
    });
    if (!cliente) return res.status(404).json({ message: 'No encontrado' });

    if (!('telefono' in req.body)) {
      return res.status(400).json({ message: 'Solo podés modificar tu teléfono' });
    }
    const telefono = textoOpcional(req.body.telefono);
    if (telefono !== null && telefono.length > TELEFONO_MAX) {
      return res
        .status(400)
        .json({ message: `telefono no puede tener más de ${TELEFONO_MAX} caracteres` });
    }

    await cliente.update({ telefono });
    res.json(aRespuesta(cliente));
  } catch (error) {
    manejarError(res, error, 'Error al actualizar el perfil');
  }
};

// GET /clientes/:dni
const getClienteByDni = async (req, res) => {
  try {
    const dni = toPositiveInt(req.params.dni);
    if (!dni) return res.status(400).json({ message: 'dni inválido' });

    const cliente = await Cliente.findByPk(dni, { include: incluirUsuario });
    if (!cliente) return res.status(404).json({ message: 'No encontrado' });
    const [respuesta] = await conMembresia([aRespuesta(cliente)], req.user);
    res.json(respuesta);
  } catch (error) {
    sendError(res, 500, 'Error al obtener cliente', error);
  }
};

// POST /clientes - crea el cliente y su cuenta (contraseña inicial: el DNI) en una transacción
const createCliente = async (req, res) => {
  try {
    const { dni, nombre, apellido, telefono, email, estado } = req.body;
    const dniNum = toPositiveInt(dni);
    if (!dniNum) {
      return res.status(400).json({ message: 'dni es obligatorio y debe ser un entero positivo' });
    }
    if (!textoValido(nombre) || !textoValido(apellido)) {
      return res.status(400).json({ message: 'nombre y apellido son obligatorios' });
    }
    // El email es el usuario con el que el cliente entra a la app
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'email es obligatorio y tiene que ser válido' });
    }
    if (estado !== undefined && typeof estado !== 'boolean') {
      return res.status(400).json({ message: 'estado debe ser true o false' });
    }
    if ((textoOpcional(telefono) ?? '').length > TELEFONO_MAX) {
      return res
        .status(400)
        .json({ message: `telefono no puede tener más de ${TELEFONO_MAX} caracteres` });
    }
    const emailNorm = normalizarEmail(email);

    if (await Cliente.findByPk(dniNum)) {
      return res.status(409).json({ message: 'Ya existe un cliente con ese DNI' });
    }
    if (await emailEnUso(emailNorm)) {
      return res.status(409).json({ message: 'Ya existe una cuenta con ese email' });
    }

    const { cliente, usuario } = await sequelize.transaction(async (transaction) => {
      const usuario = await crearCuenta(emailNorm, dniNum, transaction);
      const cliente = await Cliente.create(
        {
          dni: dniNum,
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          telefono: textoOpcional(telefono),
          email: emailNorm,
          ...(estado !== undefined && { estado }),
          idUsuario: usuario.id
        },
        { transaction }
      );
      return { cliente, usuario };
    });

    res.status(201).json(aRespuesta(cliente, usuario));
  } catch (error) {
    manejarError(res, error, 'Error al crear cliente');
  }
};

// PUT /clientes/:dni - admite nombre, apellido, telefono, email, estado, activo (si puede entrar)
// y password (el admin le pone una nueva)
const updateCliente = async (req, res) => {
  try {
    const dni = toPositiveInt(req.params.dni);
    if (!dni) return res.status(400).json({ message: 'dni inválido' });

    const cliente = await Cliente.findByPk(dni);
    if (!cliente) return res.status(404).json({ message: 'No encontrado' });
    const usuario = await Usuario.findByPk(cliente.idUsuario);

    const { nombre, apellido, telefono, email, estado, password, activo } = req.body;
    const cambiosCliente = {};
    const cambiosUsuario = {};

    for (const [campo, valor] of Object.entries({ nombre, apellido })) {
      if (valor === undefined) continue;
      if (!textoValido(valor)) {
        return res.status(400).json({ message: `${campo} no puede estar vacío` });
      }
      cambiosCliente[campo] = valor.trim();
    }

    if (telefono !== undefined) {
      const tel = textoOpcional(telefono);
      if (tel !== null && tel.length > TELEFONO_MAX) {
        return res
          .status(400)
          .json({ message: `telefono no puede tener más de ${TELEFONO_MAX} caracteres` });
      }
      cambiosCliente.telefono = tel;
    }

    if (email !== undefined) {
      if (!isValidEmail(email)) return res.status(400).json({ message: 'email inválido' });
      const emailNorm = normalizarEmail(email);
      cambiosCliente.email = emailNorm;
      // El email del cliente es también el usuario con el que entra a la app
      if (emailNorm !== usuario.email) {
        if (await emailEnUso(emailNorm)) {
          return res.status(409).json({ message: 'Ya existe una cuenta con ese email' });
        }
        cambiosUsuario.email = emailNorm;
      }
    }

    if (estado !== undefined) {
      if (typeof estado !== 'boolean') {
        return res.status(400).json({ message: 'estado debe ser true o false' });
      }
      cambiosCliente.estado = estado;
    }

    if (activo !== undefined) {
      if (typeof activo !== 'boolean') {
        return res.status(400).json({ message: 'activo debe ser true o false' });
      }
      cambiosUsuario.activo = activo;
    }

    if (password !== undefined) {
      const errorPassword = validatePassword(password);
      if (errorPassword) return res.status(400).json({ message: errorPassword });
      cambiosUsuario.passwordHash = await hashPassword(password);
      // Una contraseña nueva cierra las sesiones abiertas del cliente, y como la eligió el admin,
      // se le vuelve a recordar al cliente que elija la suya
      cambiosUsuario.tokenVersion = usuario.tokenVersion + 1;
      cambiosUsuario.debeCambiarPassword = true;
    }

    await sequelize.transaction(async (transaction) => {
      if (Object.keys(cambiosCliente).length) await cliente.update(cambiosCliente, { transaction });
      if (Object.keys(cambiosUsuario).length) await usuario.update(cambiosUsuario, { transaction });
    });

    res.json(aRespuesta(cliente, usuario));
  } catch (error) {
    manejarError(res, error, 'Error al actualizar cliente');
  }
};

// DELETE /clientes/:dni - borra el cliente y su cuenta
const deleteCliente = async (req, res) => {
  try {
    const dni = toPositiveInt(req.params.dni);
    if (!dni) return res.status(400).json({ message: 'dni inválido' });

    const cliente = await Cliente.findByPk(dni);
    if (!cliente) return res.status(404).json({ message: 'No encontrado' });

    await sequelize.transaction(async (transaction) => {
      const { idUsuario } = cliente;
      await cliente.destroy({ transaction });
      await Usuario.destroy({ where: { id: idUsuario }, transaction });
    });
    res.json({ message: 'Cliente eliminado' });
  } catch (error) {
    manejarError(res, error, 'Error al eliminar cliente');
  }
};

module.exports = {
  getClientes,
  getMiPerfil,
  updateMiPerfil,
  getClienteByDni,
  createCliente,
  updateCliente,
  deleteCliente
};
