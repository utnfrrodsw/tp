const express = require('express');
const router = express.Router();

const usuarioRoutes = require('./usuarioRoutes');
const usuarioLoginRoutes = require('./usuarioLoginRoutes');
const artistaRoutes = require('./artistasRoutes');
const albumRoutes = require('./albumRoutes');
const cancionRoutes = require('./cancionRoutes');
const cancionArtistaRoutes = require('./cancionArtistaRoutes');
const cancionAlbumRoutes = require('./cancionAlbumRoutes');
const playlistRoutes = require('./playlistRoutes');
const playlistUsuarioRoutes = require('./playlistUsuarioRoutes');
const recomendacionRoutes = require('./recomendacionRoutes');
const historialRoutes = require('./historialRoutes');
const historialUsuarioRoutes = require('./historialUsuarioRoutes');


router.use('/usuarios', usuarioRoutes);
router.use('/usuarios-login', usuarioLoginRoutes);
router.use('/artistas', artistaRoutes);
router.use('/albums', albumRoutes);
router.use('/canciones', cancionRoutes);
router.use('/canciones-artista', cancionArtistaRoutes);
router.use('/canciones-album', cancionArtistaRoutes);
router.use('/playlists', playlistRoutes);
router.use('/playlists-usuario', playlistUsuarioRoutes);
router.use('/recomendaciones', recomendacionRoutes);
router.use('/historiales', historialRoutes);
router.use('/historiales-usuario', historialUsuarioRoutes);

module.exports = router;
