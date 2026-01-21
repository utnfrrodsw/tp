"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
// src/app.ts
require("reflect-metadata");
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const core_1 = require("@mikro-orm/core");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
// Importar rutas
const usuarioRoutes_1 = __importDefault(require("./routes/usuarioRoutes"));
const camisetaRoutes_1 = __importDefault(require("./routes/camisetaRoutes"));
const categoriaRoutes_1 = __importDefault(require("./routes/categoriaRoutes"));
const ofertaRoutes_1 = __importDefault(require("./routes/ofertaRoutes"));
const subastaRoutes_1 = __importDefault(require("./routes/subastaRoutes"));
const compraRoutes_1 = __importDefault(require("./routes/compraRoutes"));
const pagoRoutes_1 = __importDefault(require("./routes/pagoRoutes"));
const descuentoRoutes_1 = __importDefault(require("./routes/descuentoRoutes"));
const metodoPagoRoutes_1 = __importDefault(require("./routes/metodoPagoRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const AuthController_1 = __importDefault(require("./controllers/AuthController"));
const auth_1 = __importDefault(require("./middleware/auth"));
const roleGuard_1 = __importDefault(require("./middleware/roleGuard"));
const ImagenRoutes_1 = __importDefault(require("./routes/ImagenRoutes"));
let app;
let orm;
async function createApp() {
    orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
    app = (0, express_1.default)();
    // Middleware para parsear JSON en el body (debe ir antes de cualquier middleware que use req.body)
    app.use(express_1.default.json());
    // Servir archivos estáticos para imágenes (debe ir antes de las rutas API)
    const path = require('path');
    app.use('/uploads', express_1.default.static(path.resolve(__dirname, '../public/uploads')));
    // CORS
    const defaultAllowed = [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
    ];
    const envAllowed = process.env.ALLOWED_ORIGINS?.split(',').map(s => s.trim()).filter(Boolean) ?? [];
    const allowedOrigins = envAllowed.length > 0 ? envAllowed : defaultAllowed;
    app.use((0, cors_1.default)({
        origin: (origin, cb) => {
            if (!origin)
                return cb(null, true);
            const isAllowed = allowedOrigins.includes(origin);
            if (isAllowed || process.env.NODE_ENV !== 'production')
                return cb(null, true);
            return cb(new Error(`CORS origin not allowed: ${origin}`));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
    app.use((req, res, next) => {
        console.log(`🔍 ${req.method} ${req.url}`);
        console.log('📦 Body:', req.body);
        console.log('🌐 Origin:', req.get('origin'));
        next();
    });
    app.locals.orm = orm;
    app.use('/api/auth', (0, AuthController_1.default)(orm));
    app.use('/api/usuarios', usuarioRoutes_1.default);
    app.use('/api/categorias', categoriaRoutes_1.default);
    app.use('/api/camisetas', camisetaRoutes_1.default);
    app.use('/api/ofertas', ofertaRoutes_1.default);
    app.use('/api/subastas', subastaRoutes_1.default);
    app.use('/api/compras', compraRoutes_1.default);
    app.use('/api/pagos', pagoRoutes_1.default);
    app.use('/api/descuentos', descuentoRoutes_1.default);
    app.use('/api/metodos-pago', metodoPagoRoutes_1.default);
    app.use('/api/imagenes', ImagenRoutes_1.default);
    app.use('/api/admin', adminRoutes_1.default);
    app.get('/api/health', (req, res) => {
        res.json({
            success: true,
            message: 'API Tienda Retro funcionando',
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            endpoints: [
                'GET /api/health',
                'GET /api/usuarios',
                'POST /api/usuarios',
                'GET /api/camisetas',
                'POST /api/camisetas',
                'POST /api/camisetas/publicar',
                'GET /api/categorias',
                'POST /api/categorias'
            ]
        });
    });
    app.get('/api/debug/echo', (req, res) => {
        res.json({ success: true, query: req.query });
    });
    app.get('/api/protegida/admin', auth_1.default, (0, roleGuard_1.default)(['admin']), (req, res) => {
        res.json({
            success: true,
            message: 'Acceso permitido para admin',
            usuario: req.user
        });
    });
    app.use(errorHandler_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
}
if (require.main === module) {
    (async () => {
        const app = await createApp();
        const PORT = Number(process.env.PORT) || 3000;
        const HOST = process.env.HOST || '0.0.0.0';
        app.listen(PORT, HOST, () => {
            console.log(`Servidor corriendo en http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
            console.log(`Health check: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/api/health`);
            console.log(`Escuchando en interfaces: ${HOST}`);
        });
    })();
}
