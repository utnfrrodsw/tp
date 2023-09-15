const express = require('express');
const libroRouter = express.Router();
const lc = require('../controllers/libro');

libroRouter.get('/', lc.getLibros);
libroRouter.get('/id/:id', lc.getLibro);
libroRouter.post('/add', lc.createLibro);
libroRouter.put('/edit/:id', lc.updateLibro);
libroRouter.delete('/delete/:id', lc.deleteLibro);

module.exports = libroRouter;
