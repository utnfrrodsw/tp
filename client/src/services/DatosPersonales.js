import { fetchGet, fetchPost, fetchDelete } from "./fetchIntercept";
const { API_URL } = require('../auth/constants');

export const getDatosPersonales = async (id) => {
  try {
    const data = await fetchGet(`/usuario/obtenerDatosPersonales/${id}`)
    .then(response => {
      return response
    });
    
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getDirecciones = async (id) => {
  try {
    const data = await fetchGet(`/direccion/cliente/${id}`);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getProfesiones = async (id) => {
  try {
    const data = await fetchGet(`/usuario/obtenerProfesionesUsuario/${id}`);
    
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};


export const agregarProfesion  = async (idUsuario, profesion) => {
  try {
    const body = JSON.stringify({ idUsuario, profesiones: [profesion] });
    const headers = { 'Content-Type': 'application/json' };
    const response = await fetchPost(`/usuario/agregarProfesionesUsuario/${idUsuario}`, body, headers);
     
    return response;  
  } catch (error) {
    throw new Error(error.message);
  }
};

export const verificarClave  = async (idUsuario, currentPassword) => {
  try {
     
    const body = JSON.stringify({ idUsuario, currentPassword });
    const headers = { 'Content-Type': 'application/json' };
    const response = await fetchPost(`/usuario/usuario/verify-password`, body, headers);
  
    return response;

  } catch (error) {
    throw new Error(error.message);
  }
};

export const cambiarClave  = async (idUsuario, nuevaContrasena, confirmNuevaContrasena) => {
  try {
 
    const body = JSON.stringify({ idUsuario, nuevaContrasena , confirmNuevaContrasena});
    const headers = { 'Content-Type': 'application/json' };
    const response = await fetchPost(`/usuario/change-password`, body, headers);
  
    return response;
    
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchFotoPerfil = async (idUsuario) => {
  try {
    const response = await fetchGet(`/usuario/obtenerFotoPerfil/${idUsuario}`)
    .then(response => {
      return response
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export async function modificarDatosPer(updatedData,idUser) {
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
  }catch (error) {
    throw new Error(error.message);
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
 
