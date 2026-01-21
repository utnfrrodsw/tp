import roleGuard from '../middleware/roleGuard';

describe('roleGuard middleware (unit)', () => {
  test('allows when role matches', () => {
    const req: any = { user: { id: 1, rol: 'admin' } };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    const mw = roleGuard(['admin']);
    mw(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('forbids when role does not match', () => {
    const req: any = { user: { id: 1, rol: 'usuario' } };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    const mw = roleGuard(['admin']);
    mw(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
