const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next(); // El usuario es admin
    } else {
      res.status(403).json({ message: 'Acceso denegado. Requiere privilegios de administrador.' });
    }
  };
  
  module.exports = isAdmin;
  