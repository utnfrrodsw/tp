const Historial = require('../models/historial');


exports.getHistoriales = async (req, res) => {
  try {
    const historiales = await Historial.find().populate('canciones usuario');
    res.status(200).json(historiales);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


exports.createHistorial = async (req, res) => {
  try {
    const { fecha_reproduccion, canciones, usuario } = req.body;

    const nuevoHistorial = new Historial({
      fecha_reproduccion,
      canciones,
      usuario,
    });

    await nuevoHistorial.save();

    res.status(201).json({ message: 'Historial de reproducción creado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


exports.getHistorialById = async (req, res) => {
  const historialId = req.params.id;
  try {
    const historial = await Historial.findById(historialId).populate('canciones usuario');
    if (!historial) {
      return res.status(404).json({ message: 'Historial de reproducción no encontrado' });
    }
    res.status(200).json(historial);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


exports.updateHistorial = async (req, res) => {
  const historialId = req.params.id;
  const { fecha_reproduccion, canciones, usuario } = req.body;

  try {
    const historial = await Historial.findByIdAndUpdate(
      historialId,
      { fecha_reproduccion, canciones, usuario },
      { new: true }
    ).populate('canciones usuario');

    if (!historial) {
      return res.status(404).json({ message: 'Historial de reproducción no encontrado' });
    }

    res.status(200).json({ message: 'Historial de reproducción actualizado exitosamente', historial });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


exports.deleteHistorial = async (req, res) => {
  const historialId = req.params.id;

  try {
    const historial = await Historial.findByIdAndRemove(historialId);

    if (!historial) {
      return res.status(404).json({ message: 'Historial de reproducción no encontrado' });
    }

    res.status(200).json({ message: 'Historial de reproducción eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


exports.getHistorialByUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.usuario_id;

    const historial = await Historial.findOne({ usuario: usuarioId }).populate('canciones');

    if (!historial) {
      return res.status(404).json({ message: 'Historial no encontrado' });
    }

    res.status(200).json(historial);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
