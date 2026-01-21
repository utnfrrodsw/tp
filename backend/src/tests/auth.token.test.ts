import jwt from 'jsonwebtoken';

describe('jwt', () => {
  test('creates and verifies token', () => {
    const secret = 'test-secret';
    const token = jwt.sign({ id: 1, rol: 'usuario' } as any, secret, { expiresIn: '1h' });
    const payload = jwt.verify(token, secret) as any;
    expect(payload.id).toBe(1);
    expect(payload.rol).toBe('usuario');
  });
});
