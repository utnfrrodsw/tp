import { describe, it, expect } from 'vitest';
import { parseResenaRespuesta } from '../../utils/resenaParser';

describe('unit - resenaParser.ts', () => {
  describe('parseResenaRespuesta()', () => {
    it('debe rechazar respuestas de menos de 3 caracteres', () => {
      const result = parseResenaRespuesta({ comentario: 'ok' }, 12);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('El texto debe tener al menos 3 caracteres');
    });

    it('debe aceptar respuestas de 3 caracteres exactos', () => {
      const result = parseResenaRespuesta({ comentario: 'ok!' }, 12);

      expect(result.valid).toBe(true);
      expect(result.data).toEqual({
        comentario: 'ok!',
        resenaPadreId: 12,
      });
    });
  });
});
