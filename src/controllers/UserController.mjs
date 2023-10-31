import userModel from '../models/UserModel.mjs'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'



export const createUser = async (req, res) => {
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
        const accessToken = jwt.sign({
            _id: user._id,
            role: user.role
        }, process.env.JWT_SECRET);

        res.status(201).json({
            message: 'Usuario creado',
            accessToken
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al crear usuarios'
        });
    }
};

export const login = async (req, res) => {
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
                message: 'Credenciales inválidas'
            });
        }

        // Compara la contraseña ingresada con la contraseña almacenada en la base de datos
        const passwordMatch = await bcrypt.compare(password, user.password);

        // Si las contraseñas no coinciden, devuelve un error
        if (!passwordMatch) {
            return res.status(401).json({
                message: 'Credenciales inválidas'
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

export const getAll = async (req, res) => {
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

export const UpdateUser = async (req, res) => {
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
export const UpdateUserPassword = async (req, res) => {
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
        const password = hashPassword;

        // Actualizar usuario
        const updatedUser = await userModel.findByIdAndUpdate(userId, { password }, {
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


export const UpdateVendedor = async (req, res, next) => {
    try {
        const userId = req.userID;
        const role = 'seller';
        console.log(userId)
        // Verificar si el usuario existe
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'El usuario no existe'
            });
        }
        // Actualizar usuario
        await userModel.findByIdAndUpdate(userId, {
            role
        }, {
            new: true
        });
        //actualice al token
        const accessToken = jwt.sign({
            _id: user._id,
            role: user.role
        }, process.env.JWT_SECRET);

        res.status(201).json({
            message: 'Usuario creado',
            accessToken
        });
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al actualizar rol del usuario'
        });
    }
}

export const getUserByToken = async (req, res) => {
    if (req.headers && req.headers.authorization) {
        let authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, process.env.JWT_SECRET);
        } catch (e) {
            return res.status(401).json({ error: 'No autorizado!' });
        }
        let userId = decoded._id; // Obtener el id del usuario
        const user = await userModel.findById(userId); // Busca usuario por Id
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json({ data: user });
    } else {
        return res.status(401).json({ error: 'No autorizado!' });
    }
};

export const getUserRole = async (req, res) => {
    try {
        const userId = req.userID; // Obtener el id del usuario
        const user = await userModel.findById(userId); // Busca usuario por Id
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json({ data: user.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.userID; 

    // Verificar si el usuario existe
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'El usuario no existe' });
    }

    // Eliminar el usuario
    await userModel.findByIdAndRemove(userId);

    res.status(200).json({ message: 'Usuario eliminado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};

/* export default {
    createUser,
    login,
    getAll,
    UpdateUser,
    UpdateUserPassword,
    UpdateVendedor
}
 */
