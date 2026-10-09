const sequelize = require('../config/database');
const { Cliente, Usuario } = require('../models/associations');
const { validatePassword, hashPassword, hashPasswordInicial } = require('../utils/password');
const { toPositiveInt, isValidEmail, sendError } = require('../utils/http');

// La cuenta es opcional: solo se trae lo necesario para saber si existe y su estado
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
  tieneCuenta: Boolean(usuario),
  // Si puede entrar a la app (false si no tiene cuenta)
  activo: usuario?.activo ?? false,
  // true mientras siga con la contraseña que le dio el admin
  debeCambiarPassword: usuario?.debeCambiarPassword ?? false
});

const textoValido = (valor) => typeof valor === 'string' && valor.trim().length > 0;

// Teléfono y email son opcionales: vacío o null se guarda como null
const textoOpcional = (valor) =>
  valor === null || valor === undefined || String(valor).trim() === ''
    ? null
    : String(valor).trim();

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
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res
      .status(409)
      .json({
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
    res.json(clientes.map((cliente) => aRespuesta(cliente)));
  } catch (error) {
    sendError(res, 500, 'Error al obtener clientes', error);
  }
};

// GET /clientes/:dni
const getClienteByDni = async (req, res) => {
  try {
    const dni = toPositiveInt(req.params.dni);
    if (!dni) return res.status(400).json({ message: 'dni inválido' });

    const cliente = await Cliente.findByPk(dni, { include: incluirUsuario });
    if (!cliente) return res.status(404).json({ message: 'No encontrado' });
    res.json(aRespuesta(cliente));
  } catch (error) {
    sendError(res, 500, 'Error al obtener cliente', error);
  }
};

// POST /clientes - con crearCuenta: true también crea su cuenta (contraseña inicial: el DNI)
const createCliente = async (req, res) => {
  try {
    const { dni, nombre, apellido, telefono, email, estado, crearCuenta: conCuenta } = req.body;
    const dniNum = toPositiveInt(dni);
    if (!dniNum) {
      return res.status(400).json({ message: 'dni es obligatorio y debe ser un entero positivo' });
    }
    if (!textoValido(nombre) || !textoValido(apellido)) {
      return res.status(400).json({ message: 'nombre y apellido son obligatorios' });
    }
    const emailNorm = textoOpcional(email) && normalizarEmail(String(email));
    if (emailNorm && !isValidEmail(emailNorm)) {
      return res.status(400).json({ message: 'email inválido' });
    }
    if (estado !== undefined && typeof estado !== 'boolean') {
      return res.status(400).json({ message: 'estado debe ser true o false' });
    }
    if (conCuenta !== undefined && typeof conCuenta !== 'boolean') {
      return res.status(400).json({ message: 'crearCuenta debe ser true o false' });
    }
    if (conCuenta && !emailNorm) {
      return res
        .status(400)
        .json({ message: 'Para darle acceso a la app el cliente necesita un email' });
    }

    if (await Cliente.findByPk(dniNum)) {
      return res.status(409).json({ message: 'Ya existe un cliente con ese DNI' });
    }
    if (conCuenta && (await emailEnUso(emailNorm))) {
      return res.status(409).json({ message: 'Ya existe una cuenta con ese email' });
    }

    const { cliente, usuario } = await sequelize.transaction(async (transaction) => {
      const usuario = conCuenta ? await crearCuenta(emailNorm, dniNum, transaction) : null;
      const cliente = await Cliente.create(
        {
          dni: dniNum,
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          telefono: textoOpcional(telefono),
          email: emailNorm || null,
          ...(estado !== undefined && { estado }),
          idUsuario: usuario?.id ?? null
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

// POST /clientes/:dni/cuenta - da acceso a un cliente que todavía no tiene cuenta
const crearCuentaCliente = async (req, res) => {
  try {
    const dni = toPositiveInt(req.params.dni);
    if (!dni) return res.status(400).json({ message: 'dni inválido' });

    const cliente = await Cliente.findByPk(dni);
    if (!cliente) return res.status(404).json({ message: 'No encontrado' });
    if (cliente.idUsuario)
      return res.status(409).json({ message: 'El cliente ya tiene una cuenta' });
    if (!cliente.email || !isValidEmail(cliente.email)) {
      return res
        .status(400)
        .json({ message: 'El cliente no tiene un email válido: cargalo antes de darle acceso' });
    }
    const email = normalizarEmail(cliente.email);
    if (await emailEnUso(email)) {
      return res.status(409).json({ message: 'Ya existe una cuenta con el email del cliente' });
    }

    await sequelize.transaction(async (transaction) => {
      const usuario = await crearCuenta(email, dni, transaction);
      await cliente.update({ idUsuario: usuario.id }, { transaction });
    });
    res
      .status(201)
      .json({ message: 'Cuenta creada. La contraseña inicial es el DNI del cliente.' });
  } catch (error) {
    manejarError(res, error, 'Error al crear la cuenta');
  }
};

// PUT /clientes/:dni - admite nombre, apellido, telefono, email, estado y, si tiene cuenta,
// activo (si puede entrar) y password (el admin le pone una nueva)
const updateCliente = async (req, res) => {
  try {
    const dni = toPositiveInt(req.params.dni);
    if (!dni) return res.status(400).json({ message: 'dni inválido' });

    const cliente = await Cliente.findByPk(dni);
    if (!cliente) return res.status(404).json({ message: 'No encontrado' });
    const usuario = cliente.idUsuario ? await Usuario.findByPk(cliente.idUsuario) : null;

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

    if (telefono !== undefined) cambiosCliente.telefono = textoOpcional(telefono);

    if (email !== undefined) {
      const emailNorm = textoOpcional(email) && normalizarEmail(String(email));
      if (emailNorm && !isValidEmail(emailNorm)) {
        return res.status(400).json({ message: 'email inválido' });
      }
      if (!emailNorm && usuario) {
        return res
          .status(400)
          .json({ message: 'El cliente tiene cuenta: el email no puede quedar vacío' });
      }
      cambiosCliente.email = emailNorm || null;
      // El email del cliente es también el usuario con el que entra a la app
      if (usuario && emailNorm !== usuario.email) {
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

    if ((activo !== undefined || password !== undefined) && !usuario) {
      return res.status(400).json({ message: 'El cliente no tiene cuenta: primero dale acceso' });
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

// DELETE /clientes/:dni - borra el cliente y su cuenta, si tiene
const deleteCliente = async (req, res) => {
  try {
    const dni = toPositiveInt(req.params.dni);
    if (!dni) return res.status(400).json({ message: 'dni inválido' });

    const cliente = await Cliente.findByPk(dni);
    if (!cliente) return res.status(404).json({ message: 'No encontrado' });

    await sequelize.transaction(async (transaction) => {
      const { idUsuario } = cliente;
      await cliente.destroy({ transaction });
      if (idUsuario) await Usuario.destroy({ where: { id: idUsuario }, transaction });
    });
    res.json({ message: 'Cliente eliminado' });
  } catch (error) {
    manejarError(res, error, 'Error al eliminar cliente');
  }
};

module.exports = {
  getClientes,
  getClienteByDni,
  createCliente,
  crearCuentaCliente,
  updateCliente,
  deleteCliente
};
