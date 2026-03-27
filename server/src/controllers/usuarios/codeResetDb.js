const db = require('../../models');

// Función para almacenar el código de recuperación en la base de datos
const storeResetCodeInDatabase = async (email, resetCode) => {
    try {
      // Encuentra al usuario por su correo electrónico
      const user = await db.Usuario.findOne({ where: { email } });
  
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
  
      // Calcula la fecha de expiración (por ejemplo, 1 hora desde ahora)
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 1); // Ajusta la expiración según tus necesidades
  
      // Crea un nuevo registro en la tabla ResetCode
      await db.ResetCode.create({
        code: resetCode,
        expiresAt: expirationDate, // Usa el nombre correcto del campo (expiresAt) según tu modelo
        userId: user.idUsuario, // Usa el nombre correcto del campo (userId) según tu modelo
      });
  
      return true;
    } catch (error) {
      console.error('Error al guardar el código de recuperación:', error);
      return false;
    }
  };
  
  module.exports = { storeResetCodeInDatabase };
  