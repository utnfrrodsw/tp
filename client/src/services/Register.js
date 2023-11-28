const { API_URL } = require('../auth/constants');

async function fetchWithTimeout(url, options, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const data = await response.json();

    return { response, data, error: null };
  } catch (error) {
    return { response: null, data: null, error: error.message || 'Error al conectar con el servidor' };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function registerUser({
  nombre,
  apellido,
  email,
  contrasena,
  confirmContrasena,
  telefono,
  fechaNacimiento,
  esPrestador,
  especialidades,
  direcciones,
}) {
  return fetchWithTimeout(`${API_URL}/usuario/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nombre,
      apellido,
      email,
      contrasena,
      confirmContrasena,
      telefono,
      fechaNacimiento,
      esPrestador,
      especialidades,
      direcciones,
    }),
  });
}
