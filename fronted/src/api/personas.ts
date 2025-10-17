import axios from 'axios'
import { z } from 'zod'
import { registroSchema } from '../../../src/schema/personas.validator'

const API = 'http://localhost:3000';

// Tipo inferido del schema de validación del backend
type RegisterPersonaData = z.infer<typeof registroSchema>;

// Tipo para Localidad
export interface Localidad {
  _id: string;
  id?: string;
  nombre_localidad: string;
  pais: string;
}

// La ruta correcta es /api/personas/ (sin /register)
const registerPersona = (user: RegisterPersonaData) => axios.post(`${API}/api/personas`, user);
const loginRequest = (user: { email: string; password: string }) => axios.post(`${API}/api/auth/login`, user);

// Obtener todas las localidades
const getLocalidades = async (): Promise<Localidad[]> => {
  const response = await axios.get(`${API}/api/localidades`);
  return response.data.data || [];
};

export { registerPersona, loginRequest, getLocalidades };

