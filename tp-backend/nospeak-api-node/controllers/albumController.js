const Album = require('../models/album');

exports.getAlbums = async (req, res) => {
    try {
      const albums = await Album.find();
      res.json(albums);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener álbumes' });
    }
  };  

exports.createAlbum = async (req, res) => {
    try {
      const { titulo, portada } = req.body;
      const album = new Album({ titulo, portada });
      await album.save();
      res.status(201).json(album);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  exports.getAlbumById = async (req, res) => {
    try {
      const albumId = req.params.id;
      const album = await Album.findById(albumId);
  
      if (!album) {
        return res.status(404).json({ mensaje: 'Álbum no encontrado' });
      }
  
      return res.status(200).json(album);
    } catch (error) {
      return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  };


exports.updateAlbum = async (req, res) => {
    try {
        const albumId = req.params.id;
        const { titulo, portada } = req.body;

        const existingAlbum = await Album.findById(albumId);

        if (!existingAlbum) {
        return res.status(404).json({ mensaje: 'Álbum no encontrado' });
        }

        existingAlbum.titulo = titulo;
        existingAlbum.portada = portada;

        await existingAlbum.save();

        return res.status(200).json(existingAlbum);
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};
  


exports.deleteAlbum = async (req, res) => {
  try {
    const albumId = req.params.id;

    const result = await Album.findByIdAndRemove(albumId);

    if (!result) {
      return res.status(404).json({ mensaje: 'Álbum no encontrado' });
    }

    return res.status(200).json({ mensaje: 'Álbum eliminado con éxito' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
