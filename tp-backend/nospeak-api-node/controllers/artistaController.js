const Artista = require('../models/artista');

exports.getArtistas = async (req, res) => {
  try {
    const artistas = await Artista.find();
    return res.status(200).json(artistas);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

exports.createArtista = async (req, res) => {
  try {
    const { nombre, nacionalidad, nro_seguidores, portada } = req.body;

    const nuevoArtista = new Artista({
      nombre,
      nacionalidad,
      nro_seguidores,
      portada,
    });

    await nuevoArtista.save();

    return res.status(201).json(nuevoArtista);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

exports.getArtistaById = async (req, res) => {
  try {
    const artistaId = req.params.id;

    const artista = await Artista.findById(artistaId);

    if (!artista) {
      return res.status(404).json({ mensaje: 'Artista no encontrado' });
    }

    return res.status(200).json(artista);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

exports.updateArtista = async (req, res) => {
  try {
    const artistaId = req.params.id;
    const { nombre, nacionalidad, nro_seguidores, portada } = req.body;

    const artistaActualizado = await Artista.findByIdAndUpdate(
      artistaId,
      {
        nombre,
        nacionalidad,
        nro_seguidores,
        portada,
      },
      { new: true }
    );

    if (!artistaActualizado) {
      return res.status(404).json({ mensaje: 'Artista no encontrado' });
    }

    return res.status(200).json(artistaActualizado);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};


exports.deleteArtista = async (req, res) => {
  try {
    const artistaId = req.params.id;

    const result = await Artista.findByIdAndRemove(artistaId);

    if (!result) {
      return res.status(404).json({ mensaje: 'Artista no encontrado' });
    }

    return res.status(200).json({ mensaje: 'Artista eliminado con éxito' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
