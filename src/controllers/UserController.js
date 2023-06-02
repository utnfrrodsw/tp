import userModel from '../models/UserModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'



const createUser = async (req, res) => {
    const {
        email,
        password,
        telefono,
        direccion,
        role
    } = req.body;
    try {
        // Creacion de Usuario
        const user = new userModel({
            email,
            password,
            telefono,
            direccion,
            role,
        });
        await user.save();
        // Genera un token de sesión para el usuario
        const token = jwt.sign({
            _id: user._id,
            role: user.role
        }, process.env.JWT_SECRET);

        res.status(201).json({
            message: 'Usuario creado',
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al crear usuarios'
        });
    }
};

const login = async (req, res) => {
    const {
        email,
        password
    } = req.body;
    try {
        // Busca al usuario por su email
        const user = await userModel.findOne({
            email
        });

        // Si no se encuentra el usuario, devuelve un error
        if (!user) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        // Compara la contraseña ingresada con la contraseña almacenada en la base de datos
        const passwordMatch = await bcrypt.compare(password, user.password);

        // Si las contraseñas no coinciden, devuelve un error
        if (!passwordMatch) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }
        // Genera un token de sesión para el usuario
        const accessToken = jwt.sign({
            _id: user._id,
            role: user.role
        }, process.env.JWT_SECRET);

        res.status(200).json({
            message: 'Credenciales válidas',
            accessToken
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error del servidor'
        });
    }
};

const getAll = async (req, res) => {
    try {

        const filters = {};
        if (req.query.role) {
            filters.role = req.query.role;
        }
        let usuarios = await userModel.find(filters, req.query.fields)
            .sort({
                createdAt: -1
            })
            .exec();
        res.status(200).json({
            data: usuarios
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al obtener usuarios'
        });
    }
};

const UpdateUser = async (req, res) => {
    try {
        const userId = req.userID;
        const {
            email,
            telefono,
            direccion
        } = req.body;
        // Verificar si el usuario existe
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'El usuario no existe'
            });
        }

        // Actualizar usuario
        const updatedUser = await userModel.findByIdAndUpdate(userId, {
            email,
            telefono,
            direccion
        }, {
            new: true
        });

        res.status(200).json({
            message: 'Usuario actualizado',
            data: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al actualizar el usuario'
        });
    }
}
const UpdateUserPassword = async (req, res) => {
    try {
        const userId = req.userID;


        // Verificar si el usuario existe
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'El usuario no existe'
            });
        }
        // Hash password
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
        const updateData = hashPassword;

        // Actualizar usuario
        const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, {
            new: true
        });

        res.status(200).json({
            message: 'Password de Usuario actualizado',
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al actualizar password el usuario'
        });
    }
}
export default {
    createUser,
    login,
    getAll,
    UpdateUser,
    UpdateUserPassword
}