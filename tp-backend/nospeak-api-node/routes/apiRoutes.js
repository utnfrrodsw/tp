const express = require('express');
const router = express.Router();

const usuarioRoutes = require('./usuarioRoutes');
const artistaRoutes = require('./artistaRoutes');
const albumRoutes = require('./albumRoutes');
const cancionRoutes = require('./cancionRoutes');
const playlistRoutes = require('./playlistRoutes');
const recomendacionRoutes = require('./recomendacionRoutes');
const historialRoutes = require('./historialRoutes');

router.use('/usuarios', usuarioRoutes);
router.use('/artistas', artistaRoutes);
router.use('/albums', albumRoutes);
router.use('/canciones', cancionRoutes);
router.use('/playlists', playlistRoutes);
router.use('/recomendaciones', recomendacionRoutes);
router.use('/historiales', historialRoutes);

module.exports = router;
