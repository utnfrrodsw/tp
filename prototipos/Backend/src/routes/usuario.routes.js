const express = require('express');
const usuarioRouter = express.Router();
const uc = require('../controllers/usuario');

usuarioRouter.get('/', uc.getUsuarios);
usuarioRouter.get('/id/:id', uc.getUsuario);
usuarioRouter.post('/add', uc.createUsuario);
usuarioRouter.put('/edit/:id', uc.updateUsuario);
usuarioRouter.delete('/delete/:id', uc.deleteUsuario);

module.exports = usuarioRouter;
