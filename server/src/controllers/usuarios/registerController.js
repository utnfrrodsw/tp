import bcrypt from 'bcrypt'; // Importa la biblioteca bcrypt para hacer el hash de contraseñas
import { pool } from '../../db.js'; // Importa la instancia de la base de datos (pool)

export const registrarUsuario = async (req, res) => {
  const {
    name,
    lastName,
    email,
    password, // Contraseña en texto plano
    birthDate,
    phoneNumber,
    address,
    codPostal,
    tipo,
  } = req.body;

  try {
    // Verificar si el usuario ya existe en la base de datos (según el email)
    const [existingUser] = await pool.execute('SELECT * FROM USUARIO WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hacer el hash de la contraseña antes de almacenarla en la base de datos
    const saltRounds = 10; // Número de rondas de sal para la protección contra ataques de fuerza bruta
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash de la contraseña

    // Insertar el nuevo usuario en la base de datos con la contraseña hasheada
    await pool.execute(
      'INSERT INTO USUARIO (name, lastName, email, password, birthDate, phoneNumber, address, codPostal, tipo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, lastName, email, hashedPassword, birthDate, phoneNumber, address, codPostal, tipo]
    );

    res.status(201).json({ message: 'Registro exitoso' }); // Respuesta de éxito
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error en el registro' }); // Respuesta de error
  }
};
