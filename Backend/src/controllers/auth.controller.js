"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usuario_entity_1 = require("../entities/usuario.entity");
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const orm = req.app.get('orm');
        const usuario = await orm.em.findOne(usuario_entity_1.Usuario, { email });
        if (!usuario) {
            return res.status(400).json({ error: 'Credenciales incorrectas' });
        }
        const isValidPassword = await usuario.validatePassword(password);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Credenciales incorrectas' });
        }
        const token = generateToken(usuario);
        return res.json({ message: 'Inicio de sesión exitoso', token });
    }
    catch (error) {
        return res.status(500).json({ error: error instanceof Error ? error.message : 'Error desconocido' });
    }
};
exports.login = login;
const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token es necesario' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET);
        const orm = req.app.get('orm');
        const usuario = await orm.em.findOne(usuario_entity_1.Usuario, { id: decoded.userId });
        if (!usuario) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }
        const newAccessToken = jsonwebtoken_1.default.sign({ userId: usuario.id, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ accessToken: newAccessToken });
    }
    catch (error) {
        return res.status(403).json({ error: 'Refresh token inválido o expirado' });
    }
};
exports.refreshToken = refreshToken;
const generateToken = (usuario) => {
    const payload = {
        id: usuario.id,
        email: usuario.email,
    };
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
};
