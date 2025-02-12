import { Request, Response, NextFunction } from "express";
import { UsuarioRepository } from "./Usuario.repository.js";
import { Usuario } from "./Usuario.js";
import { ObjectId } from "mongodb";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const repository = new UsuarioRepository();

async function sanitizeInput(req: Request, res: Response, next: NextFunction) {
    try {
        const allowedKeys = ['username', 'nombre', 'apellido', 'email', 'contraseña', 'tipo', 'direccion', 'provincia'];

        req.body.sanitizedInput = {};

        for (const key of allowedKeys) {
            if (req.body[key] !== undefined) {
                req.body.sanitizedInput[key] = req.body[key];
            }
        }

        next();
    } catch (error) {
        console.error("Error en sanitizeInput:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function findAll(req: Request, res: Response) {
    try {
        res.json({ data: await repository.findAll() })
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const usuario = await repository.findOne({ id });
        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }
        return res.json({ data: usuario });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function add(req: Request, res: Response) {
    try {
        const input = req.body.sanitizedInput;

        const hashContraseña = await bcrypt.hash(input.contraseña, 10);

        const usuarioInput = new Usuario(
            input.username,
            input.nombre,
            input.apellido,
            input.email,
            input.direccion,
            input.localidad,
            input.avatar,
            input.tipo || 'usuario',
            hashContraseña,  // Utilizar la contraseña cifrada
            [],             // Inicializar tokens como un array vacío
        );
        const usuario = await repository.add(usuarioInput);
        res.status(201).send({ message: 'Usuario agregado con éxito.', data: usuario });
    } catch (error) {
        console.error("Error en add:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function update(req: Request, res: Response) {
    try {
        console.log('Entrando en update');
        const usuarioId = req.params.id;
        const updatedData: {
            username?: string;
            nombre?: string;
            apellido?: string;
            email?: string;
            direccion?: string;
            localidad?: ObjectId;
            avatar?: string;
            tipo?: string;
            contraseña?: string;
        } = req.body.sanitizedInput;

        console.log('Valor del nombre antes de la actualización:', updatedData.nombre);


        // Verificar si el usuario existe antes de intentar actualizarlo
        const usuarioExiste = await repository.findOne({ _id: new ObjectId(usuarioId) });

        if (!usuarioExiste) {
            return res.status(404).send({ message: 'Usuario no encontrado.' });
        }

        // Comprueba si la contraseña es provista
        let hashContraseña: string | undefined;
        if (updatedData.contraseña) {
            const contraseñaSinHash = updatedData.contraseña;
            hashContraseña = await bcrypt.hash(contraseñaSinHash, 10);
        }

        const usuarioInput = new Usuario(
            updatedData.username || usuarioExiste.username,
            updatedData.nombre || usuarioExiste.nombre,
            updatedData.apellido || usuarioExiste.apellido,
            updatedData.email || usuarioExiste.email,
            updatedData.direccion || usuarioExiste.direccion,
            updatedData.localidad || usuarioExiste.localidad,
            updatedData.avatar || usuarioExiste.avatar,
            updatedData.tipo || usuarioExiste.tipo,
            hashContraseña || usuarioExiste.contraseña,
            usuarioExiste.tokens || [],
            new ObjectId(usuarioId)
        );

        console.log('usuarioInput antes de la actualización:', usuarioInput);

        // Actualizar el usuario en la base de datos
        const updatedUsuario = await repository.update(usuarioId, usuarioInput);

        if (!updatedUsuario) {
            return res.status(500).send({ message: "Error al actualizar el usuario." });
        }

        console.log('Usuario actualizado con éxito:', updatedUsuario);

        return res.status(200).send({ message: 'Usuario actualizado con éxito.', data: updatedUsuario });

    } catch (error) {
        console.error("Error en update:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const usuario = await repository.delete({ id });
        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }
        return res.status(204).send({ message: 'Usuario eliminado con éxito.' });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

// OTROS MÉTODOS

async function findOneByEmail(req: Request, res: Response) {
    try {
        const email = req.params.email;

        const usuario = await repository.findOneByEmail({ email });

        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }

        return res.json({ data: usuario });
    } catch (error) {
        console.error("Error en findOneByEmail:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function iniciarSesion(req: Request, res: Response) {
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

    } catch (error) {
        console.error("Error en iniciarSesion:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function cerrarSesion(req: Request, res: Response) {
    try {
        console.log('Cerrando sesión...');
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).send({ message: 'No se proporcionó un token.' });
        }

        const decoded = jwt.verify(token, 'secretKey') as { userId: string };
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

    } catch (error: any) {
        if (error instanceof jwt.TokenExpiredError) {
            // Token ha expirado
            res.status(401).send({ message: 'El token ha expirado.' });
        } else {
            console.error('Error en cerrarSesion:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
}

async function getByUsername(req: Request, res: Response) {
    try {
        const username = req.params.username;
        const usuario = await repository.getByUsername(username);

        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }

        return res.json({ data: usuario });
    } catch (error) {
        console.error("Error en getByUsername:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function getById(req: Request, res: Response) {
    try {
        const userId = req.params.userId;
        const usuario = await repository.getById(userId);

        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }

        return res.json({ data: usuario });
    } catch (error) {
        console.error("Error en getById:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function getIdUsuarioPorToken(req: Request, res: Response) {
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
    } catch (error) {
        console.error("Error en getIdUsuarioPorToken:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function checkToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') || '';

        if (!token) {
            return res.status(401).send({ message: 'No se proporcionó un token.' });
        }

        // Decodificar el token para obtener el userId
        const decoded = jwt.verify(token, 'secretKey') as { userId: string };

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

    } catch (error) {
        // Manejar errores, por ejemplo, token inválido, userId no válido, etc.
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).send({ message: 'El token ha expirado.' });
        } else {
            console.error('Error en checkToken:', error);
            return res.status(500).send({ message: 'Error interno del servidor.' });
        }
    }
}

// Requiere token
async function eliminarCuenta(req: Request, res: Response) {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') || '';

        if (!token) {
            return res.status(401).send({ message: 'No se proporcionó un token.' });
        }

        // Decodificar el token para obtener el userId
        const decoded = jwt.verify(token, 'secretKey') as { userId: string };

        // Obtener el usuario por su ID desde la base de datos
        const usuarioCompleto = await repository.getById(decoded.userId);

        if (!usuarioCompleto) {
            return res.status(404).send({ message: 'Usuario no encontrado.' });
        }

        // Eliminar el usuario
        await repository.delete({ id: decoded.userId });

        res.status(204).send({ message: 'Usuario eliminado con éxito.' });
    } catch (error) {
        // Manejar errores, por ejemplo, token inválido, userId no válido, etc.
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).send({ message: 'El token ha expirado.' });
        } else {
            console.error('Error en remove:', error);
            res.status(500).send({ message: 'Error interno del servidor.' });
        }
    }
}

/* GETTERS CON PERMISOS (TOKEN ASOCIADO) */

async function getNombre(req: Request, res: Response) {
    try {

        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).send({ message: 'No se proporcionó un token.' });
        }

        const decoded = jwt.verify(token, 'secretKey') as { userId: string };

        const usuarioCompleto = await repository.getById(decoded.userId);

        if (!usuarioCompleto) {
            return res.status(401).send({ message: 'No se pudo encontrar el usuario asociado con el token proporcionado.' });
        }

        res.json({ data: { nombre: usuarioCompleto.nombre } });
    } catch (error) {
        console.error("Error en getNombre:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function getApellido(req: Request, res: Response) {
    try {

        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).send({ message: 'No se proporcionó un token.' });
        }

        const decoded = jwt.verify(token, 'secretKey') as { userId: string };

        const usuarioCompleto = await repository.getById(decoded.userId);

        if (!usuarioCompleto) {
            return res.status(401).send({ message: 'No se pudo encontrar el usuario asociado con el token proporcionado.' });
        }

        res.json({ data: { apellido: usuarioCompleto.apellido } });
    } catch (error) {
        console.error("Error en getNombre:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function getEmail(req: Request, res: Response) {
    try {

        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).send({ message: 'No se proporcionó un token.' });
        }

        const decoded = jwt.verify(token, 'secretKey') as { userId: string };

        const usuarioCompleto = await repository.getById(decoded.userId);

        if (!usuarioCompleto) {
            return res.status(401).send({ message: 'No se pudo encontrar el usuario asociado con el token proporcionado.' });
        }

        res.json({ data: { email: usuarioCompleto.email } });
    } catch (error) {
        console.error("Error en getNombre:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function getUsername(req: Request, res: Response) {
    try {

        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).send({ message: 'No se proporcionó un token.' });
        }

        const decoded = jwt.verify(token, 'secretKey') as { userId: string };

        const usuarioCompleto = await repository.getById(decoded.userId);

        if (!usuarioCompleto) {
            return res.status(401).send({ message: 'No se pudo encontrar el usuario asociado con el token proporcionado.' });
        }

        res.json({ data: { username: usuarioCompleto.username } });
    } catch (error) {
        console.error("Error en getNombre:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function getTipo(req: Request, res: Response) {
    try {
        const userId = req.body.userId; // ID del usuario extraído del token
        const usuario = await repository.findOne({ _id: new ObjectId(userId) });
        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }
        return res.json({ data: { tipo: usuario.tipo } });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function getDireccion(req: Request, res: Response) {
    try {

        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).send({ message: 'No se proporcionó un token.' });
        }

        const decoded = jwt.verify(token, 'secretKey') as { userId: string };

        const usuarioCompleto = await repository.getById(decoded.userId);

        if (!usuarioCompleto) {
            return res.status(401).send({ message: 'No se pudo encontrar el usuario asociado con el token proporcionado.' });
        }

        res.json({ data: { direccion: usuarioCompleto.direccion } });
    } catch (error) {
        console.error("Error en getDireccion:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

/* GETTERS */

async function getUsernameById(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const usuario = await repository.getById(id);

        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }

        res.json({ data: usuario.username });
    } catch (error) {
        console.error("Error en getUsernameById:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}


async function getNombreById(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const usuario = await repository.getById(id);

        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }

        res.json({ data: usuario.nombre });
    } catch (error) {
        console.error("Error en getNombreById:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}


async function getApellidoById(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const usuario = await repository.getById(id);

        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }

        res.json({ data: usuario.apellido });
    } catch (error) {
        console.error("Error en getApellidoById:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}


async function getEmailById(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const usuario = await repository.getById(id);

        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }

        res.json({ data: usuario.email });
    } catch (error) {
        console.error("Error en getEmailById:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}


async function getAvatarById(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const usuario = await repository.getById(id);

        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }

        res.json({ data: usuario.avatar });
    } catch (error) {
        console.error("Error en getAvatarById:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}


async function getTipoById(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const usuario = await repository.getById(id);

        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }

        res.json({ data: usuario.tipo });
    } catch (error) {
        console.error("Error en getTipoById:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function getUsuarios(req: Request, res: Response) {
    try {
        const usuarios = await repository.findAll();
        const usuarioIds = usuarios?.map((usuario) => usuario._id);
        res.json({ data: usuarioIds });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

/* SETTERS */

async function setNombre(req: Request, res: Response) {
    console.log('Entrando en setNombre');
    await updateUserAttribute(req, res, 'nombre');
}

async function setApellido(req: Request, res: Response) {
    await updateUserAttribute(req, res, 'apellido');
}

async function setEmail(req: Request, res: Response) {
    await updateUserAttribute(req, res, 'email');
}

async function setUsername(req: Request, res: Response) {
    await updateUserAttribute(req, res, 'username');
}

async function setDireccion(req: Request, res: Response) {
    await updateUserAttribute(req, res, 'direccion');
}

async function setProvincia(req: Request, res: Response) {
    await updateUserAttribute(req, res, 'provincia');
}

async function updateUserAttribute(req: Request, res: Response, attribute: string) {
    try {
        console.log('Entrando en updateUserAttribute');

        // Verifica si req.body tiene el formato correcto y contiene el atributo específico
        const updatedData = req.body.sanitizedInput || {};

        if (!updatedData || typeof updatedData !== 'object' || !updatedData.hasOwnProperty(attribute)) {
            console.log('Datos de actualización no válidos:', updatedData);
            return res.status(400).send({ message: 'Datos de actualización no válidos.' });
        }

        // Obtener el token y decodificarlo para obtener el userId
        const token = req.header('Authorization')?.replace('Bearer ', '') || '';
        const decoded = jwt.verify(token, 'secretKey') as { userId: string };

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

        // Actualizar el atributo específico del usuario
        console.log(`Antes de la actualización - Valor actualizado para ${attribute}:`, updatedData[attribute]);

        // Actualizar el atributo específico del usuario
        const updatedUsuarioResult = await repository.updateAttribute(
            usuarioCompleto._id?.toString() || '',
            attribute,
            updatedData[attribute]
        );

        console.log(`Después de la actualización - Valor actualizado para ${attribute}:`, updatedUsuarioResult);

        if (!updatedUsuarioResult) {
            return res.status(500).send({ message: "Error al actualizar el usuario." });
        }

        return res.status(200).send({ message: `Atributo '${attribute}' actualizado con éxito.`, data: updatedUsuarioResult });
    } catch (error) {
        console.error(`Error en update${attribute}:`, error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

// ADMIN

async function setTipo(req: Request, res: Response) {
    try {
        // Verifica si req.body tiene el formato correcto y contiene el atributo específico
        const updatedData = req.body.sanitizedInput || {};

        if (!updatedData || typeof updatedData !== 'object' || !updatedData.hasOwnProperty('tipo')) {
            console.log('Datos de actualización no válidos:', updatedData);
            return res.status(400).send({ message: 'Datos de actualización no válidos.' });
        }

        // Obtener el usuario por su ID desde la base de datos
        const usuarioId = req.params.id;
        const usuarioCompleto = await repository.getById(usuarioId);

        if (!usuarioCompleto) {
            return res.status(404).send({ message: 'Usuario no encontrado.' });
        }

        // Actualizar el atributo 'tipo' del usuario
        const updatedUsuarioResult = await repository.updateAttribute(
            usuarioCompleto._id?.toString() || '',
            'tipo',
            updatedData.tipo
        );

        if (!updatedUsuarioResult) {
            return res.status(500).send({ message: "Error al actualizar el usuario." });
        }

        return res.status(200).send({ message: "Atributo 'tipo' actualizado con éxito.", data: updatedUsuarioResult });
    } catch (error) {
        console.error("Error en setTipo:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}


export { sanitizeInput, findAll, findOne, add, update, remove, iniciarSesion, getByUsername, findOneByEmail, cerrarSesion, getIdUsuarioPorToken, getById, getNombre, getApellido, getEmail, getUsername, getTipo, checkToken, updateUserAttribute, setNombre, setApellido, setEmail, setUsername, setTipo, getUsernameById, getNombreById, getApellidoById, getEmailById, getAvatarById, getTipoById, getUsuarios, eliminarCuenta, setDireccion, getDireccion, setProvincia };
