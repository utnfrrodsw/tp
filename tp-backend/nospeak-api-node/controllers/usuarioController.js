const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


exports.getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.updateUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    usuario.nombre = nombre;
    usuario.email = email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      usuario.password = hashedPassword;
    }

    await usuario.save();

    res.status(200).json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.deleteUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.id;

    const result = await Usuario.findByIdAndRemove(usuarioId);

    if (!result) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};



exports.createUsuario = async (req, res) => {
  try {
    const { nombre, email, password, isAdmin } = req.body;

    const usuarioExistente = await Usuario.findOne({ email });

    if (usuarioExistente) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: hashedPassword,
      isAdmin,
    });

    await nuevoUsuario.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
  };

exports.loginUsuario = async (req, res) =>{
  try {
    const { nombre, password } = req.body;

    const usuario = await Usuario.findOne({ nombre });

    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const passwordMatch = await bcrypt.compare(password, usuario.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { userId: usuario._id, nombre: usuario.nombre, isAdmin: usuario.isAdmin },
      config.tokenSecretKey,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, userId: usuario._id, nombre: usuario.nombre, isAdmin: usuario.isAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }

};
