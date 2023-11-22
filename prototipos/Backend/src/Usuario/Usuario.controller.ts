import { Request, Response, NextFunction } from "express";
import { UsuarioRepositoryImpl } from "./Usuario.repository.js";
import { Usuario, Token, TokenRevocado } from "./Usuario.js";
import { ObjectId } from "mongodb";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const repository = new UsuarioRepositoryImpl();

async function sanitizeInput(req: Request, res: Response, next: NextFunction) {
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
            []              // Inicializar tokensRevocados como un array vacío
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
        const usuarioId = req.params.id;
        const updatedData = req.body.sanitizedInput;

        // Verificar si el usuario existe antes de intentar actualizarlo
        const usuarioExiste = await repository.findOne({ id: usuarioId });

        // Check if the password is provided
        let hashContraseña: string | undefined;
        if (updatedData.contraseña) {
            const contraseñaSinHash = updatedData.contraseña;
            hashContraseña = await bcrypt.hash(contraseñaSinHash, 10);
        }

        const objectIdUsuarioId = new ObjectId(usuarioId);

        // Wait for bcrypt.hash to complete before creating Usuario instance
        const usuarioInput = new Usuario(
            updatedData.username,
            updatedData.nombre,
            updatedData.apellido,
            updatedData.email,
            updatedData.direccion,
            updatedData.localidad,
            updatedData.avatar,
            updatedData.tipo,
            hashContraseña || '',
            usuarioExiste ? usuarioExiste.tokens : [],                // Mantener tokens existentes
            usuarioExiste ? usuarioExiste.tokensRevocados : []         // Mantener tokensRevocados existentes
        );

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
        res.status(204).send({ message: 'Usuario eliminado con éxito.' });
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

        // Generar un token JWT
        const token = jwt.sign({ userId: usuarioCompleto._id?.toString() }, 'secretKey', { expiresIn: '1h' });

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
        const token = req.params.token;

        if (!token) {
            return res.status(401).send({ message: "Token de autorización no proporcionado." });
        }

        // Obtener el usuario por su token
        const usuario = await repository.findOne({ "tokens.token": token });

        if (!usuario) {
            return res.status(401).send({ message: "Usuario no encontrado." });
        }

        // Revocar el token guardándolo en la lista de tokens revocados
        usuario.tokensRevocados.push({ token, fechaRevocacion: new Date() });

        // Actualizar el usuario en la base de datos
        if (usuario._id) {
            const updatedUser = await repository.update(usuario._id.toString(), usuario);

            if (!updatedUser) {
                return res.status(500).send({ message: "Error al cerrar sesión: No se pudo actualizar el usuario." });
            }
        } else {
            return res.status(500).send({ message: "Error al cerrar sesión: ID de usuario no válido." });
        }

        console.log('Recibida solicitud de cierre de sesión');
        res.status(200).send({ message: "Sesión cerrada con éxito." });

    } catch (error) {
        console.error("Error en cerrarSesion:", error);
        res.status(500).send({ message: "Error interno del servidor." });
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


export { sanitizeInput, findAll, findOne, add, update, remove, iniciarSesion, getByUsername, findOneByEmail, cerrarSesion, getIdUsuarioPorToken, getById };
