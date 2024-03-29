const Cancion = require('../models/cancion');
const Usuario = require('../models/usuario');
const Album = require('../models/album');
exports.getCanciones = async (req, res) => {
  try {
    const canciones = await Cancion.find().populate('artista album');
    return res.status(200).json(canciones);
  } catch (error) {
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
      const usuario = await Usuario.findById(req.userId);
      console.log(req.userId)
      // Verifica si el usuario es un artista
      if (usuario && !usuario.isArtist) {
        return res.status(401).json({ mensaje: 'No tiene permisos para crear canciones' });
      } else {
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
    }
    } catch (error) {
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
  
  if(Usuario.isArtist === false){
    return res.status(401).json({ mensaje: 'No tiene permisos para editar canciones' });
  } else {
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
  }
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};


exports.deleteCancion = async (req, res) => {
  try {
    const cancionId = req.params.id;

    if (Usuario.isArtist === false) {
      return res.status(401).json({ mensaje: 'No tiene permisos para eliminar canciones' });
    } else {
    const result = await Cancion.findByIdAndRemove(cancionId);

    if (!result) {
      return res.status(404).json({ mensaje: 'Canción no encontrada' });
    }


    return res.status(200).json({ mensaje: 'Canción eliminada con éxito' });
  }
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};


exports.getCancionesPorArtista = async (req, res) => {
  try {
    const { artista_id } = req.params;

    const canciones = await Cancion.find({ artista: artista_id })
      .populate('artista') 
      .populate('album');   

    res.json(canciones);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// exports.getCancionesPorAlbum = async (req, res) => {
//   try {
//     const { album_id } = req.params.album_id;

//     const canciones = await Cancion.find({ album: album_id })
//       .populate('artista') 
//       .populate('album');   

//     res.json(canciones);
//   } catch (error) {
//     res.status(500).json({ error: 'Error interno del servidor' });
//   }
// };
exports.getCancionesPorAlbum = async (req, res) => {
  try {
    const {albumId} = req.body.album._id;
    
    const canciones = await Cancion.find({ album: albumId });

    return res.status(200).json(canciones);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
