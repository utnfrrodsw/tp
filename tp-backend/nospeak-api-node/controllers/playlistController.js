const Playlist = require('../models/playlist');

exports.getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find().populate('canciones usuario');
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.createPlaylist = async (req, res) => {
  try {
    const { titulo, descripcion, canciones, usuario, portada } = req.body;

    const nuevaPlaylist = new Playlist({
      titulo,
      descripcion,
      canciones,
      usuario,
      portada,
    });

    await nuevaPlaylist.save();

    res.status(201).json({ message: 'Playlist creada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getPlaylistById = async (req, res) => {
  try {
    const playlistId = req.params.id;
    const playlist = await Playlist.findById(playlistId).populate('canciones usuario');

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist no encontrada' });
    }

    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.updatePlaylist = async (req, res) => {
  try {
    const playlistId = req.params.id;
    const { titulo, descripcion, canciones, usuario, portada } = req.body;

    const playlistActualizada = await Playlist.findByIdAndUpdate(
      playlistId,
      { titulo, descripcion, canciones, usuario, portada },
      { new: true }
    ).populate('canciones usuario');

    if (!playlistActualizada) {
      return res.status(404).json({ message: 'Playlist no encontrada' });
    }

    res.status(200).json(playlistActualizada);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.deletePlaylist = async (req, res) => {
  try {
    const playlistId = req.params.id;
    const result = await Playlist.findByIdAndRemove(playlistId);

    if (!result) {
      return res.status(404).json({ message: 'Playlist no encontrada' });
    }

    res.status(200).json({ message: 'Playlist eliminada con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getPlaylistsByUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.usuario_id;
    const playlists = await Playlist.find({ usuario: usuarioId }).populate('canciones usuario');

    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
