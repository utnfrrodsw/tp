export const validateRegistro = (req, res, next) => {
    const {
      name,
      lastName,
      email,
      password,
      birthDate,
      phoneNumber,
      address,
      codPostal,
      tipo,
    } = req.body;
  
    if (!name || !lastName || !email || !password || !birthDate || !phoneNumber || !address || !codPostal || !tipo) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
  
    // Validaciones adicionales
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'El correo electrónico proporcionado no es válido' });
    }
  
    if (!isValidPhoneNumber(phoneNumber)) {
      return res.status(400).json({ message: 'El número de teléfono proporcionado no es válido' });
    }
  
    // Puedes agregar más validaciones según tus necesidades aquí.
  
    next();
  };
  
  // Función para validar un correo electrónico
  function isValidEmail(email) {
    // Utiliza una expresión regular para validar el formato del correo electrónico
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailRegex.test(email);
  }
  
  // Función para validar un número de teléfono
  function isValidPhoneNumber(phoneNumber) {
    // Usar una expresión regular o cualquier otro método para validar el formato del número de teléfono
    // Por ejemplo, se puede verificar que solo contenga números y tenga una longitud válida.
    // Aca, un ejemplo simple solo verifica que el número contenga al menos 9 dígitos.
    return /^\d{9,}$/.test(phoneNumber);
  }
  