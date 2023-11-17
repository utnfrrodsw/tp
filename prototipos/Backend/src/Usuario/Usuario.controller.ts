import { Request, Response, NextFunction } from "express"
import { UsuarioRepository } from "./Usuario.repository.js"
import { Usuario } from "./Usuario.js"
import { ObjectId } from "mongodb";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const repository = new UsuarioRepository()

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
        const id = req.params.id
        const usuario = await repository.findOne({ id })
        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." })
        }
        return res.json({ data: usuario })
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function add(req: Request, res: Response) {
    try {
        const input = req.body.sanitizedInput;

        console.log('Antes de generar hash de contraseña');
        // Generar un hash de la contraseña antes de almacenarla en la base de datos
        const hashContraseña = await bcrypt.hash(input.contraseña, 10);
        console.log('Después de generar hash de contraseña');

        console.log('Antes de crear instancia de Usuario');
        // Crear una instancia de Usuario con la contraseña cifrada
        const usuarioInput = new Usuario(
            input.username,
            input.nombre,
            input.apellido,
            input.email,
            input.direccion,
            input.localidad,
            input.avatar,
            input.tipo || 'usuario',
            hashContraseña  // Utilizar la contraseña cifrada
        );
        console.log('Después de crear instancia de Usuario');

        console.log('Antes de agregar usuario a la base de datos');
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
            objectIdUsuarioId
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
        const id = req.params.id
        const usuario = await repository.delete({ id })
        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." })
        }
        res.status(204).send({ message: 'Usuario eliminado con éxito.' })
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
        const usuario = await repository.findOneByEmail({ email });

        if (!usuario) {
            return res.status(401).send({ message: "Credenciales inválidas." });
        }

        // Comparar la contraseña proporcionada con el hash almacenado en la base de datos
        const esContraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);

        if (!esContraseñaValida) {
            return res.status(401).send({ message: "Credenciales inválidas." });
        }

        // Generar un token JWT
        const token = jwt.sign({ userId: usuario._id }, 'secretKey', { expiresIn: '1h' });

        res.status(200).send({ message: "Inicio de sesión exitoso.", data: { usuario, token } });
    } catch (error) {
        console.error("Error en iniciarSesion:", error);
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


export { sanitizeInput, findAll, findOne, add, update, remove, iniciarSesion, getByUsername, findOneByEmail }