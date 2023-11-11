 
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Registra el error en la consola para fines de depuración.
  
  let errorMessage = 'Algo salió mal en el servidor';

  if (err instanceof MyCustomException) {
    // Maneja una excepción personalizada de manera específica
    errorMessage = 'Ocurrió un error: ' + err.message;
  }
  
  res.status(500).json({ message: errorMessage });
};

module.exports = errorHandler;