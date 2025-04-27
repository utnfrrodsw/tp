import jwt from 'jsonwebtoken'; // Asegúrate de tenerlo instalado
export const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Se espera que el token venga como 'Bearer <token>'
    if (!token) {
        return res.status(401).json({ error: 'No token provided' }); // Si no hay token, retornamos un error y la ejecución se detiene aquí
    }
    try {
        // Verifica el token con tu clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // Si el token es válido, se agrega el payload al request para que los controladores puedan acceder a él
        req.user = decoded;
        next(); // Llama a next() para que el flujo continúe
    }
    catch (error) {
        // Si el token no es válido, respondemos con un error
        return res.status(401).json({ error: 'Invalid token' });
    }
};
