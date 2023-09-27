import bcrypt from 'bcrypt'; // Importa la biblioteca bcrypt para comparar contraseñas
import jwt from 'jsonwebtoken'; // Importa la biblioteca jsonwebtoken para crear tokens de autenticación
import { pool } from '../../db.js'; // Importa la instancia de la base de datos (pool)

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
    const token = jwt.sign({ userId: user.id, email: user.email }, 'tu_secreto_secreto', {
      expiresIn: '1h', // Puedes ajustar la duración del token según tus necesidades
    });

    res.status(200).json({ message: 'Inicio de sesión exitoso', token: token, userType: user.tipo });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({ message: 'Error en el inicio de sesión' });
  }
};
