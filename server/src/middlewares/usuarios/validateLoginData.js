 

const validateLoginData = (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'El campo de correo electrónico no puede estar vacío' });
  } else if (!password) {
    return res.status(400).json({ message: 'El campo de contraseña no puede estar vacío' });
  } else if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Escribe una dirección de correo electrónico válida' });
  }
  
  // Definición de la función isValidEmail
  function isValidEmail(email) {
    // Utiliza una expresión regular para validar el formato del correo electrónico
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailRegex.test(email);
  }
  
  // Si las validaciones pasan, llama a next() para pasar al siguiente middleware o controlador.
  next();
  
};
  
module.exports = validateLoginData;