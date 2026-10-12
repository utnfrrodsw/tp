// Reglas del aporte de catálogo que comparten artista, álbum y canción.

/**
 * Tope de propuestas pendientes que puede tener un mismo usuario a la vez, por
 * cada tipo (artista, álbum o canción). Tiene que coincidir con
 * MAX_PENDING_PROPOSALS de artist.service.ts, album.service.ts y song.service.ts
 * del backend: acá solo se usa para avisar ANTES de intentarlo; el límite real lo
 * impone la API.
 */
export const MAX_PENDING_PROPOSALS = 6;
