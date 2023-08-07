import { Usuario } from "../users/users.model"

export interface AuthModel {
  email: string
  password: string
}

export interface ResponseLogin {
  token: string
  status: number
  usuario: Usuario
  message: string
}
