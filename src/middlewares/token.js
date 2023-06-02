import jwt from 'jsonwebtoken'

const verifyTokenAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    try {
        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: 'Token inválido'
                });
            } else {
                if (decoded.role === 'admin') {
                    // El usuario tiene el rol correcto, se permite el acceso a la ruta
                    req.userID = decoded._id; //guarda ID para ser utilizado para validar update
                    next();
                } else {
                    return res.status(403).json({
                        message: 'No tienes permiso para acceder a esta ruta'
                    });
                }
            }
        });
    } catch (err) {
        console.log(err);
        res.status(401).json({
            message: 'Fallo en autentificacion!'
        });
    }
}

const verifyTokenUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    try {
        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: 'Token inválido'
                });
            } else {
                if (decoded.role === 'admin' || decoded.role === 'user') {
                    // El usuario tiene el rol correcto, se permite el acceso a la ruta
                    req.userID = decoded._id; //guarda ID para ser utilizado para validar update
                    next();
                } else {
                    return res.status(403).json({
                        message: 'No tienes permiso para acceder a esta ruta'
                    });
                }
            }
        });
    } catch (err) {
        console.log(err);
        res.status(401).json({
            message: 'Fallo en autentificacion!'
        });
    }
}
export default {
    verifyTokenAdmin,
    verifyTokenUser
};