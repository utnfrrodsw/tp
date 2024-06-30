import { Deporte } from './deporte.entity.js';

//Deporte -> /api/deportes/
//post /api/deportes -> crear nuevos Deporte
//delete /api/deportes/:id -> borrar Deporte con id = :id
//put & patch /api/deportes/:id -> modificar Deporte con id = :id
export const deportes = [
  new Deporte(
    " ",
    0,
    [],
    0,  
   ),
];
