export interface UsuarioRequest {
    id?: number,
    nombre?: string,
    apellido?: string,
    email: string,
    direccion?: string,
    localidad?: string,
    avatar: string,
    tipo?: string
}