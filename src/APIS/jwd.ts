import jwt from "jsonwebtoken";

const TOKEN_SECRET = process.env.JWT_SECRET || "secretkey123";

// Crea un token JWT con expiración de 1 día
export async function createAccessToken(payload: { id: string | number }): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, TOKEN_SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err || !token) {
        reject(err || new Error("No se pudo generar el token"));
        return;
      }
      resolve(token as string);
    });
  });
}
export {TOKEN_SECRET}