 
const { API_URL } = require('../auth/constants');

async function loginUser(email, constrasena) {
  try {
    const response = await fetch(`${API_URL}/usuario/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        constrasena,
      }),
    });

    const json = await response.json();

    return { response, json, error: null };  
  } catch (error) {
    return { response: null, json: null, error: error.message || 'Error al conectar con el servidor' };
  }
}

export { loginUser };
