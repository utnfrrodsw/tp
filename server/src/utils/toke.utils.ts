import jwt from 'jsonwebtoken';

export const parseJwt = (token: string) => {
    try {
        // En Node.js, decodificamos Base64 usando Buffer
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error al parsear el JWT:", e);
        return null;
    }
};
export default parseJwt;