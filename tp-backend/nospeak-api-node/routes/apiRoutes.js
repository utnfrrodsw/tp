const express = require('express');
const router = express.Router();
const verificarRol = require('../middlewares/verificarRolMiddleware');
const verificarToken = require('../middlewares/verificarTokenMiddleware'); 

const usuarioController = require('../controllers/usuarioController');
const artistaController = require('../controllers/artistaController');
const albumController = require('../controllers/albumController');
const cancionController = require('../controllers/cancionController');
const playlistController = require('../controllers/playlistController');
const recomendacionController = require('../controllers/recomendacionController');
const historialController = require('../controllers/historialController');

router.get('/usuarios', verificarToken, verificarRol,usuarioController.getUsuarios);
router.post('/usuarios', usuarioController.createUsuario);
router.get('/usuarios/:id', verificarToken, usuarioController.getUsuarioById);
router.put('/usuarios/:id', verificarToken, usuarioController.updateUsuario);
router.delete('/usuarios/:id', verificarToken, usuarioController.deleteUsuario);
router.post('/usuarios-login/', usuarioController.loginUsuario);


router.get('/artistas', verificarToken, artistaController.getArtistas);
router.post('/artistas', verificarToken, verificarRol, artistaController.createArtista);
router.get('/artistas/:id', verificarToken, artistaController.getArtistaById);
router.patch('/artistas/:id', verificarToken, verificarRol, artistaController.updateArtista);
router.delete('/artistas/:id', verificarToken, verificarRol, artistaController.deleteArtista);

router.get('/albums', verificarToken, albumController.getAlbums);
router.post('/albums', verificarToken, verificarRol, albumController.createAlbum);
router.get('/albums/:id', verificarToken, albumController.getAlbumById);
router.patch('/albums/:id', verificarToken, verificarRol, albumController.updateAlbum);
router.delete('/albums/:id', verificarToken, verificarRol, albumController.deleteAlbum);

router.get('/canciones', verificarToken, cancionController.getCanciones);
router.post('/canciones', verificarToken, verificarRol, cancionController.createCancion);
router.get('/canciones/:id', verificarToken, cancionController.getCancionById);
router.patch('/canciones/:id', verificarToken, verificarRol, cancionController.updateCancion);
router.delete('/canciones/:id', verificarToken, verificarRol, cancionController.deleteCancion);
router.get('/canciones-artista/:artista_id', verificarToken, cancionController.getCancionesPorArtista);
router.get('/canciones-album/:album_id', verificarToken ,cancionController.getCancionesPorAlbum);


router.get('/playlists', verificarToken, playlistController.getPlaylists);
router.post('/playlists', verificarToken, playlistController.createPlaylist);
router.get('/playlists/:id', verificarToken, playlistController.getPlaylistById);
router.patch('/playlists/:id', verificarToken, playlistController.updatePlaylist);
router.delete('/playlists/:id', verificarToken, playlistController.deletePlaylist);
router.get('/playlists-usuario/:usuario_id', verificarToken, playlistController.getPlaylistsByUsuario);

router.post('/recomendaciones', verificarToken, recomendacionController.createRecomendacion);

router.get('/historiales', verificarToken, historialController.getHistoriales);
router.post('/historiales', verificarToken, historialController.createHistorial);
router.get('/historiales/:id', verificarToken, historialController.getHistorialById);
router.patch('/historiales/:id', verificarToken, historialController.updateHistorial);
router.delete('/historiales/:id', verificarToken, verificarRol, historialController.deleteHistorial);
router.get('/historiales-usuario/:usuario_id', verificarToken, verificarRol, historialController.getHistorialByUsuario);

module.exports = router;
