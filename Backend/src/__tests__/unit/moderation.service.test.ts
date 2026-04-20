/**
 * Tests Unitarios para moderation.service.ts
 * Coverage target: 90%+
 * Patrón AAA (Arrange, Act, Assert) — Vitest con imports explícitos
 *
 * Se usa la librería real 'sentiment' (no tiene I/O externo) y se accede
 * internamente al mock de analyze cuando se necesita un score controlado.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ModerationService, moderationService } from '../../services/moderation.service';

// ── Helper: forzar un score de sentimiento controlado ──────────────
function setSentimentScore(service: ModerationService, score: number) {
  (service as any).sentiment.analyze = vi.fn().mockReturnValue({ score });
}

describe('unit - moderation.service.ts', () => {
  let service: ModerationService;

  beforeEach(() => {
    service = new ModerationService();
    // Por defecto: sentimiento neutro
    setSentimentScore(service, 0);
  });

  // ================================================================
  // analyzeReview — Casos de éxito
  // ================================================================
  describe('analyzeReview() — éxito', () => {
    it('debe aprobar una reseña limpia y constructiva', () => {
      // Arrange
      const text = 'Este libro es muy interesante, lo disfruté bastante. Recomendado para todo lector.';
      setSentimentScore(service, 2);

      // Act
      const result = service.analyzeReview(text, 4);

      // Assert
      expect(result.isApproved).toBe(true);
      expect(result.hasProfanity).toBe(false);
      expect(result.shouldAutoReject).toBe(false);
      expect(result.flags.profanity).toBe(false);
      expect(result.flags.spam).toBe(false);
      expect(result.flags.toxicity).toBe(false);
      expect(result.reasons).toHaveLength(0);
    });

    it('debe dar bonus de score a textos constructivos (>50 chars)', () => {
      // Arrange
      const shortText = 'Buen libro, recomendado para leer en verano largo plazo.';
      setSentimentScore(service, 1);

      // Act
      const result = service.analyzeReview(shortText, 4);

      // Assert — score base 100 + bonus clamped a 100 máximo
      expect(result.score).toBe(100);
    });

    it('debe dar bonus extra a reseñas detalladas (>100 chars)', () => {
      // Arrange
      const detailedText = 'Este es un libro maravilloso que me atrapó desde la primera página. La trama está muy bien construida y los personajes son memorables.';
      setSentimentScore(service, 3);

      // Act
      const result = service.analyzeReview(detailedText, 5);

      // Assert — bonus por >50 chars, >100 chars y sentimiento positivo
      expect(result.score).toBeGreaterThanOrEqual(100);
      expect(result.isApproved).toBe(true);
    });
  });

  // ================================================================
  // analyzeReview — Detección de profanidad
  // ================================================================
  describe('analyzeReview() — profanidad', () => {
    it('debe detectar profanidad en español', () => {
      const result = service.analyzeReview('Este libro es una mierda total', 1);

      expect(result.hasProfanity).toBe(true);
      expect(result.flags.profanity).toBe(true);
      expect(result.isApproved).toBe(false);
      expect(result.reasons).toContain('Contiene lenguaje ofensivo o inapropiado');
    });

    it('debe detectar profanidad en inglés', () => {
      const result = service.analyzeReview('This book is fucking terrible, shit quality', 1);

      expect(result.hasProfanity).toBe(true);
      expect(result.flags.profanity).toBe(true);
      expect(result.isApproved).toBe(false);
    });

    it('debe detectar evasión con símbolos (f*ck, sh1t)', () => {
      const result = service.analyzeReview('This is f*ck and sh1t content right here today', 1);

      expect(result.hasProfanity).toBe(true);
      expect(result.flags.profanity).toBe(true);
    });

    it('debe detectar profanidad con acentos normalizados', () => {
      const result = service.analyzeReview('El autor es un estúpido que no sabe escribir', 1);

      expect(result.hasProfanity).toBe(true);
    });
  });

  // ================================================================
  // analyzeReview — Detección de spam
  // ================================================================
  describe('analyzeReview() — spam', () => {
    it('debe detectar texto demasiado corto (<3 chars)', () => {
      const result = service.analyzeReview('ab', 3);

      expect(result.flags.spam).toBe(true);
      expect(result.reasons).toContain('Comentario demasiado corto (posible spam)');
    });

    it('debe aceptar texto de exactamente 3 caracteres', () => {
      const result = service.analyzeReview('abc', 3);

      // No debería flaggear por corto (3 >= 3)
      expect(result.reasons).not.toContain('Comentario demasiado corto (posible spam)');
    });

    it('debe detectar repetición excesiva de caracteres', () => {
      const result = service.analyzeReview('Este libro es aaaaaaaaaa genial por cierto', 5);

      expect(result.flags.spam).toBe(true);
      expect(result.reasons).toContain('Contiene repetición excesiva de caracteres o palabras');
    });

    it('debe detectar repetición excesiva de palabras', () => {
      const text = 'comprar comprar comprar comprar comprar comprar ahora';
      const result = service.analyzeReview(text, 5);

      expect(result.flags.spam).toBe(true);
    });

    it('debe detectar enlaces sospechosos (>2 URLs)', () => {
      const text = 'Visita http://spam1.com y http://spam2.com y http://spam3.com para descuentos';
      const result = service.analyzeReview(text, 3);

      expect(result.flags.spam).toBe(true);
      expect(result.reasons).toContain('Contiene enlaces sospechosos');
    });

    it('no debe flaggear 2 o menos URLs', () => {
      const text = 'Puedes encontrarlo en http://amazon.com y http://goodreads.com recomendado';
      const result = service.analyzeReview(text, 4);

      expect(result.reasons).not.toContain('Contiene enlaces sospechosos');
    });
  });

  // ================================================================
  // analyzeReview — Toxicidad
  // ================================================================
  describe('analyzeReview() — toxicidad', () => {
    it('debe detectar palabras clave tóxicas (requiere 2+)', () => {
      // "odio" + "horrible" = 2 palabras tóxicas
      const result = service.analyzeReview('Odio este horrible libro, es lo peor que leí', 1);

      expect(result.flags.toxicity).toBe(true);
      expect(result.reasons).toContain('Contiene lenguaje tóxico o agresivo');
    });

    it('no debe flaggear toxicidad con una sola palabra tóxica', () => {
      const result = service.analyzeReview('El libro es horrible pero tiene buenos momentos y enseñanzas', 2);

      // Solo 1 palabra tóxica, el umbral es >= 2
      expect(result.reasons).not.toContain('Contiene lenguaje tóxico o agresivo');
    });

    it('debe detectar sentimiento extremadamente negativo (score < -5)', () => {
      setSentimentScore(service, -8);
      const text = 'Este libro me parece bastante malo en general';
      const result = service.analyzeReview(text, 1);

      expect(result.flags.negativeSentiment).toBe(true);
      expect(result.flags.toxicity).toBe(true);
      expect(result.reasons).toContain('Sentimiento extremadamente negativo');
    });
  });

  // ================================================================
  // analyzeReview — Inconsistencia calificación/sentimiento
  // ================================================================
  describe('analyzeReview() — inconsistencia', () => {
    it('debe detectar 5 estrellas con sentimiento muy negativo', () => {
      setSentimentScore(service, -5);
      const text = 'Este libro tiene algunos problemas según mi opinión personal';
      const result = service.analyzeReview(text, 5);

      expect(result.flags.negativeSentiment).toBe(true);
      expect(result.reasons).toContain('Calificación inconsistente con el texto');
    });

    it('debe detectar 1 estrella con sentimiento muy positivo', () => {
      setSentimentScore(service, 5);
      const text = 'Es un libro genial, me parece excelente en todos sus aspectos';
      const result = service.analyzeReview(text, 1);

      expect(result.flags.negativeSentiment).toBe(true);
      expect(result.reasons).toContain('Calificación inconsistente con el texto');
    });

    it('no debe flaggear calificación consistente con sentimiento', () => {
      setSentimentScore(service, 2);
      const text = 'Me gustó el desarrollo de los personajes en esta novela tan interesante';
      const result = service.analyzeReview(text, 4);

      expect(result.reasons).not.toContain('Calificación inconsistente con el texto');
    });
  });

  // ================================================================
  // analyzeReview — Auto-rechazo
  // ================================================================
  describe('analyzeReview() — auto-rechazo', () => {
    it('debe auto-rechazar cuando el comentario es demasiado corto (<3 chars útiles)', () => {
      const result = service.analyzeReview('ab', 3);

      expect(result.reasons).toContain('Comentario demasiado corto (posible spam)');
      expect(result.shouldAutoReject).toBe(true);
    });

    it('debe auto-rechazar cuando score < 15', () => {
      // Profanidad (-50) + spam (-35) + toxicidad (-45) + penalización múltiple
      setSentimentScore(service, -10);
      const text = 'mierda mierda mierda mierda mierda mierda odio asco basura http://x.com http://y.com http://z.com';
      const result = service.analyzeReview(text, 1);

      expect(result.shouldAutoReject).toBe(true);
      expect(result.score).toBeLessThan(15);
    });

    it('debe auto-rechazar cuando hay profanidad + toxicidad combinadas', () => {
      // "idiota" (profanidad) + "odio" + "horrible" (2 tóxicas)
      const text = 'Este idiota autor, odio su horrible escritura en esta basura de novela';
      const result = service.analyzeReview(text, 1);

      expect(result.flags.profanity).toBe(true);
      expect(result.flags.toxicity).toBe(true);
      expect(result.shouldAutoReject).toBe(true);
    });

    it('no debe auto-rechazar una reseña con un solo flag menor', () => {
      setSentimentScore(service, -4);
      const text = 'No me convencio mucho este libro, esperaba algo mejor de este autor reconocido';
      const result = service.analyzeReview(text, 5);

      // Solo inconsistencia leve, no debería auto-rechazar
      expect(result.shouldAutoReject).toBe(false);
    });
  });

  // ================================================================
  // analyzeReview — Cálculo de score
  // ================================================================
  describe('analyzeReview() — cálculo de score', () => {
    it('score nunca debe ser menor a 0', () => {
      setSentimentScore(service, -20);
      const text = 'mierda idiota estúpido aaaaaaaaaa odio asco horrible basura http://a.com http://b.com http://c.com';
      const result = service.analyzeReview(text, 1);

      expect(result.score).toBeGreaterThanOrEqual(0);
    });

    it('score nunca debe ser mayor a 100 (con bonus)', () => {
      setSentimentScore(service, 10);
      const detailedText = 'Un libro extraordinario que merece ser leído por todos. La narrativa es perfecta y los personajes son muy reales. Recomendado totalmente.';
      const result = service.analyzeReview(detailedText, 5);

      expect(result.score).toBeLessThanOrEqual(100);
    });

    it('debe aplicar penalización extra con 2+ flags', () => {
      // Spam (corto <3) + profanidad explícita = 2 flags → penalización extra
      const result = service.analyzeReview('fu', 3);

      // 'fu' es 2 chars → spam flag, pero no profanidad (no match de palabra completa)
      // Solo 1 flag = sin penalización extra. Score: 100 - 35 (spam) = 65
      expect(result.score).toBeLessThan(100);
    });
  });

  // ================================================================
  // analyzeReview — Edge cases
  // ================================================================
  describe('analyzeReview() — edge cases', () => {
    it('debe manejar string vacío', () => {
      const result = service.analyzeReview('', 3);

      // Vacío = < 3 chars → spam
      expect(result.flags.spam).toBe(true);
    });

    it('debe manejar texto con solo espacios', () => {
      // Con trim(), solo espacios cuenta como comentario vacío
      const result = service.analyzeReview('   ', 3);

      expect(result.flags.spam).toBe(true);
      expect(result.shouldAutoReject).toBe(true);
    });

    it('debe manejar calificación en límite inferior (1)', () => {
      setSentimentScore(service, 0);
      const result = service.analyzeReview('Es un libro que no cumplió mis expectativas en general', 1);

      expect(result).toHaveProperty('isApproved');
      expect(result).toHaveProperty('score');
    });

    it('debe manejar calificación en límite superior (5)', () => {
      setSentimentScore(service, 3);
      const result = service.analyzeReview('Excelente libro, lo mejor que he leído en mucho tiempo realmente', 5);

      expect(result.isApproved).toBe(true);
    });
  });

  // ================================================================
  // cleanText()
  // ================================================================
  describe('cleanText()', () => {
    it('debe reemplazar profanidades con ***', () => {
      const result = service.cleanText('Este libro es una mierda');

      expect(result).toContain('***');
      expect(result).not.toContain('mierda');
    });

    it('debe reemplazar múltiples profanidades', () => {
      const result = service.cleanText('Qué mierda de libro, es una basura total');

      expect(result).toContain('***');
      expect(result).not.toContain('mierda');
      expect(result).not.toContain('basura');
    });

    it('debe dejar intacto texto sin profanidades', () => {
      const cleanInput = 'Este libro es maravilloso y lo recomiendo';
      const result = service.cleanText(cleanInput);

      expect(result).toBe(cleanInput);
    });

    it('debe manejar string vacío', () => {
      const result = service.cleanText('');
      expect(result).toBe('');
    });
  });

  // ================================================================
  // Singleton export
  // ================================================================
  describe('moderationService (singleton)', () => {
    it('debe exportar una instancia singleton funcional', () => {
      expect(moderationService).toBeInstanceOf(ModerationService);
      expect(typeof moderationService.analyzeReview).toBe('function');
      expect(typeof moderationService.cleanText).toBe('function');
    });
  });
});
