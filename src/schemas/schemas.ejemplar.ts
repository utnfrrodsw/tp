import { addDays, startOfDay } from "date-fns";
import { date, z } from "zod";

const ejemplarAltaSchema = z // En el altaManual mandas la fecha si o si. Incluso aunque sea la fecha del dia, lo manda el front. No se manda la hora, se pone automaticamente en 00 en la DB.
  .object({
    fechaIncorporacion: z
      .string()
      .date()
      .refine((fecha) => {
        const fechaIngresada = new Date(fecha);
        const mañana = startOfDay(addDays(new Date(), 1));
        return fechaIngresada < mañana;
      }),
  })
  .strict();

const ejemplarPatchSchema = z
  .object({
    fechaIncorporacion: z
      .string()
      .date()
      .refine((fecha) => {
        const fechaIngresada = new Date(fecha);
        const mañana = startOfDay(addDays(new Date(), 1));
        return fechaIngresada < mañana;
      })
      .optional(),
  })
  .strict();

export { ejemplarAltaSchema, ejemplarPatchSchema };
