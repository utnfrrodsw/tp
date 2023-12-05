import { fetchGet, fetchPost, fetchDelete, fetchPut, fetchPatch } from "./fetchIntercept";

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

export const fetchCambiarContrasena = async (idUsuario, nuevaContrasena, confirmNuevaContrasena) => {
  try {
    const body = JSON.stringify({
      idUsuario: idUsuario,
      newPassword: nuevaContrasena,
      confirmPassword: confirmNuevaContrasena,
    });
    const headers = { 'Content-Type': 'application/json' };
    const response = await fetchPost(`/usuario/change-password`, body, headers)
    .then(response => {
      return response
    });
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

export const fetchSetFotoPerfil = async (idUsuario, file) => {
  try {
    const response = await fetchPut(`/usuario/cargarFotoPerfil/${idUsuario}`, file)
    .then(response => {
      return response
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  } 
}

export const fetchDeleteProfesion = async (idUsuario, idProfesion, token) => {
  try {
    const response = await fetchDelete(`/usuario/eliminarProfesionUsuario/${idUsuario}/${idProfesion}`, token)
    .then(response => {
      return response
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchVerificarPassword = async (idUsuario, currentPassword) => {
  try {
    const body = JSON.stringify({ idUsuario: idUsuario, currentPassword: currentPassword });
    const headers = { 'Content-Type': 'application/json' };
    const response = await fetchPost(`/usuario/verify-password`, body, headers)
    .then(response => {
      return response
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function modificarDatosPer(updatedData,idUser, token) {
  try {
    const body = JSON.stringify(updatedData);
    const response = await fetchPatch(`/usuario/modificarDatosPersonales/${idUser}`, body, token)
    .then(response => {
      return response
    });
    return response;
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
 
