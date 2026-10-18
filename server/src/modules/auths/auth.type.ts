import type { JwtPayload } from "jsonwebtoken";

export interface AccessTokenPayload extends JwtPayload {
    id: string;
    userName: string;
    rol: string;
}

export interface ResetPasswordPayload extends JwtPayload {
    id_user: string;
    userName: string;
}