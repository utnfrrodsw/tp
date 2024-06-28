import { Socio } from './socio.entity.js';

// Socio -> /api/socios/
// post /api/socios -> crear nuevos Socio
// delete /api/socios/:id -> borrar Socio con id = :id
// put & patch /api/socios/:id -> modificar Socio con id = :id
export const socios = [
  new Socio(
    " ",
    " ",
    0,
    0
  ),
];