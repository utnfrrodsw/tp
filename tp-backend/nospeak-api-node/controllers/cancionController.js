const Cancion = require('../models/Cancion');

exports.getCanciones = async (req, res) => {
  try {
    const canciones = await Cancion.find().populate('artista album');
    return res.status(200).json(canciones);
  } catch (error) {
    console.error('Error al obtener las canciones:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

exports.createCancion = async (req, res) => {
  try {
    const {
      titulo,
      anio_lanzamiento,
      genero,
      duracion,
      audio,
      spotify_id,
      artista,
      album,
    } = req.body;

    const nuevaCancion = new Cancion({
      titulo,
      anio_lanzamiento,
      genero,
      duracion,
      audio,
      spotify_id,
      artista,
      album,
    });

    await nuevaCancion.save();

    return res.status(201).json(nuevaCancion);
  } catch (error) {
    console.error('Error al crear la canción:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

exports.getCancionById = async (req, res) => {
  try {
    const cancionId = req.params.id;

    const cancion = await Cancion.findById(cancionId).populate('artista album');

    if (!cancion) {
      return res.status(404).json({ mensaje: 'Canción no encontrada' });
    }

    return res.status(200).json(cancion);
  } catch (error) {
    console.error('Error al obtener la canción por ID:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};


exports.updateCancion = async (req, res) => {
  try {
    const cancionId = req.params.id;
    const {
      titulo,
      anio_lanzamiento,
      genero,
      duracion,
      audio,
      spotify_id,
      artista,
      album,
    } = req.body;

    const cancionActualizada = await Cancion.findByIdAndUpdate(
      cancionId,
      {
        titulo,
        anio_lanzamiento,
        genero,
        duracion,
        audio,
        spotify_id,
        artista,
        album,
      },
      { new: true }
    ).populate('artista album');

    if (!cancionActualizada) {
      return res.status(404).json({ mensaje: 'Canción no encontrada' });
    }

    return res.status(200).json(cancionActualizada);
  } catch (error) {
    console.error('Error al actualizar la canción por ID:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};


exports.deleteCancion = async (req, res) => {
  try {
    const cancionId = req.params.id;

    const result = await Cancion.findByIdAndRemove(cancionId);

    if (!result) {
      return res.status(404).json({ mensaje: 'Canción no encontrada' });
    }

    return res.status(200).json({ mensaje: 'Canción eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la canción:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
