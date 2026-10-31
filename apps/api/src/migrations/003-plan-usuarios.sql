-- Agrega el plan de la empresa: 'gratis' (hasta 3 servicios) o 'pro' (sin limite).
-- Lo usamos para saber si una empresa ya puede o no seguir subiendo servicios,
-- y lo actualizamos a 'pro' cuando Mercado Pago confirma el pago del plan.
-- Ejecutar en el SQL Editor de Supabase.

ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS plan VARCHAR(10) NOT NULL DEFAULT 'gratis';

ALTER TABLE usuarios
  ADD CONSTRAINT chk_usuarios_plan CHECK (plan IN ('gratis', 'pro'));
