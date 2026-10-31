import { API_URL } from '../../../config/api';
import { supabase, SERVICIOS_IMAGENES_BUCKET } from '../../../config/supabase';

// El estado puede ser 'borrador' (todavia lo estoy armando), 'revision'
// (ya lo mande y espero que el admin lo revise) o 'publicado' (el admin lo aprobo)
export type EstadoServicio = 'borrador' | 'revision' | 'publicado';

export interface Servicio {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  estado: EstadoServicio;
  creadoEn?: string;
  categoria: {
    id: number;
    nombre: string;
  };
}

export interface ServicioPayload {
  nombre: string;
  descripcion?: string;
  imagen?: string;
  categoriaId: number;
  // La empresa solo puede mandar 'borrador' o 'revision', 'publicado' lo pone el admin
  estado?: 'borrador' | 'revision';
}

// Sube el archivo a Supabase Storage y devuelve la URL pública para guardar en `imagen`.
export const subirImagenServicioRequest = async (usuarioId: number, file: File): Promise<string> => {
  const extension = file.name.split('.').pop() ?? 'jpg';
  const path = `${usuarioId}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(SERVICIOS_IMAGENES_BUCKET)
    .upload(path, file, { upsert: false });

  if (error) {
    throw new Error(error.message || 'Error al subir la imagen');
  }

  const { data } = supabase.storage.from(SERVICIOS_IMAGENES_BUCKET).getPublicUrl(path);

  return data.publicUrl;
};


export const listServiciosRequest = async (usuarioId: number, token: string): Promise<Servicio[]> => {
  const response = await fetch(`${API_URL}/api/servicios?usuarioId=${usuarioId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al obtener los servicios');
  }

  return data.servicios;
};

export const createServicioRequest = async (usuarioId: number, payload: ServicioPayload, token: string): Promise<Servicio> => {
  const response = await fetch(`${API_URL}/api/servicios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ...payload, usuarioId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al crear el servicio');
  }

  return data.servicio;
};

export const updateServicioRequest = async (
  id: number,
  usuarioId: number,
  payload: {
    nombre?: string;
    descripcion?: string;
    imagen?: string;
    categoriaId?: number;
    estado?: 'borrador' | 'revision';
  },
  token: string
): Promise<Servicio> => {
  const response = await fetch(`${API_URL}/api/servicios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ...payload, usuarioId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al actualizar el servicio');
  }

  return data.servicio;
};

export const deleteServicioRequest = async (id: number, usuarioId: number, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/servicios/${id}?usuarioId=${usuarioId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Error al eliminar el servicio');
  }
};

export interface MercadoPagoCheckoutResponse {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint?: string;
}

// Crea la preferencia de pago para pasar al plan Pro. Le mandamos el origin
// (por ejemplo http://localhost:5173) para que el backend arme las urls de vuelta.
export const crearCheckoutPlanProRequest = async (
  usuarioId: number,
  token: string
): Promise<MercadoPagoCheckoutResponse> => {
  const response = await fetch(`${API_URL}/api/payment/plan-pro/preference`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ usuarioId, origin: window.location.origin })
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'No se pudo iniciar el pago del plan Pro');
  }

  if (
    !data ||
    typeof data.preferenceId !== 'string' ||
    typeof data.initPoint !== 'string' ||
    (data.sandboxInitPoint !== undefined && typeof data.sandboxInitPoint !== 'string')
  ) {
    throw new Error('Mercado Pago devolvió una respuesta inválida al iniciar el pago');
  }

  return {
    preferenceId: data.preferenceId,
    initPoint: data.initPoint,
    ...(data.sandboxInitPoint ? { sandboxInitPoint: data.sandboxInitPoint } : {})
  };
};

// Confirma el pago del plan Pro una vez que Mercado Pago nos redirige de vuelta
export const confirmarPlanProRequest = async (
  usuarioId: number,
  paymentId: string,
  token: string
): Promise<'pro'> => {
  const response = await fetch(`${API_URL}/api/payment/plan-pro/confirmar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ usuarioId, paymentId })
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'No se pudo confirmar el pago del plan Pro');
  }

  return 'pro';
};

// Trae el perfil del usuario logueado (lo usamos para saber si ya es plan Pro)
export const getUsuarioPlanRequest = async (usuarioId: number, token: string): Promise<'gratis' | 'pro'> => {
  const response = await fetch(`${API_URL}/api/usuarios/${usuarioId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al obtener el usuario');
  }

  return data.usuario.plan;
};
