import { z } from 'zod';

// Fuente de verdad para la VALIDACIÓN en runtime de requests (body/params/query).
// Los `dtos/*.dto.ts` de cada módulo son sólo tipos de compilación para las
// firmas de controllers/services; no validan nada por sí mismos, por eso
// deben reflejar (a mano) la forma de estos schemas.

const positiveId = z.number().int().positive().safe();
const positiveIdParam = z.string()
  .regex(/^[1-9]\d*$/, 'Debe ser un ID entero positivo')
  .refine((value) => Number.isSafeInteger(Number(value)), 'El ID está fuera del rango permitido');
const optionalName = z.string().trim().min(1).max(100);
const optionalDescription = z.string().max(10_000).optional();
const optionalImage = z.string().trim().max(255).optional();
const optionalDraft = z.boolean().optional();
// La empresa solo puede guardar el servicio como borrador o mandarlo a revision,
// nunca lo puede publicar directamente: eso lo hace el administrador al aprobarlo.
const optionalEstadoServicio = z.enum(['borrador', 'revision']).optional();
const email = z.string().trim().email().max(100);
const password = z.string().min(1).max(255);
const idParams = z.object({ id: positiveIdParam }).strict();
const updateHasFields = (data: object) => Object.keys(data).length > 0;

export const requestSchemas = {
  login: {
    body: z.object({ email, password }).strict()
  },
  register: {
    body: z.object({
      nombre: optionalName,
      email,
      password,
      confirmarContrasena: z.string().min(1).max(255),
      aceptaTerminos: z.literal(true),
      role: z.enum(['cliente', 'empresa']),
      zona: z.string().trim().min(1).max(100).optional(),
      cuit: positiveId.optional(),
      telefono: positiveId.optional()
    }).strict().superRefine((data, context) => {
      if (data.password !== data.confirmarContrasena) {
        context.addIssue({ code: 'custom', path: ['confirmarContrasena'], message: 'Las contraseñas no coinciden' });
      }
      if (data.role === 'empresa') {
        for (const field of ['zona', 'cuit', 'telefono'] as const) {
          if (data[field] === undefined) {
            context.addIssue({ code: 'custom', path: [field], message: 'Este campo es requerido para cuentas de empresa' });
          }
        }
      }
    })
  },
  createEvento: {
    body: z.object({
      nombre: optionalName,
      descripcion: optionalDescription,
      imagen: optionalImage,
      draft: optionalDraft
    }).strict()
  },
  updateEvento: {
    params: idParams,
    body: z.object({
      nombre: optionalName.optional(),
      descripcion: optionalDescription,
      imagen: optionalImage,
      draft: optionalDraft
    }).strict().refine(updateHasFields, 'Debe enviar al menos un campo para actualizar')
  },
  idParams: { params: idParams },
  createCategoria: {
    body: z.object({
      nombre: optionalName,
      descripcion: optionalDescription,
      eventoId: positiveId
    }).strict()
  },
  updateCategoria: {
    params: idParams,
    body: z.object({
      nombre: optionalName.optional(),
      descripcion: optionalDescription,
      eventoId: positiveId.optional()
    }).strict().refine(updateHasFields, 'Debe enviar al menos un campo para actualizar')
  },
  listServicios: {
    query: z.object({ usuarioId: positiveIdParam }).strict()
  },
  searchServicios: {
    query: z.object({
      nombre: z.string().trim().max(100).optional(),
      zona: z.string().trim().max(100).optional(),
      empresa: z.string().trim().max(100).optional()
    }).strict().refine((query) => Boolean(query.nombre || query.zona || query.empresa), {
      message: 'Ingresá un nombre, una zona o una empresa para buscar'
    })
  },
  categoriaIdParam: {
    params: z.object({ categoriaId: positiveIdParam }).strict()
  },
  createServicio: {
    body: z.object({
      nombre: optionalName,
      descripcion: optionalDescription,
      imagen: optionalImage,
      categoriaId: positiveId,
      usuarioId: positiveId,
      estado: optionalEstadoServicio
    }).strict()
  },
  updateServicio: {
    params: idParams,
    body: z.object({
      nombre: optionalName.optional(),
      descripcion: optionalDescription,
      imagen: optionalImage,
      categoriaId: positiveId.optional(),
      estado: optionalEstadoServicio,
      usuarioId: positiveId
    }).strict().refine(({ usuarioId: _usuarioId, ...data }) => updateHasFields(data), {
      message: 'Debe enviar al menos un campo para actualizar'
    })
  },
  deleteServicio: {
    params: idParams,
    query: z.object({ usuarioId: positiveIdParam.optional() }).strict(),
    body: z.object({ usuarioId: positiveId.optional() }).strict().optional()
  },
  createPaymentPreference: {
    body: z.object({
      usuarioId: positiveId,
      items: z.array(z.object({
        title: z.string().trim().min(1).max(256),
        quantity: z.number().int().positive().safe(),
        unit_price: z.number().positive().finite().refine(
          (price) => Math.round(price * 100) === price * 100,
          'El precio debe tener como máximo dos decimales'
        )
      }).strict()).min(1).max(50)
    }).strict()
  },
  createPlanProPreference: {
    body: z.object({
      usuarioId: positiveId,
      origin: z.string().trim().url().max(200)
    }).strict()
  },
  confirmarPlanPro: {
    body: z.object({
      usuarioId: positiveId,
      paymentId: z.string().trim().min(1).max(50)
    }).strict()
  },
  listUsuarios: {
    query: z.object({ rol: z.enum(['cliente', 'administrador', 'empresa']).optional() }).strict()
  },
  setUsuarioActivo: {
    params: idParams,
    body: z.object({ activo: z.boolean() }).strict()
  },
  businessStats: {
    query: z.object({ usuarioId: positiveIdParam }).strict()
  },
  createTablero: {
    body: z.object({ nombre: optionalName, eventoId: positiveId }).strict()
  },
  updateTablero: {
    params: idParams,
    body: z.object({ nombre: optionalName, eventoId: positiveId }).strict()
  },
  tableroIdParam: { params: idParams },
  addServicioToTablero: {
    params: idParams,
    body: z.object({ servicioId: positiveId }).strict()
  },
  removeServicioFromTablero: {
    params: z.object({ id: positiveIdParam, servicioId: positiveIdParam }).strict()
  }
};