"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
// src/routes/auth.routes.ts
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller"); // ✅ import nombrado
const router = (0, express_1.Router)();
exports.authRoutes = router;
router.post('/login', auth_controller_1.login); // ✅ no ejecutes login()
router.post('/refresh-token', auth_controller_1.refreshToken); // ✅
