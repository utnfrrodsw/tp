const Usuario = require('../models/Usuario');


exports.getUsuarios = async (req, res) => {
    
};

exports.getUsuarioById = async (req, res) => {
    try {
      const usuario = await Usuario.findById(req.params.id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el usuario' });
    }
  };

exports.createUsuario = async (req, res) => {
    try {
      const { nombre, email, password } = req.body;
      const usuario = new Usuario({ nombre, email, password });
      await usuario.save();
      res.status(201).json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el usuario' });
    }
  };

  exports.updateUsuario = async (req, res) => {
    try {
      const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
  };

  exports.deleteUsuario = async (req, res) => {
    try {
      const usuario = await Usuario.findByIdAndDelete(req.params.id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
  };
