"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usuario_entity_1 = require("../entities/usuario.entity");
// Función para generar el token JWT
const generateToken = (usuario) => {
    const payload = {
        id: usuario.id,
        username: usuario.username,
        email: usuario.email,
    };
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
};
// Registro de usuario (crear cuenta)
const registerUser = async (req, res) => {
    const { email, username, password } = req.body;
    try {
        const orm = req.app.get('orm');
        const usuario = orm.em.create(usuario_entity_1.Usuario, { email, username, password });
        await usuario.hashPassword(); // Encriptar la contraseña
        await orm.em.persistAndFlush(usuario);
        res.status(201).json({ message: 'Usuario registrado exitosamente', usuario });
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error desconocido' });
    }
};
exports.registerUser = registerUser;
// Login de usuario
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const orm = req.app.get('orm');
        const usuario = await orm.em.findOne(usuario_entity_1.Usuario, { email });
        if (!usuario) {
            return res.status(400).json({ error: 'Credenciales incorrectas' });
        }
        // Verificar la contraseña
        const isValidPassword = await usuario.validatePassword(password);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Credenciales incorrectas' });
        }
        // Generar el token JWT
        const token = generateToken(usuario);
        res.json({ message: 'Inicio de sesión exitoso', token });
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error desconocido' });
    }
};
exports.loginUser = loginUser;
