import { Request, Response } from "express";
import { UsuarioRepository } from "../Usuario/Usuario.repository";
import { generateToken } from "../../middlewares/auth.utils";
import bcrypt from "bcrypt";

const repository = new UsuarioRepository();

export const iniciarSesion = async (req: Request, res: Response) => {
    const { email, contraseña } = req.body;

    try {
        // Buscar el usuario por su correo electrónico
        const usuario = await repository.findOneByEmail({ email });

        // Verificar si el usuario existe y tiene un _id
        if (!usuario || !usuario._id) {
            return res.status(401).send({ message: "Credenciales inválidas." });
        }

        // Comparar la contraseña proporcionada con el hash almacenado
        const esContraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!esContraseñaValida) {
            return res.status(401).send({ message: "Credenciales inválidas." });
        }

        // Generar el token JWT
        const token = generateToken({ id: usuario._id.toString(), tipo: usuario.tipo });

        // Enviar la respuesta con el token y los datos del usuario
        res.status(200).send({
            token,
            usuario: {
                id: usuario._id.toString(),
                nombre: usuario.nombre,
                email: usuario.email,
            },
        });
    } catch (error) {
        console.error("Error en iniciarSesion:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
};