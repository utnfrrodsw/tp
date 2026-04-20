import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import {
  createResena,
  approveResena,
  rejectResena,
  getModerationStats,
} from '../../controllers/resena.controller';
import { EstadoResena } from '../../entities/resena.entity';
import { RolUsuario } from '../../entities/usuario.entity';

type AnyObj = Record<string, any>;

function createMockResponse(): Partial<Response> {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

function createReqWithOrm(overrides: Partial<Request>, emMock: AnyObj): Request {
  const appMock = {
    get: vi.fn().mockImplementation((key: string) => {
      if (key === 'orm') {
        return {
          em: {
            fork: () => emMock,
          },
        };
      }
      return undefined;
    }),
  };

  return {
    app: appMock,
    params: {},
    body: {},
    query: {},
    ...overrides,
  } as unknown as Request;
}

describe('unit - resena.controller moderation flow', () => {
  let res: Partial<Response>;

  beforeEach(() => {
    vi.clearAllMocks();
    res = createMockResponse();
  });

  it('approveResena debe permitir aprobar reseña FLAGGED', async () => {
    const resena = {
      id: 10,
      estado: EstadoResena.FLAGGED,
      deletedAt: new Date(),
      autoRejected: true,
    };

    const emMock = {
      findOne: vi
        .fn()
        .mockResolvedValueOnce({ id: 1, rol: RolUsuario.ADMIN })
        .mockResolvedValueOnce(resena),
      persistAndFlush: vi.fn().mockResolvedValue(undefined),
    };

    const req = createReqWithOrm(
      {
        params: { id: '10' } as any,
        user: { id: 1 } as any,
      } as any,
      emMock
    );

    await approveResena(req, res as Response);

    expect(resena.estado).toBe(EstadoResena.APPROVED);
    expect(resena.deletedAt).toBeUndefined();
    expect(resena.autoRejected).toBe(false);
    expect(emMock.persistAndFlush).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Reseña aprobada' })
    );
  });

  it('rejectResena debe permitir rechazar reseña FLAGGED y guardar comentario', async () => {
    const resena = {
      id: 22,
      estado: EstadoResena.FLAGGED,
      deletedAt: undefined,
      autoRejected: true,
      rejectionReason: undefined as string | undefined,
    };

    const emMock = {
      findOne: vi
        .fn()
        .mockResolvedValueOnce({ id: 1, rol: RolUsuario.ADMIN })
        .mockResolvedValueOnce(resena),
      persistAndFlush: vi.fn().mockResolvedValue(undefined),
    };

    const req = createReqWithOrm(
      {
        params: { id: '22' } as any,
        body: { comentario: 'No cumple normas de convivencia' } as any,
        user: { id: 1 } as any,
      } as any,
      emMock
    );

    await rejectResena(req, res as Response);

    expect(resena.estado).toBe(EstadoResena.FLAGGED);
    expect(resena.autoRejected).toBe(false);
    expect(resena.rejectionReason).toBe('No cumple normas de convivencia');
    expect(emMock.persistAndFlush).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Reseña rechazada' })
    );
  });

  it('getModerationStats debe calcular métricas coherentes con autoModerated/autoRejected/deletedAt', async () => {
    const now = new Date();
    const dayAgo = (days: number) => {
      const d = new Date(now);
      d.setDate(d.getDate() - days);
      return d;
    };

    const allResenas = [
      {
        createdAt: dayAgo(1),
        estado: EstadoResena.APPROVED,
        autoModerated: true,
        autoRejected: false,
        deletedAt: null,
        moderationScore: 90,
        moderationReasons: '[]',
      },
      {
        createdAt: dayAgo(2),
        estado: EstadoResena.FLAGGED,
        autoModerated: true,
        autoRejected: true,
        deletedAt: dayAgo(2),
        moderationScore: 5,
        moderationReasons: JSON.stringify(['Lenguaje ofensivo']),
      },
      {
        createdAt: dayAgo(0),
        estado: EstadoResena.FLAGGED,
        autoModerated: false,
        autoRejected: false,
        deletedAt: null,
        moderationScore: 25,
        moderationReasons: JSON.stringify(['Requiere revisión manual']),
      },
      {
        createdAt: dayAgo(3),
        estado: EstadoResena.APPROVED,
        autoModerated: false,
        autoRejected: false,
        deletedAt: null,
        moderationScore: 60,
        moderationReasons: '[]',
      },
      {
        createdAt: dayAgo(4),
        estado: EstadoResena.FLAGGED,
        autoModerated: false,
        autoRejected: false,
        deletedAt: dayAgo(4),
        moderationScore: 10,
        moderationReasons: JSON.stringify(['Spam']),
      },
    ];

    const emMock = {
      find: vi.fn().mockResolvedValue(allResenas),
    };

    const req = createReqWithOrm(
      {
        query: { range: '30d' } as any,
      } as any,
      emMock
    );

    await getModerationStats(req, res as Response);

    expect(res.status).not.toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledTimes(1);

    const payload = (res.json as any).mock.calls[0][0];
    expect(payload.total).toBe(5);
    expect(payload.autoApproved).toBe(1);
    expect(payload.autoRejected).toBe(1);
    expect(payload.pending).toBe(1);
    expect(payload.manuallyReviewed).toBe(2);
    expect(payload.averageScore).toBe(38);
    expect(payload.topReasons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ reason: 'Lenguaje ofensivo' }),
        expect.objectContaining({ reason: 'Requiere revisión manual' }),
      ])
    );
    expect(payload.recentTrend).toHaveLength(7);
  });

  it('createResena debe persistir auto-reject y devolver blocked=true', async () => {
    const emMock = {
      findOne: vi
        .fn()
        .mockResolvedValueOnce({ id: 1, nombre: 'Admin User' })
        .mockResolvedValueOnce({ id: 5, nombre: 'Libro mock', externalId: 'book-5' }),
      create: vi.fn().mockImplementation((_entity: any, data: any) => ({ ...data, id: 999 })),
      persistAndFlush: vi.fn().mockResolvedValue(undefined),
    };

    const req = createReqWithOrm(
      {
        body: {
          comentario: 'Este libro es una mierda total y odio todo',
          estrellas: 1,
          libroId: 'book-5',
          libro: {
            id: 'book-5',
            titulo: 'Libro mock',
            autores: ['Autor Uno'],
          },
        } as any,
        user: { id: 1 } as any,
        headers: { authorization: 'Bearer token' } as any,
      } as any,
      emMock
    );

    await createResena(req, res as Response);

    expect(emMock.create).toHaveBeenCalledTimes(1);
    expect(emMock.persistAndFlush).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        blocked: true,
        reviewId: 999,
      })
    );
  });

  it('createResena con comentario demasiado corto debe persistir bloqueada y devolver blocked=true', async () => {
    const emMock = {
      findOne: vi
        .fn()
        .mockResolvedValueOnce({ id: 1, nombre: 'Usuario Demo' })
        .mockResolvedValueOnce({ id: 6, nombre: 'Libro corto', externalId: 'book-6' }),
      create: vi.fn().mockImplementation((_entity: any, data: any) => ({ ...data, id: 1001 })),
      persistAndFlush: vi.fn().mockResolvedValue(undefined),
    };

    const req = createReqWithOrm(
      {
        body: {
          comentario: 'ab',
          estrellas: 3,
          libroId: 'book-6',
          libro: {
            id: 'book-6',
            titulo: 'Libro corto',
            autores: ['Autor Dos'],
          },
        } as any,
        user: { id: 1 } as any,
        headers: { authorization: 'Bearer token' } as any,
      } as any,
      emMock
    );

    await createResena(req, res as Response);

    expect(emMock.create).toHaveBeenCalledTimes(1);
    expect(emMock.persistAndFlush).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        blocked: true,
        reasons: expect.arrayContaining(['Comentario demasiado corto (posible spam)']),
        reviewId: 1001,
      })
    );
  });
});
