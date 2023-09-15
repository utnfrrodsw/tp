import { Router } from "express";
import { sanitizeCategoriaInput, findAll, findOne, add, update, remove } from "./categoria.controler.js";

export const Categoriarouter = Router();

Categoriarouter.get('/', findAll);

Categoriarouter.get('/:id', findOne);

Categoriarouter.post('/', sanitizeCategoriaInput, add);

Categoriarouter.put('/:id', sanitizeCategoriaInput, update);

Categoriarouter.patch('/:id', sanitizeCategoriaInput, update);

Categoriarouter.delete('/:id', remove);
