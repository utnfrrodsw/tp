"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedRoute = void 0;
const protectedRoute = (req, res) => {
    if (req.user) {
        return res.json({ message: `Hello ${req.user.email}` });
    }
    res.status(401).json({ error: 'No user found' });
};
exports.protectedRoute = protectedRoute;
