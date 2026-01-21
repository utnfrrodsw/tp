import bcrypt from 'bcryptjs';

describe('hashing', () => {
  test('bcrypt hashes and compares correctly', async () => {
    const pw = 'mi.pass.123';
    const hashed = await bcrypt.hash(pw, 10);
    const ok = await bcrypt.compare(pw, hashed);
    expect(ok).toBe(true);
  });
});
