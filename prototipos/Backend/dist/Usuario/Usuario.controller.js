import { UsuarioRepositoryImpl } from "./Usuario.repository.js";
import { Usuario } from "./Usuario.js";
import { ObjectId } from "mongodb";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const repository = new UsuarioRepositoryImpl();
async function sanitizeInput(req, res, next) {
    try {
        const requiredKeys = ['username', 'nombre', 'apellido', 'email', 'contraseña'];
        req.body.sanitizedInput = {};
        for (const key of requiredKeys) {
            if (req.body[key] === undefined) {
                return res.status(400).send({ message: `Campo '${key}' es requerido.` });
            }
            req.body.sanitizedInput[key] = req.body[key];
        }
        next();
    }
    catch (error) {
        console.error("Error en sanitizeInput:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function findAll(req, res) {
    try {
        res.json({ data: await repository.findAll() });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function findOne(req, res) {
    try {
        const id = req.params.id;
        const usuario = await repository.findOne({ id });
        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }
        return res.json({ data: usuario });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function add(req, res) {
    try {
        const input = req.body.sanitizedInput;
        const hashContraseña = await bcrypt.hash(input.contraseña, 10);
        const usuarioInput = new Usuario(input.username, input.nombre, input.apellido, input.email, input.direccion, input.localidad, input.avatar, input.tipo || 'usuario', hashContraseña, // Utilizar la contraseña cifrada
        []);
        const usuario = await repository.add(usuarioInput);
        res.status(201).send({ message: 'Usuario agregado con éxito.', data: usuario });
    }
    catch (error) {
        console.error("Error en add:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function update(req, res) {
    try {
        const usuarioId = req.params.id;
        const updatedData = req.body.sanitizedInput;
        // Verificar si el usuario existe antes de intentar actualizarlo
        const usuarioExiste = await repository.findOne({ id: usuarioId });
        // Check if the password is provided
        let hashContraseña;
        if (updatedData.contraseña) {
            const contraseñaSinHash = updatedData.contraseña;
            hashContraseña = await bcrypt.hash(contraseñaSinHash, 10);
        }
        const objectIdUsuarioId = new ObjectId(usuarioId);
        // Wait for bcrypt.hash to complete before creating Usuario instance
        const usuarioInput = new Usuario(updatedData.username, updatedData.nombre, updatedData.apellido, updatedData.email, updatedData.direccion, updatedData.localidad, updatedData.avatar, updatedData.tipo, hashContraseña || '', usuarioExiste ? usuarioExiste.tokens : []);
        if (!usuarioExiste) {
            // Si el usuario no existe, lo crea
            const nuevoUsuario = await repository.add(usuarioInput);
            if (!nuevoUsuario) {
                return res.status(500).send({ message: "Error al crear el nuevo usuario." });
            }
            return res.status(201).send({ message: 'Usuario creado con éxito.', data: nuevoUsuario });
        }
        // Si el usuario existe, lo actualiza
        const updatedUsuario = await repository.update(usuarioId, updatedData);
        if (!updatedUsuario) {
            return res.status(500).send({ message: "Error al actualizar el usuario." });
        }
        return res.status(200).send({ message: 'Usuario actualizado con éxito.', data: updatedUsuario });
    }
    catch (error) {
        console.error("Error en update:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function remove(req, res) {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') || '';
        if (!token) {
            return res.status(401).send({ message: 'No se proporcionó un token.' });
        }
        // Decodificar el token para obtener el userId
        const decoded = jwt.verify(token, 'secretKey');
        // Obtener el usuario por su ID desde la base de datos
        const usuarioCompleto = await repository.getById(decoded.userId);
        if (!usuarioCompleto) {
            return res.status(404).send({ message: 'Usuario no encontrado.' });
        }
        // Eliminar el usuario
        await repository.delete({ id: decoded.userId });
        res.status(204).send({ message: 'Usuario eliminado con éxito.' });
    }
    catch (error) {
        // Manejar errores, por ejemplo, token inválido, userId no válido, etc.
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).send({ message: 'El token ha expirado.' });
        }
        else {
            console.error('Error en remove:', error);
            res.status(500).send({ message: 'Error interno del servidor.' });
        }
    }
}
// OTROS MÉTODOS
async function findOneByEmail(req, res) {
    try {
        const email = req.params.email;
        const usuario = await repository.findOneByEmail({ email });
        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }
        return res.json({ data: usuario });
    }
    catch (error) {
        console.error("Error en findOneByEmail:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function iniciarSesion(req, res) {
    try {
        const { email, contraseña } = req.body;
        // Obtener el usuario por su correo electrónico desde la base de datos
        const usuarioCompleto = await repository.findOneByEmail({ email });
        if (!usuarioCompleto) {
            return res.status(401).send({ message: "Credenciales inválidas." });
        }
        // Comparar la contraseña proporcionada con el hash almacenado en la base de datos
        const esContraseñaValida = await bcrypt.compare(contraseña, usuarioCompleto.contraseña);
        if (!esContraseñaValida) {
            return res.status(401).send({ message: "Credenciales inválidas." });
        }
        // Limpiar los tokens expirados antes de generar un nuevo token
        usuarioCompleto.tokens = usuarioCompleto.tokens.filter(token => token.fechaExpiracion.getTime() > Date.now());
        // Generar un token JWT
        const token = jwt.sign({ userId: usuarioCompleto._id?.toString() }, 'secretKey', { expiresIn: '7d' });
        // Modificar solo las propiedades necesarias
        usuarioCompleto.tokens.push({ token, fechaExpiracion: new Date(Date.now() + 3600000) });
        // Actualizar el usuario en la base de datos
        await repository.update(usuarioCompleto._id?.toString() || '', usuarioCompleto);
        console.log('Token generado:', token);
        res.status(200).send({ message: "Inicio de sesión exitoso.", usuarioCompleto, token });
    }
    catch (error) {
        console.error("Error en iniciarSesion:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function cerrarSesion(req, res) {
    try {
        console.log('Cerrando sesión...');
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).send({ message: 'No se proporcionó un token.' });
        }
        const decoded = jwt.verify(token, 'secretKey');
        console.log('Token decodificado:', decoded);
        // Obtener el usuario por su ID desde la base de datos
        const usuarioCompleto = await repository.getById(decoded.userId);
        console.log('Usuario encontrado en la base de datos:', usuarioCompleto);
        if (!usuarioCompleto) {
            return res.status(401).send({ message: 'No se pudo encontrar el usuario asociado con el token proporcionado al cerrar la sesión.' });
        }
        // Verificar que el token proporcionado está en la lista de tokens del usuario
        const tokenIndex = usuarioCompleto.tokens.findIndex(t => t.token === token);
        if (tokenIndex === -1) {
            return res.status(401).send({ message: 'Token no válido para este usuario.' });
        }
        // Verificar si el token ha expirado
        if (usuarioCompleto.tokens[tokenIndex].fechaExpiracion.getTime() < Date.now()) {
            return res.status(401).send({ message: 'El token ha expirado.' });
        }
        // Eliminar el token de la lista de tokens del usuario
        usuarioCompleto.tokens.splice(tokenIndex, 1);
        // Actualizar el usuario en la base de datos
        await repository.update(usuarioCompleto._id?.toString() || '', usuarioCompleto);
        res.status(200).json({ message: 'Cierre de sesión exitoso.' });
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            // Token ha expirado
            res.status(401).send({ message: 'El token ha expirado.' });
        }
        else {
            console.error('Error en cerrarSesion:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
}
async function getByUsername(req, res) {
    try {
        const username = req.params.username;
        const usuario = await repository.getByUsername(username);
        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }
        return res.json({ data: usuario });
    }
    catch (error) {
        console.error("Error en getByUsername:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function getById(req, res) {
    try {
        const userId = req.params.userId;
        const usuario = await repository.getById(userId);
        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }
        return res.json({ data: usuario });
    }
    catch (error) {
        console.error("Error en getById:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function getIdUsuarioPorToken(req, res) {
    try {
        const token = req.params.token;
        if (!token) {
            return res.status(401).send({ message: "Token de autorización no proporcionado." });
        }
        // Obtener el usuario por su token
        const usuario = await repository.getByToken(token);
        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }
        res.json({ data: { userId: usuario._id?.toString() } });
    }
    catch (error) {
        console.error("Error en getIdUsuarioPorToken:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function checkToken(req, res, next) {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') || '';
        if (!token) {
            return res.status(401).send({ message: 'No se proporcionó un token.' });
        }
        // Decodificar el token para obtener el userId
        const decoded = jwt.verify(token, 'secretKey');
        // Obtener el usuario por su ID desde la base de datos
        const usuarioCompleto = await repository.getById(decoded.userId);
        if (!usuarioCompleto) {
            return res.status(404).send({ message: 'Usuario no encontrado.' });
        }
        // Verificar si el token ha expirado
        const tokenExpired = usuarioCompleto.tokens.some(t => t.token === token && t.fechaExpiracion.getTime() < Date.now());
        if (tokenExpired) {
            return res.status(401).send({ message: 'El token ha expirado.' });
        }
        // Si el token es válido, envía una respuesta exitosa al cliente
        return res.status(200).send({ message: 'Token válido.' });
    }
    catch (error) {
        // Manejar errores, por ejemplo, token inválido, userId no válido, etc.
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).send({ message: 'El token ha expirado.' });
        }
        else {
            console.error('Error en checkToken:', error);
            return res.status(500).send({ message: 'Error interno del servidor.' });
        }
    }
}
/*
REFRESH TOKEN POR MOTIVOS DE SEGURIDAD -> NO SE IMPLEMENTA PARA NO COMPLEJIZAR DEMASIADO LA APP

async function refreshToken(req: Request, res: Response) {
    try {
        const token = req.body.token;

        // Verificar si se proporcionó un token
        if (!token) {
            return res.status(401).send({ message: 'Token no proporcionado.' });
        }

        // Verificar el token y obtener el usuario asociado
        const usuario = await repository.getByToken(token);

        if (!usuario) {
            return res.status(401).send({ message: 'Token no válido.' });
        }

        // Verificar si el token ha expirado
        const tokenExpired = usuario.tokens.some(t => t.token === token && t.fechaExpiracion.getTime() < Date.now());

        if (tokenExpired) {
            return res.status(401).send({ message: 'Token ha expirado.' });
        }

        // Generar un nuevo token
        const newToken = jwt.sign({ userId: usuario._id?.toString() }, 'secretKey', { expiresIn: '7d' });

        // Actualizar el refresh token en la base de datos
        const updatedTokens: Token[] = usuario.tokens.map(t => (t.token === token ? { token: newToken, fechaExpiracion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } : t));

        // Actualizar otras propiedades del usuario si es necesario
        const updatedUsuario: Usuario = {
            ...usuario,
            tokens: updatedTokens,
        };

        await repository.update(usuario._id?.toString() || '', updatedUsuario);

        // Enviar el nuevo token al cliente
        res.json({ refreshToken: newToken });
    } catch (error) {
        console.error('Error en refreshToken:', error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
}
*/
/* GETTERS */
async function getNombre(req, res) {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).send({ message: 'No se proporcionó un token.' });
        }
        const decoded = jwt.verify(token, 'secretKey');
        const usuarioCompleto = await repository.getById(decoded.userId);
        if (!usuarioCompleto) {
            return res.status(401).send({ message: 'No se pudo encontrar el usuario asociado con el token proporcionado.' });
        }
        res.json({ data: { nombre: usuarioCompleto.nombre } });
    }
    catch (error) {
        console.error("Error en getNombre:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function getApellido(req, res) {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).send({ message: 'No se proporcionó un token.' });
        }
        const decoded = jwt.verify(token, 'secretKey');
        const usuarioCompleto = await repository.getById(decoded.userId);
        if (!usuarioCompleto) {
            return res.status(401).send({ message: 'No se pudo encontrar el usuario asociado con el token proporcionado.' });
        }
        res.json({ data: { apellido: usuarioCompleto.apellido } });
    }
    catch (error) {
        console.error("Error en getNombre:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function getEmail(req, res) {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).send({ message: 'No se proporcionó un token.' });
        }
        const decoded = jwt.verify(token, 'secretKey');
        const usuarioCompleto = await repository.getById(decoded.userId);
        if (!usuarioCompleto) {
            return res.status(401).send({ message: 'No se pudo encontrar el usuario asociado con el token proporcionado.' });
        }
        res.json({ data: { email: usuarioCompleto.email } });
    }
    catch (error) {
        console.error("Error en getNombre:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function getUsername(req, res) {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).send({ message: 'No se proporcionó un token.' });
        }
        const decoded = jwt.verify(token, 'secretKey');
        const usuarioCompleto = await repository.getById(decoded.userId);
        if (!usuarioCompleto) {
            return res.status(401).send({ message: 'No se pudo encontrar el usuario asociado con el token proporcionado.' });
        }
        res.json({ data: { username: usuarioCompleto.username } });
    }
    catch (error) {
        console.error("Error en getNombre:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
export { sanitizeInput, findAll, findOne, add, update, remove, iniciarSesion, getByUsername, findOneByEmail, cerrarSesion, getIdUsuarioPorToken, getById, /*refreshToken,*/ getNombre, getApellido, getEmail, getUsername, checkToken };
//# sourceMappingURL=Usuario.controller.js.map