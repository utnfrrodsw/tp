import { Request, Response, } from 'express';
import { persona } from '../personas/personas.entity.js';
import { orm } from '../shared/db/orm.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from '@mikro-orm/mongodb';
import { TOKEN_SECRET } from './jwd.js';

const em = orm.em;

// Función de login
async function login(req: Request, res: Response ) {
  try {
    const { email, password } = req.body;
    
    // Buscar persona por email - sin populate para obtener el password
    const userFound = await em.findOne(persona, { email });
    
    if (!userFound) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Debug: Verificar que el password esté presente
    console.log('Password presente:', !!userFound.password);
    console.log('Password length:', userFound.password ? userFound.password.length : 0);
    
    if (!userFound.password) {
      console.error('ERROR: Password es undefined para el usuario:', email);
      return res.status(500).json({ message: 'Error: Password no encontrado en la base de datos' });
    }

    // Verificar password
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    // Crear token
    const token = jwt.sign(
      { id: userFound._id, email: userFound.email }, 
      TOKEN_SECRET, 
      { expiresIn: '1d' }
    );
    
    // Guardar token en cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // cambiar a true en producción con HTTPS
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 día
    });
    
    // Respuesta exitosa
    res.status(200).json({ 
      message: 'Login exitoso', 
      token,
      user: {
        id: userFound._id,
        email: userFound.email,
        name: userFound.name,
        wallet: userFound.wallets
      }
    });
    
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

function logout(req: Request, res: Response) {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });

return res.status(200).json({ message: 'Logout exitoso', date: new Date() });
}


async function profile(req: Request, res: Response) {
  try {
    // Obtener el ID del usuario desde el token decodificado
    const userId = req.decoded?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }
    
    // Buscar el usuario en la base de datos
    const userFound = await em.findOne(persona, { _id: new ObjectId(userId) }, {
      populate: ['wallets', 'localidad']
    });
    
    if (!userFound) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Retornar perfil sin el password
    res.status(200).json({ 
      message: 'Perfil de usuario',
      id: userFound._id,
      email: userFound.email,
      name: userFound.name,
      apellido: userFound.apellido,
      wallets: userFound.wallets
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
export { login, logout, profile };

