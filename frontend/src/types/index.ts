// src/types/index.ts

export const UsuarioRol = {
  USUARIO: 'usuario',
  ADMINISTRADOR: 'administrador'
} as const;
export type UsuarioRol = typeof UsuarioRol[keyof typeof UsuarioRol];

export const Talle = {
  XS: 'XS',
  S: 'S',
  M: 'M',
  L: 'L',
  XL: 'XL',
  XXL: 'XXL'
} as const;
export type Talle = typeof Talle[keyof typeof Talle];

export const CondicionCamiseta = {
  NUEVA: 'Nueva',
  USADA: 'Usada',
  VINTAGE: 'Vintage'
} as const;
export type CondicionCamiseta = typeof CondicionCamiseta[keyof typeof CondicionCamiseta];

export const EstadoCamiseta = {
  DISPONIBLE: 'disponible',
  VENDIDA: 'vendida',
  EN_SUBASTA: 'en_subasta',
  INACTIVA: 'inactiva'
} as const;
export type EstadoCamiseta = typeof EstadoCamiseta[keyof typeof EstadoCamiseta];

export const EstadoCompra = {
  PENDIENTE: 'pendiente',
  CONFIRMADA: 'confirmada',
  PAGADA: 'pagada',
  ENVIADA: 'enviada',
  ENTREGADA: 'entregada',
  CANCELADA: 'cancelada'
} as const;
export type EstadoCompra = typeof EstadoCompra[keyof typeof EstadoCompra];

export const EstadoPago = {
  PENDIENTE: 'pendiente',
  PROCESANDO: 'procesando',
  COMPLETADO: 'completado',
  FALLIDO: 'fallido',
  CANCELADO: 'cancelado'
} as const;
export type EstadoPago = typeof EstadoPago[keyof typeof EstadoPago];


// INTERFACES DEL BACKEND
export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  email_normalized: string;
  contrasena?: string;
  direccion: string;
  telefono: string;
  rol: UsuarioRol;
  activo: boolean;
  fechaRegistro: Date;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  activa: boolean;
}

export interface Camiseta {
  id: number;
  titulo: string;
  descripcion?: string;
  equipo: string;
  temporada: string;
  talle: Talle;
  condicion: CondicionCamiseta;
  imagen?: string;
  precioInicial: number;
  esSubasta: boolean;
  stock: number;
  estado: EstadoCamiseta;
  fechaCreacion: Date;
  fechaPublicacion: Date;
  vendedor: {
    id: number;
    nombre: string;
    apellido: string;
    email?: string;
    rol?: UsuarioRol;
  };
  categoria?: {
    id: number;
    nombre: string;
    descripcion?: string;
    activa?: boolean;
  };
  vendedorId?: number;
  categoriaId?: number;
  tieneDescuento?: boolean;
  descuentos?: Array<{
    id: number;
    codigo: string;
    porcentaje: number;
    descripcion: string;
  }>;
  precioOriginal?: number;
  precioConDescuento?: number;
  porcentajeTotal?: number;
}

export interface Subasta {
  id: number;
  fechaInicio: Date;
  fechaFin: Date;
  precioActual: number;
  activa: boolean;
  camiseta: Camiseta;
  ganador?: Usuario;
}

export interface Oferta {
  id: number;
  monto: number;
  fechaOferta: Date;
  activa: boolean;
  subasta: Subasta;
  usuario: Usuario;
}

export interface CompraItem {
  id: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  camiseta: Camiseta;
}

export interface Compra {
  id: number;
  total: number;
  estado: EstadoCompra;
  fechaCompra: Date;
  direccionEnvio?: string;
  notas?: string;
  comprador: Usuario;
  items?: CompraItem[]; 
  camiseta?: Camiseta; 
  metodoPago: MetodoPago;
}

export interface MetodoPago {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface Pago {
  id: number;
  monto: number;
  estado: EstadoPago;
  fechaPago: Date;
  numeroTransaccion?: string;
  notas?: string;
  compra: Compra;
  metodoPago: MetodoPago;
}


// RESPUESTAS DE API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  usuario: Usuario; 
  token: string;
}

// DATOS PARA FORMULARIOS
export interface LoginData {
  email: string;
  contrasena: string;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string;
  direccion: string;
  telefono: string;
  rol?: UsuarioRol;
}

export interface CreateCamisetaData {
  titulo: string;
  descripcion: string;
  equipo: string;
  temporada: string;
  talle: Talle;
  condicion: CondicionCamiseta;
  imagen: string;
  precioInicial: number;
  esSubasta?: boolean;
  categoriaId?: number;
}

export interface UpdateCamisetaData extends Partial<CreateCamisetaData> {
  id: number;
  estado?: EstadoCamiseta;
  stock?: number;
}

// FILTROS Y BÚSQUEDAS
export interface CamisetaFiltro {
  equipo?: string;
  temporada?: string;
  talle?: Talle;
  condicion?: CondicionCamiseta;
  estado?: EstadoCamiseta;
  precioMin?: string | number;
  precioMax?: string | number;
  esSubasta?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sort?: 'precioAsc' | 'precioDesc' | 'fechaAsc' | 'fechaDesc';
  usuarioId?: number; // Permite filtrar por usuario (vendedor)
  vendedorId?: number; 
  categoriaId?: number; 
}


// DASHBOARD Y ESTADÍSTICAS
export interface DashboardData {
  totalUsuarios: number;
  totalCamisetas: number;
  totalVentas: number;
  ventasMes: number;
  camisetasPorEstado?: {
    disponible: number;
    vendida: number;
    en_subasta: number;
    inactiva: number;
  };
  ventasPorMes?: Array<{
    mes: string;
    cantidad: number;
    total: number;
  }>;
}

// CARRITO DE COMPRAS
export interface CartItem {
  id: number;
  camiseta: Camiseta;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  count: number;
}

// TIPOS AUXILIARES
export type TalleType = Talle;
export type CondicionCamisetaType = CondicionCamiseta;
export type EstadoCamisetaType = EstadoCamiseta;
export type UsuarioRolType = UsuarioRol;
export type User = Usuario;


// Tipos para Subastas
export interface CreateSubastaData {
  camisetaId: number;
  precioInicial: number;
  fechaInicio: Date | string;
  fechaFin: Date | string;
}

export interface SubastaFiltro {
  activas?: boolean;
  vendedorId?: number;
  estado?: 'activa' | 'finalizada' | 'cancelada';
  camisetaId?: number;
}

export interface SubastaStats {
  tiempoRestante: {
    dias: number;
    horas: number;
    minutos: number;
    segundos: number;
    total: number;
  };
  finalizada: boolean;
  puedeOfertar: boolean;
}

// Tipos para Ofertas
export interface CreateOfertaData {
  subastaId: number;
  usuarioId: number;
  monto: number;
}

export const TipoAplicacionDescuento = {
  TODAS: 'TODAS',
  CATEGORIA: 'CATEGORIA',
  ESPECIFICAS: 'ESPECIFICAS'
} as const;
export type TipoAplicacionDescuento = typeof TipoAplicacionDescuento[keyof typeof TipoAplicacionDescuento];

export interface Descuento {
  id: number;
  codigo: string;
  descripcion: string;
  porcentaje: number;
  fechaInicio: Date | string;
  fechaFin: Date | string;
  activo: boolean;
  fechaCreacion: Date | string;
  tipoAplicacion: TipoAplicacionDescuento;
  categoriaId?: number;
  camisetasEspecificas?: Camiseta[];
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  activa: boolean;
}

export interface CamisetaSeleccion {
  id: number;
  titulo: string;
  equipo: string;
  temporada: string;
  precio: number;
  imagen?: string;
  categoria: {
    id: number;
    nombre: string;
  } | null;
}