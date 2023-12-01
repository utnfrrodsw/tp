
import { fetchPost } from "../services/fetchIntercept.js";

export const registerUser  = async (nombre, apellido, email, contrasena, confirmContrasena, telefono,
  fechaNacimiento, esPrestador, especialidades, direcciones) => {
  try {
    const body = JSON.stringify({ nombre, apellido,email, contrasena, confirmContrasena, telefono,
      fechaNacimiento, esPrestador, especialidades, direcciones});
    const headers = { 'Content-Type': 'application/json' };
    const response = await fetchPost(`/usuario/register`, body, headers);

      return response;  
 
  } catch (error) {
    throw new Error(error.message);
  }
};
