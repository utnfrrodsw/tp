import { Request, Response } from "express"

export const register = (req: Request, res: Response) => {
    const { email, user, password } = req.body

    if (!email || !user || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' })
    }

    try {
        const response = {
            email,
            user,
            password
        }
        res.status(201).json({ message: 'Usuario registrado exitosamente.' });
        console.log({ response });

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor.', error })
    }
}


export const login = (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' })
    }

    try {
        const response = {
            email,
            password
        }
        res.status(201).json({ message: 'Usuario registrado exitosamente.' });
        console.log({ response });

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor.', error })
    }
}