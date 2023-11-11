
const authUserRegister = (req, res, next) => {
    // Aquí puedes verificar si el usuario está autenticado, por ejemplo, mediante un token.
  
    // Si el usuario no está autenticado, puedes enviar una respuesta de error (res.status(401).json(...)).
    // Si el usuario está autenticado, llama a next() para continuar con el siguiente middleware o el controlador.
  
    // Ejemplo:
    /*
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Acceso no autorizado' });
    }
    */
    next();
  };
  
  module.exports = authUserRegister;