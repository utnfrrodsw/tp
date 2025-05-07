// src/services/authService.ts
//import { getNewAccessToken } from '../Servicios/authService';  // Asegúrate que la ruta sea correcta
//export const getNewAccessToken = async (): Promise<string> => {
    //const refreshToken = localStorage.getItem('refreshToken');
    
    //if (!refreshToken) {
      //throw new Error('No refresh token disponible');
    //}
  
    //const response = await fetch('/api/refresh-token', {
      //method: 'POST',
      //headers: {
        //'Content-Type': 'application/json',
      //},
      //body: JSON.stringify({ refreshToken })
    //});
  
    //const data = await response.json();
    //if (response.ok) {
      //localStorage.setItem('accessToken', data.accessToken);
      //return data.accessToken;
    //} else {
      //throw new Error('Error al obtener el nuevo token');
    //}
  //};
  