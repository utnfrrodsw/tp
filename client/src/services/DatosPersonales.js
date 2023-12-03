const { API_URL } = require('../auth/constants');
const { fetchDelete } = require('./fetchIntercept.js');

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

export async function obtenerDatosPer({ idUser }) {
  try {
    const response = await fetch(`${API_URL}/usuario/obtenerDatosPersonales/${idUser}`, {
      method: 'GET',  
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Error al obtener datos personales del usuario');
    }
  } catch (error) {
    console.error('Error en obtenerDatosPer:', error);
    throw error;
  }
}

export async function modificarDatosPer(updatedData,idUser) {
     
    console.log('asds',idUser);
    try {
      const response = await fetch(`${API_URL}/usuario/modificarDatosPersonales/${idUser}`, {
        method: 'PUT',  
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Error al Modificar datos personales del usuario');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


export const fetchCerrarSesion = async (token) => {
  try{
    const response = await fetchDelete('/usuario/logout', token)
    .then(response => {
      return response
    })
    return response;
  }catch(error){
    throw new Error(error.messasge || 'Error al cerrar sesion');
  }
};