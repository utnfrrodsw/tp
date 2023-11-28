
const { API_URL } = require('../auth/constants');

const recuperarClave = async (endpoint, method = 'POST', body = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const requestOptions = {
    method,
    headers,
  };

  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, requestOptions);
    const json = await response.json();

    return { response, json, error: null };
  } catch (error) {
    console.error('API request error:', error);
    return { response: null, json: null, error: 'Error making API request' };
  }
};

export default recuperarClave;
