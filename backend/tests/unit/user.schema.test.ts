// Test unitario del schema de edición de usuario, en la parte de la
// personalización Pro (Juan Ignacio Esterri).
//
// Prueba las dos reglas de entrada del banner y el color: la paleta cerrada y el
// campo vacío que vuelve a NULL. Que un FREE no pueda usarlos lo decide el
// service, no el schema.
import { describe, expect, it } from 'vitest';
import { updateUserSchema } from '../../src/features/user/user.schema';

describe('updateUserSchema — personalización Pro', () => {
  it('acepta un color de la paleta', () => {
    const result = updateUserSchema.safeParse({ profile_color: 'purple' });

    expect(result.success).toBe(true);
    expect(result.data?.profile_color).toBe('purple');
  });

  it('rechaza un color fuera de la paleta', () => {
    // La columna es un ENUM: guardar un color libre metería CSS escrito por el
    // usuario en la base.
    const result = updateUserSchema.safeParse({ profile_color: '#ff0000' });

    expect(result.success).toBe(false);
  });

  it('acepta null para volver al color por defecto', () => {
    const result = updateUserSchema.safeParse({ profile_color: null });

    expect(result.success).toBe(true);
    expect(result.data?.profile_color).toBeNull();
  });

  it('traduce el banner vacío a null', () => {
    // Es lo que manda el formulario cuando el usuario borra el campo.
    const result = updateUserSchema.safeParse({ url_banner: '' });

    expect(result.success).toBe(true);
    expect(result.data?.url_banner).toBeNull();
  });

  it('rechaza un banner que no es una URL', () => {
    const result = updateUserSchema.safeParse({ url_banner: 'no-es-una-url' });

    expect(result.success).toBe(false);
  });

  it('rechaza URLs que no son http(s), como javascript: o data:', () => {
    // Son URLs "válidas" para el parser, pero no son una imagen y el navegador
    // podría ejecutarlas: solo se aceptan direcciones web.
    expect(updateUserSchema.safeParse({ url_avatar: 'javascript:alert(1)' }).success).toBe(false);
    expect(updateUserSchema.safeParse({ url_banner: 'data:text/html,hola' }).success).toBe(false);
  });

  it('acepta la posición del banner en los dos extremos', () => {
    expect(updateUserSchema.safeParse({ banner_position: 0 }).success).toBe(true);
    expect(updateUserSchema.safeParse({ banner_position: 100 }).success).toBe(true);
  });

  it('rechaza una posición del banner fuera de 0 a 100', () => {
    // Es un porcentaje de object-position: fuera del rango la imagen se sale de
    // la franja y queda un hueco vacío.
    expect(updateUserSchema.safeParse({ banner_position: 101 }).success).toBe(false);
    expect(updateUserSchema.safeParse({ banner_position: -1 }).success).toBe(false);
  });
});
