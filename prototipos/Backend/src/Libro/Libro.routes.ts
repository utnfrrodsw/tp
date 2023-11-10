import { Router } from 'express';
import {
    findAll, findOne, sanitizeInput, add, remove, update, findByEditorial, findByAutor, findByCategoria, findByFormatoLibro, getLibros, getIsbn, getTitulo, getIdioma, getDescripcion, getPrecio, getFechaEdicion, getAutores, getEditorial, getCategorias, getFormatos, getPortada, getCalificacion
} from './Libro.controller.js';

export const libroRouter = Router();

// Otros
libroRouter.get('/editoriales/:editorialId', findByEditorial);
libroRouter.get('/autores/:autorId', findByAutor);
libroRouter.get("/categorias/:categoriaId", findByCategoria);
libroRouter.get("/formatos/:formatoId", findByFormatoLibro);
libroRouter.get("/libros", getLibros);
libroRouter.get('/isbn/:id', getIsbn);
libroRouter.get('/titulo/:id', getTitulo);
libroRouter.get('/idioma/:id', getIdioma);
libroRouter.get('/descripcion/:id', getDescripcion);
libroRouter.get('/precio/:id', getPrecio);
libroRouter.get('/fechaEdicion/:id', getFechaEdicion);
libroRouter.get('/getautores/:id', getAutores);
libroRouter.get('/geteditorial/:id', getEditorial);
libroRouter.get('/getcategorias/:id', getCategorias);
libroRouter.get('/getformatos/:id', getFormatos);
libroRouter.get('/portada/:id', getPortada);
libroRouter.get('/calificacion/:id', getCalificacion);

libroRouter.get('/', findAll);
libroRouter.get('/:id', findOne);
libroRouter.post('/', sanitizeInput, add);
libroRouter.put('/:id', sanitizeInput, update);
libroRouter.patch('/:id', sanitizeInput, update);
libroRouter.delete('/:id', remove);