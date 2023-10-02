import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TOKEN } from '../../config.js';
import { pool } from '../../db.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario en la base de datos por su correo electrónico
    const [rows] = await pool.execute('SELECT * FROM USUARIO WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const user = rows[0];

    // Comparar la contraseña proporcionada con la contraseña almacenada en la base de datos
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Si el usuario y la contraseña son correctos, puedes generar un token de autenticación.
    const token = jwt.sign({ userId: user.id, email: user.email }, TOKEN, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Inicio de sesión exitoso', token: token, userType: user.tipo });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({ message: 'Error en el inicio de sesión' });
  }
};
