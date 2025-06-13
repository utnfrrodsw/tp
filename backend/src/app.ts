import express, { NextFunction, Request, Response } from 'express';
import { Usuario } from './usuario/usuario.js';
import { it } from 'node:test';

const app = express();
app.use(express.json());
const usuarios = [
  new Usuario(
    'a02b91bc-3769-4221-beb1-d7a3aeba7dad',
    'agusidana04@gmail.com',
    '123489sdfafgdfjasdhjahsd',
    'DNI',
    45949176,
    'Urquiza 7884',
    3413946996,
    'Agustin',
    'Dana'
  ),
];

function sanitizeUsuarioInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    email: req.body.email,
    contrasena: req.body.contrasena,
    tipoDoc: req.body.tipoDoc,
    numDoc: req.body.numDoc,
    direccion: req.body.direccion,
    telefono: req.body.telefono,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    fechaNacimiento: req.body.fechaNacimiento,
    nombreFantasia: req.body.nombreFantasia,
    foto: req.body.foto,
  };
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}
//...........................................GET...........................................
app.get('/api/usuarios', (req, res) => {
  res.json({ data: usuarios });
});
app.get('/api/usuarios/:id', (req, res) => {
  const usuario = usuarios.find((usuario) => usuario.id === req.params.id);
  if (!usuario) {
    res.status(404).send({ message: 'Usuario no encontrado' });
    return;
  }
  res.json({ data: usuario });
});

//...........................................POST...........................................
app.post('/api/usuarios', sanitizeUsuarioInput, (req, res) => {
  const input = req.body.sanitizedInput;
  const usuario = new Usuario(
    input.id,
    input.email,
    input.contrasena,
    input.tipoDoc,
    input.numDoc,
    input.direccion,
    input.telefono,
    input.nombre,
    input.apellido,
    input.fechaNacimiento,
    input.nombreFantasia,
    input.descripcion
  );
  usuarios.push(usuario);
  res.status(201).send({
    message: 'Usuario creado exitosamente',
    data: usuario,
  });
});
//...........................................PUT...........................................
app.put('/api/usuarios/:id', sanitizeUsuarioInput, (req, res) => {
  const usurioIdx = usuarios.findIndex(
    (usuario) => usuario.id === req.params.id
  );
  if (usurioIdx === -1) {
    res.status(404).send({ message: 'Usuario no encontrado' });
    return;
  }
  usuarios[usurioIdx] = { ...usuarios[usurioIdx], ...req.body.sanitizedInput };
  res.status(200).send({
    message: 'Usuario actualizado exitosamente',
    data: usuarios[usurioIdx],
  });
});

app.patch('/api/usuarios/:id', sanitizeUsuarioInput, (req, res) => {
  const usuarioId = usuarios.findIndex(
    (usuario) => usuario.id === req.params.id
  );

  if (usuarioId === -1) {
    res.status(404).send({ message: 'Usuario no encontrado' });
    return;
  }

  Object.assign(usuarios[usuarioId], req.body.sanitizedInput);

  res.status(200).send({
    message: 'Usuario modificado con écito',
    data: usuarios[usuarioId],
  });
  return;
});

app.delete('/api/usuarios/:id', (req, res) => {
  const usuarioId = usuarios.findIndex(
    (usuario) => usuario.id === req.params.id
  );

  if (usuarioId === -1) {
    res.status(404).send({ message: 'Usuario no encontrado' });
    return;
  } else {
    usuarios.splice(usuarioId, 1);
    res.status(200).send({ message: 'Usuario eliminado con éxito' });
  }
});

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/');
});
