// src/services/moderation.service.ts
import Sentiment from 'sentiment';

export interface ModerationResult {
  isApproved: boolean;
  score: number;
  reasons: string[];
  sentimentScore: number;
  hasProfanity: boolean;
  shouldAutoReject: boolean; // Nueva propiedad para rechazo automático
  flags: {
    toxicity: boolean;
    spam: boolean;
    negativeSentiment: boolean;
    profanity: boolean;
  };
}

export const MODERATION_THRESHOLDS = {
  AUTO_REJECT_SCORE: 15,
  AUTO_FLAG_SCORE: 30,
  AUTO_APPROVE_SCORE: 85,
} as const;

export type ModerationDecision = 'auto_reject' | 'auto_flag' | 'auto_approve' | 'manual_review';

export class ModerationService {
  private sentiment: Sentiment;
  private profanityWords: Set<string>;

  constructor() {
    this.sentiment = new Sentiment();
    
    // Lista expandida de palabras ofensivas en español e inglés
    this.profanityWords = new Set([
      // Español - ofensas directas
      'idiota', 'estúpido', 'estupido', 'tonto', 'imbecil', 'imbécil',
      'mierda', 'mier*a', 'pendejo', 'cabron', 'cabrón', 'carajo',
      'puta', 'puto', 'joder', 'coño', 'gilipollas', 'mamón', 'mamon',
      'chingar', 'verga', 'pinche', 'culero', 'huevón', 'huevon',
      // Español - términos despectivos
      'basura', 'porquería', 'porqueria', 'caca', 'puto asco',
      // Inglés - ofensas directas
      'shit', 'fuck', 'fucking', 'fuckin', 'damn', 'ass', 'asshole',
      'bitch', 'bastard', 'cunt', 'dick', 'cock', 'pussy',
      // Inglés - términos despectivos
      'stupid', 'idiot', 'dumb', 'moron', 'retard', 'loser', 'trash',
      // Variaciones con símbolos
      'sh1t', 'f*ck', 'b1tch', 'a$$', 'sh!t'
    ]);
  }

  /**
   * Verifica si el texto contiene palabras ofensivas
   */
  private containsProfanity(text: string): boolean {
    const lowerText = text.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remover acentos
    
    // Normalizar espacios y símbolos comunes usados para evasión
    const normalizedText = lowerText
      .replace(/[*@#$%]/g, '') // Remover símbolos de evasión
      .replace(/\s+/g, ' ')    // Normalizar espacios
      .replace(/[0o]/g, 'o')   // Normalizar números usados como letras
      .replace(/[1i]/g, 'i')
      .replace(/[3e]/g, 'e')
      .replace(/[4a]/g, 'a')
      .replace(/[5s]/g, 's');
    
    for (const word of this.profanityWords) {
      // Buscar palabra completa (no dentro de otras palabras)
      const wordPattern = new RegExp(`\\b${word}\\b`, 'i');
      if (wordPattern.test(normalizedText) || lowerText.includes(word)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Analiza una reseña y determina si debe ser aprobada automáticamente
   * @param text Texto de la reseña
   * @param stars Calificación en estrellas (1-5)
   * @returns Resultado del análisis de moderación
   */
  analyzeReview(text: string, stars: number): ModerationResult {
    const normalizedText = text.trim();
    const reasons: string[] = [];
    const flags = {
      toxicity: false,
      spam: false,
      negativeSentiment: false,
      profanity: false
    };

    // 1. Análisis de sentimiento
    const sentimentResult = this.sentiment.analyze(text);
    const sentimentScore = sentimentResult.score;

    // 2. Detección de lenguaje ofensivo/profanidad
    const hasProfanity = this.containsProfanity(text);
    if (hasProfanity) {
      reasons.push('Contiene lenguaje ofensivo o inapropiado');
      flags.profanity = true;
    }

    // 3. Verificar longitud mínima (evitar spam) - Reducido a 3 para permitir respuestas cortas
    if (normalizedText.length < 3) {
      reasons.push('Comentario demasiado corto (posible spam)');
      flags.spam = true;
    }

    // 4. Detectar spam por repetición excesiva
    if (this.hasExcessiveRepetition(text)) {
      reasons.push('Contiene repetición excesiva de caracteres o palabras');
      flags.spam = true;
    }

    // 5. Detectar URLs sospechosas (spam)
    if (this.hasSuspiciousLinks(text)) {
      reasons.push('Contiene enlaces sospechosos');
      flags.spam = true;
    }

    // 6. Inconsistencia entre calificación y sentimiento
    if (this.hasInconsistentRating(stars, sentimentScore)) {
      reasons.push('Calificación inconsistente con el texto');
      flags.negativeSentiment = true;
    }

    // 7. Sentimiento extremadamente negativo
    if (sentimentScore < -5) {
      reasons.push('Sentimiento extremadamente negativo');
      flags.negativeSentiment = true;
      flags.toxicity = true;
    }

    // 8. Detectar toxicidad por palabras clave
    if (this.hasToxicKeywords(text)) {
      reasons.push('Contiene lenguaje tóxico o agresivo');
      flags.toxicity = true;
    }

    // Calcular score final (0-100)
    let score = 100;
    
    // Penalizaciones más severas
    if (flags.profanity) score -= 50;  // Mayor penalización por profanidad
    if (flags.spam) score -= 35;       // Mayor penalización por spam
    if (flags.negativeSentiment) score -= 20;
    if (flags.toxicity) score -= 45;   // Mayor penalización por toxicidad
    
    // Penalización extra si hay múltiples flags
    const flagCount = Object.values(flags).filter(f => f).length;
    if (flagCount >= 2) score -= 15;   // Penalización adicional por múltiples problemas
    if (flagCount >= 3) score -= 25;   // Penalización severa si tiene 3+ problemas
    
    // Bonus por texto constructivo y bien estructurado
    if (text.length > 50 && text.length < 1000) score += 10;
    if (sentimentScore > 0 && !flags.negativeSentiment) score += 5;
    if (text.length > 100 && !flags.spam) score += 5; // Bonus por reseñas detalladas

    score = Math.max(0, Math.min(100, score));

    // Decisión de auto-rechazo: contenido extremadamente problemático
    // Score muy bajo (<15) O múltiples flags críticos simultáneos
    const shouldAutoReject = 
      normalizedText.length < 3 ||
      score < MODERATION_THRESHOLDS.AUTO_REJECT_SCORE || 
      (flags.profanity && flags.toxicity) || 
      (flags.spam && flags.profanity && flags.toxicity) ||
      (flags.toxicity && flags.profanity && sentimentScore < -8);

    // Decisión final: auto-aprobar solo puntajes altos sin flags críticos.
    const isApproved = score >= MODERATION_THRESHOLDS.AUTO_APPROVE_SCORE && !flags.profanity && !flags.toxicity;

    return {
      isApproved,
      score,
      reasons,
      sentimentScore,
      hasProfanity,
      shouldAutoReject,
      flags
    };
  }

  getDecision(result: ModerationResult): ModerationDecision {
    if (result.shouldAutoReject) return 'auto_reject';
    if (result.score >= MODERATION_THRESHOLDS.AUTO_APPROVE_SCORE && !result.flags.profanity && !result.flags.toxicity) {
      return 'auto_approve';
    }
    if (result.score < MODERATION_THRESHOLDS.AUTO_FLAG_SCORE || result.flags.profanity || result.flags.toxicity) {
      return 'auto_flag';
    }
    return 'manual_review';
  }

  /**
   * Detecta repetición excesiva de caracteres o palabras
   */
  private hasExcessiveRepetition(text: string): boolean {
    // Detectar caracteres repetidos (ej: "aaaaaaa", "!!!!!!!!!")
    const charRepetition = /(.)\1{5,}/g;
    if (charRepetition.test(text)) return true;

    // Detectar palabras repetidas
    const words = text.toLowerCase().split(/\s+/);
    const wordCounts = new Map<string, number>();
    
    for (const word of words) {
      if (word.length > 3) {
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
      }
    }

    // Si alguna palabra se repite más de 5 veces
    for (const count of wordCounts.values()) {
      if (count > 5) return true;
    }

    return false;
  }

  /**
   * Detecta enlaces sospechosos
   */
  private hasSuspiciousLinks(text: string): boolean {
    // Detectar URLs
    const urlPattern = /(https?:\/\/|www\.)[^\s]+/gi;
    const matches = text.match(urlPattern);
    
    // Si tiene más de 2 URLs, probablemente es spam
    return matches ? matches.length > 2 : false;
  }

  /**
   * Verifica inconsistencia entre calificación y sentimiento del texto
   */
  private hasInconsistentRating(stars: number, sentimentScore: number): boolean {
    // 5 estrellas con sentimiento muy negativo
    if (stars >= 4 && sentimentScore < -3) return true;
    
    // 1-2 estrellas con sentimiento muy positivo
    if (stars <= 2 && sentimentScore > 3) return true;

    return false;
  }

  /**
   * Detecta palabras clave tóxicas
   */
  private hasToxicKeywords(text: string): boolean {
    const toxicPatterns = [
      /\b(odio|odiar|odioso)\b/gi,
      /\b(asco|asqueroso|repugnante)\b/gi,
      /\b(horrible|horroroso|horrendo)\b/gi,
      /\b(porquería|basura|desperdicio)\b/gi,
      /\b(pésimo|terrible|espantoso|deplorable)\b/gi,
      /\bmier[dz]a\b/gi,
      /\b(maldito|maldita|condenado)\b/gi,
      /\b(inútil|incompetente|mediocre)\b/gi,
      /\b(apesta|huele mal|da asco)\b/gi,
      /\b(no sirve|no vale nada|vale verga)\b/gi,
      /\b(una mierda|una basura|una porquería)\b/gi,
    ];

    let toxicCount = 0;
    for (const pattern of toxicPatterns) {
      if (pattern.test(text)) toxicCount++;
    }

    // Si tiene 2 o más palabras tóxicas, flag (más estricto)
    return toxicCount >= 2;
  }

  /**
   * Obtiene texto limpio sin profanidades
   */
  cleanText(text: string): string {
    let cleanedText = text;
    for (const word of this.profanityWords) {
      const regex = new RegExp(word, 'gi');
      cleanedText = cleanedText.replace(regex, '***');
    }
    return cleanedText;
  }
}

// Singleton instance
export const moderationService = new ModerationService();
