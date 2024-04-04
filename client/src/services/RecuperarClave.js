import { fetchPost } from "../services/fetchIntercept.js";


export const recClave = async (email) => {
  try {
    const body = JSON.stringify({ email });
    const headers = { 'Content-Type': 'application/json' };
    const response = await fetchPost(`/usuario/reset-password/request`, body, headers);

    return response;

  } catch (error) {
    console.error('Error en recuperarClave:', error);
    return { error: 'Error making API request', originalError: error }; // Devuelve un objeto con el error
  }
};

export const resetRecPass = async (email, code, newPassword, confirmPassword) => {
  try {
    const body = JSON.stringify({ email, code, newPassword, confirmPassword });
    const headers = { 'Content-Type': 'application/json' };
    const response = await fetchPost(`/usuario/reset-password`, body, headers);
  
    return response;

  } catch (error) {
    console.error('Error en resetRecPass:', error);
    return { error: 'Error making API request', originalError: error }; // Devuelve un objeto con el error
  }
};
