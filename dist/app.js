import express from 'express';
import { usuario } from './usuarios.js';
const app = express();
app.use(express.json());
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000/');
});
const usuarios = [
    new usuario('jorgeusuario', '1234', 'jorge', 'perez', 'jorg@gmail.com', 15 / 11 / 1989)
];
//Se genera un ID nuevo cada vez que se actualiza cualquier cosa del servidor, ya que no hay consistencia de datos
app.get('/api/usuarios', (req, res) => {
    res.json(usuarios);
});
app.get('/api/usuarios/:id', (req, res) => {
    const usuario = usuarios.find((usuario) => usuario.id === req.params.id);
    if (!usuario) {
        res.status(404).send({ message: 'ID incorrecto, no existe ningun usuario con el ID indicado' });
    }
    res.json;
    {
        usuario;
    }
});
app.post('/api/usuarios', (req, res) => {
    const { nombre_usuario, contraseña, nombre, apellido, fecha_nacimiento, id } = req.body;
    const nuevoUsuario = new usuario(nombre_usuario, contraseña, nombre, apellido, fecha_nacimiento, id);
    usuarios.push(nuevoUsuario);
    res.status(201).send({ message: 'Usuario caragado correctamente', data: usuarios });
});
//# sourceMappingURL=app.js.map