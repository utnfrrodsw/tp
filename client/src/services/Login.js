import { fetchPost } from "../services/fetchIntercept.js";

export const loginUser = async (email, constrasena) => {
  try {
    const body = JSON.stringify({ email, constrasena });
    const headers = { 'Content-Type': 'application/json' };
    const response = await fetchPost(`/usuario/login`, body, headers);

      return response;  

  } catch (error) {
    throw new Error(error.message);
  }
};
