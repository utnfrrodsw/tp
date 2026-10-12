// Schemas de Zod para validar la entrada de los endpoints del CRUD de usuarios.
// Los usa el middleware validate() en user.routes.ts, antes del controller.
import { z } from 'zod';
import { PROFILE_COLORS, USER_ROLES, USER_STATES } from '../../shared/types/enums';

// Reglas de cada campo definidas una sola vez: las comparten el alta y la edición.
const usernameSchema = z
  .string()
  .trim()
  .min(3, 'El nombre de usuario debe tener al menos 3 caracteres.')
  .max(50, 'El nombre de usuario no puede tener más de 50 caracteres.')
  .regex(
    /^[a-zA-Z0-9._]+$/,
    'El nombre de usuario solo puede tener letras, números, puntos y guiones bajos.'
  );

// El email se normaliza ANTES de validarlo (mismo criterio que auth.schema.ts):
// primero se le sacan los espacios y se pasa a minúsculas, y recién ahí se
// chequea el formato.
const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email('El email no tiene un formato válido.'));

// bcrypt solo tiene en cuenta los primeros 72 bytes de la contraseña.
const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres.')
  .max(72, 'La contraseña no puede tener más de 72 caracteres.');

const rolSchema = z.enum(USER_ROLES, {
  message: `El rol debe ser uno de: ${USER_ROLES.join(', ')}.`,
});

// Estado de la cuenta. Es lo que hace que la baja sea lógica: el alta no lo
// recibe (toda cuenta nueva entra activa) y en la edición solo lo puede mandar
// un ADMIN, que es quien suspende y reactiva cuentas.
const stateSchema = z.enum(USER_STATES, {
  message: `El estado debe ser uno de: ${USER_STATES.join(', ')}.`,
});

// Foto de perfil: se guarda la URL, no el archivo.
// El string vacío se traduce a null en vez de rechazarse, porque es lo que manda
// el formulario cuando el usuario borra el campo para volver al avatar por defecto.
const urlAvatarSchema = z
  .union([
    z.literal(''),
    z
      .string()
      .trim()
      .max(500, 'La URL de la imagen no puede tener más de 500 caracteres.')
      // Solo http(s): z.url() a secas acepta cualquier esquema, incluidos
      // "javascript:" y "data:", que no son una imagen y pueden ejecutar código.
      .pipe(z.url({ protocol: /^https?$/, error: 'La URL de la imagen no es válida.' })),
  ])
  .transform((value) => (value === '' ? null : value));

// Posición vertical del recorte del banner, en porcentaje (0 arriba, 100 abajo).
const bannerPositionSchema = z
  .number({ message: 'La posición del banner tiene que ser un número.' })
  .int('La posición del banner tiene que ser un número entero.')
  .min(0, 'La posición del banner va de 0 a 100.')
  .max(100, 'La posición del banner va de 0 a 100.');

// Color de acento del perfil. null lo vuelve al verde por defecto.
const profileColorSchema = z
  .enum(PROFILE_COLORS, {
    message: `El color debe ser uno de: ${PROFILE_COLORS.join(', ')}.`,
  })
  .nullable();

// El :id de la URL llega siempre como string; se valida y convierte a número acá,
// así el resto de las capas ya lo reciben tipado como number.
export const userIdParamSchema = z.object({
  id: z.coerce.number().int().positive('El id debe ser un número positivo.'),
});

// Alta de un usuario desde el panel de administración (POST /api/users).
// A diferencia del registro público, acá SÍ se puede elegir el rol: es la única
// forma de crear otro ADMIN sin tocar la base ni correr el seed. La ruta está
// restringida a ADMIN, así que nadie más puede elegirlo.
export const createUserSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  // Si no se manda, la cuenta entra como FREE, igual que un registro común.
  rol: rolSchema.optional(),
  url_avatar: urlAvatarSchema.optional(),
});

// Todo opcional: PATCH permite mandar solo el campo que se quiere cambiar.
// password no se edita por acá (no hay endpoint de cambio de contraseña todavía);
// rol y state solo los puede tocar un ADMIN, y eso lo chequea el service.
// url_banner, banner_position y profile_color son beneficios Pro: el service los
// rechaza si la cuenta editada es FREE.
export const updateUserSchema = z
  .object({
    username: usernameSchema.optional(),
    email: emailSchema.optional(),
    rol: rolSchema.optional(),
    state: stateSchema.optional(),
    url_avatar: urlAvatarSchema.optional(),
    // Mismas reglas que el avatar: URL de hasta 500 caracteres, '' vuelve a null.
    url_banner: urlAvatarSchema.optional(),
    banner_position: bannerPositionSchema.optional(),
    profile_color: profileColorSchema.optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'Hay que enviar al menos un campo para actualizar.',
  });

export type UserIdParam = z.infer<typeof userIdParamSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
