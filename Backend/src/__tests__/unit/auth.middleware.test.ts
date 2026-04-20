/**
 * Tests Unitarios para auth.middleware.ts
 * Coverage target: 90%+
 * Patrón AAA (Arrange, Act, Assert) — Vitest con imports explícitos
 *
 * Se mockea 'jsonwebtoken' con vi.mock() para aislar la lógica del middleware
 * sin depender de tokens reales ni claves secretas.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { authenticateJWT, optionalAuthenticateJWT, AuthRequest } from '../../middleware/auth.middleware';
import { Response, NextFunction } from 'express';

// ── Mock de jsonwebtoken ───────────────────────────────────────────
vi.mock('jsonwebtoken');

// ── Helpers para construir objetos mock de Express ─────────────────
function createMockRequest(headers: Record<string, string> = {}): Partial<AuthRequest> {
    return {
        headers,
        path: '/test',
    };
}

function createMockResponse(): Partial<Response> {
    const res: Partial<Response> = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
}

function createMockNext(): NextFunction {
    return vi.fn();
}

describe('unit - auth.middleware.ts', () => {
    let mockReq: Partial<AuthRequest>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        vi.clearAllMocks();
        mockRes = createMockResponse();
        mockNext = createMockNext();
        // Reset env
        delete process.env.JWT_SECRET;
    });

    // ================================================================
    // authenticateJWT — Éxito
    // ================================================================
    describe('authenticateJWT() — éxito', () => {
        it('debe autenticar con token válido y poblar req.user', () => {
            // Arrange
            const decodedPayload = { id: 42, rol: 'usuario', iat: 1234567890 };
            vi.mocked(jwt.verify).mockReturnValue(decodedPayload as any);
            mockReq = createMockRequest({ authorization: 'Bearer valid-token-123' });

            // Act
            authenticateJWT(mockReq as AuthRequest, mockRes as Response, mockNext);

            // Assert
            expect(jwt.verify).toHaveBeenCalledWith('valid-token-123', 'secretkey');
            expect(mockReq.user).toEqual(decodedPayload);
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockRes.status).not.toHaveBeenCalled();
        });

        it('debe usar JWT_SECRET de la variable de entorno si está definida', () => {
            // Arrange
            process.env.JWT_SECRET = 'mi-clave-secreta-custom';
            const decodedPayload = { id: 1, rol: 'admin' };
            vi.mocked(jwt.verify).mockReturnValue(decodedPayload as any);
            mockReq = createMockRequest({ authorization: 'Bearer token-with-env-secret' });

            // Act
            authenticateJWT(mockReq as AuthRequest, mockRes as Response, mockNext);

            // Assert
            expect(jwt.verify).toHaveBeenCalledWith('token-with-env-secret', 'mi-clave-secreta-custom');
            expect(mockNext).toHaveBeenCalled();
        });
    });

    // ================================================================
    // authenticateJWT — Errores 401
    // ================================================================
    describe('authenticateJWT() — errores 401', () => {
        it('debe retornar 401 si falta el header Authorization', () => {
            // Arrange
            mockReq = createMockRequest({});

            // Act
            authenticateJWT(mockReq as AuthRequest, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Authorization header missing' });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('debe retornar 401 si el header no tiene token después de Bearer', () => {
            // Arrange
            mockReq = createMockRequest({ authorization: 'Bearer ' });

            // Act
            authenticateJWT(mockReq as AuthRequest, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Token missing' });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('debe retornar 401 si el token está expirado', () => {
            // Arrange
            vi.mocked(jwt.verify).mockImplementation(() => {
                throw new Error('jwt expired');
            });
            mockReq = createMockRequest({ authorization: 'Bearer expired-token' });

            // Act
            authenticateJWT(mockReq as AuthRequest, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('debe retornar 401 si el token es malformado', () => {
            // Arrange
            vi.mocked(jwt.verify).mockImplementation(() => {
                throw new Error('jwt malformed');
            });
            mockReq = createMockRequest({ authorization: 'Bearer malformed-token' });

            // Act
            authenticateJWT(mockReq as AuthRequest, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
        });

        it('debe retornar 401 si el payload decodificado no es un objeto', () => {
            // Arrange — jwt.verify retorna un string en vez de un objeto
            vi.mocked(jwt.verify).mockReturnValue('string-payload' as any);
            mockReq = createMockRequest({ authorization: 'Bearer string-token' });

            // Act
            authenticateJWT(mockReq as AuthRequest, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid token payload' });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('debe retornar 401 si el payload decodificado es null', () => {
            // Arrange
            vi.mocked(jwt.verify).mockReturnValue(null as any);
            mockReq = createMockRequest({ authorization: 'Bearer null-token' });

            // Act
            authenticateJWT(mockReq as AuthRequest, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid token payload' });
        });
    });

    // ================================================================
    // authenticateJWT — Edge cases
    // ================================================================
    describe('authenticateJWT() — edge cases', () => {
        it('debe extraer token del formato "Bearer <token>" correctamente', () => {
            // Arrange
            const payload = { id: 99 };
            vi.mocked(jwt.verify).mockReturnValue(payload as any);
            mockReq = createMockRequest({ authorization: 'Bearer my.jwt.token' });

            // Act
            authenticateJWT(mockReq as AuthRequest, mockRes as Response, mockNext);

            // Assert — el token enviado a verify es solo la parte del JWT
            expect(jwt.verify).toHaveBeenCalledWith('my.jwt.token', 'secretkey');
        });

        it('debe manejar header Authorization sin formato Bearer', () => {
            // Arrange — "Basic xxx" en vez de "Bearer xxx"
            mockReq = createMockRequest({ authorization: 'Basic some-credentials' });

            // Act — split(' ')[1] extrae 'some-credentials', jwt.verify debería fallar
            vi.mocked(jwt.verify).mockImplementation(() => {
                throw new Error('invalid signature');
            });
            authenticateJWT(mockReq as AuthRequest, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(401);
        });
    });

    // ================================================================
    // optionalAuthenticateJWT — Éxito
    // ================================================================
    describe('optionalAuthenticateJWT() — éxito', () => {
        it('debe poblar req.user con token válido', () => {
            // Arrange
            const payload = { id: 10, rol: 'moderador' };
            vi.mocked(jwt.verify).mockReturnValue(payload as any);
            mockReq = createMockRequest({ authorization: 'Bearer valid-optional-token' });

            // Act
            optionalAuthenticateJWT(mockReq as AuthRequest, mockRes as Response, mockNext);

            // Assert
            expect(mockReq.user).toEqual(payload);
            expect(mockNext).toHaveBeenCalledTimes(1);
        });

        it('debe continuar sin user si no hay header Authorization', () => {
            // Arrange
            mockReq = createMockRequest({});

            // Act
            optionalAuthenticateJWT(mockReq as AuthRequest, mockRes as Response, mockNext);

            // Assert
            expect(mockReq.user).toBeUndefined();
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockRes.status).not.toHaveBeenCalled();
        });

        it('debe continuar sin user si el header no tiene token', () => {
            // Arrange
            mockReq = createMockRequest({ authorization: 'Bearer ' });

            // Act
            optionalAuthenticateJWT(mockReq as AuthRequest, mockRes as Response, mockNext);

            // Assert
            expect(mockReq.user).toBeUndefined();
            expect(mockNext).toHaveBeenCalledTimes(1);
        });

        it('debe continuar sin user si el token es inválido (no lanza error 401)', () => {
            // Arrange
            vi.mocked(jwt.verify).mockImplementation(() => {
                throw new Error('invalid token');
            });
            mockReq = createMockRequest({ authorization: 'Bearer bad-token' });

            // Act
            optionalAuthenticateJWT(mockReq as AuthRequest, mockRes as Response, mockNext);

            // Assert — no devuelve 401, simplemente continúa
            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockReq.user).toBeUndefined();
        });

        it('debe continuar sin user si el payload no es un objeto', () => {
            // Arrange
            vi.mocked(jwt.verify).mockReturnValue('string-payload' as any);
            mockReq = createMockRequest({ authorization: 'Bearer string-payload-token' });

            // Act
            optionalAuthenticateJWT(mockReq as AuthRequest, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockRes.status).not.toHaveBeenCalled();
        });
    });
});
