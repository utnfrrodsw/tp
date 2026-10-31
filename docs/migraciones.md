# Migraciones

El esquema de la base se maneja con migraciones ([Umzug](https://github.com/sequelize/umzug)) en `backend/migrations`. El servidor **aplica las pendientes al arrancar**, así que en el deploy no hay que hacer nada extra.

| Comando (en `backend/`) | Qué hace |
|:-|:-|
| `pnpm run migrate` | Aplica las migraciones pendientes |
| `pnpm run migrate:status` | Muestra cuáles están aplicadas y cuáles pendientes |
| `pnpm run migrate:down` | Revierte la última (la del esquema inicial no se puede revertir) |

Cuáles están aplicadas se guarda en la tabla `SequelizeMeta` de la propia base.

## Cómo cambiar el esquema

1. Crear un archivo nuevo en `backend/migrations` con el formato `AAAAMMDD-NN-descripcion.js`. Se aplican en orden alfabético. Tiene que exportar `up` y `down`.
2. Actualizar el modelo de Sequelize para que coincida con la migración.
3. **No editar una migración que ya se aplicó**: si hay que corregir algo, se hace con otra migración nueva.

Ejemplo (`20261017-02-cliente-borra-rutinas.js`, cambia una restricción):

```js
module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Rutinas"
        DROP CONSTRAINT "Rutinas_dniCliente_fkey",
        ADD CONSTRAINT "Rutinas_dniCliente_fkey" FOREIGN KEY ("dniCliente")
          REFERENCES clientes(dni) ON UPDATE NO ACTION ON DELETE CASCADE
    `);
  },
  down: async ({ context: queryInterface }) => {
    // ...vuelve a ON DELETE NO ACTION
  }
};
```

## Desarrollar contra una base propia

**No desarrollar ramas con cambios de esquema contra la base compartida de Supabase.** Correr una rama así modifica la base para todos: así quedaron duplicadas las tablas `Membresia` y `membresia`.

Para una base local alcanza con un PostgreSQL instalado y estas variables en el `.env` en lugar de `DATABASE_URL`: `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_HOST` y `DB_PORT`. Al arrancar, las migraciones crean todas las tablas.

## Ramas que agregan tablas

**Regla:** toda rama que agregue o cambie tablas **tiene que traer su propia migración**. Sin ella, quien levante el proyecto desde cero no tiene esas tablas, y el que usó la base compartida ve cosas que nadie más puede reproducir.

Caso concreto: las tablas de clases (`TiposClase`, `Turnos`, `TurnoProfesores`, `InscripcionTUrno`) **ya existían en Supabase** porque se crearon al correr esa rama contra la base compartida, sin migración, y con dos typos: la tabla `InscripcionTUrno` y las columnas `createdAT`/`updatedAT` de `Turnos`. Su migración, [`20261022-01-clases-y-turnos.js`](../backend/migrations/20261022-01-clases-y-turnos.js), es el ejemplo a seguir. Es **idempotente**, así que corre sin error en las dos situaciones:

- **Donde las tablas ya existen (Supabase):** renombra los typos (`InscripcionTUrno` → `InscripcionTurno`, `createdAT` → `createdAt`), agrega la cascada al borrar un cliente y crea los índices.
- **En una base vacía:** crea las cuatro tablas desde cero.

Las dos situaciones se probaron con un PostgreSQL temporal, incluidas una segunda corrida (no hace nada) y `down` seguido de `up`.

Cómo se logra, en resumen:

```js
// Renombra solo si hace falta
await run(`
  DO $$
  BEGIN
    IF to_regclass('public."InscripcionTUrno"') IS NOT NULL
       AND to_regclass('public."InscripcionTurno"') IS NULL THEN
      ALTER TABLE "InscripcionTUrno" RENAME TO "InscripcionTurno";
    END IF;
  END $$;
`);

// Crea solo lo que falta
await run(`CREATE TABLE IF NOT EXISTS "TiposClase" ( ... )`);
await run(`CREATE UNIQUE INDEX IF NOT EXISTS "TurnoProfesores_turno_profesor_uq" ON ... `);
```

> Si una rama nueva se desarrolla contra la base compartida antes de tener su migración, hay que hacer esto mismo: una migración que acepte que las tablas ya existan.
