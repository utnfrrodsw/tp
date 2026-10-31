# Tests automáticos

Los dos repositorios usan [Vitest](https://vitest.dev). Última ejecución completa: **22/10/2026, todos en verde**.

| Repo | Archivos | Tests | Resultado |
|:-|:-:|:-:|:-:|
| Backend | 6 | 94 | ✅ 94 pasaron |
| Frontend | 6 | 41 | ✅ 41 pasaron |

## Cómo correrlos

```bash
# Backend (desde backend/)
pnpm test            # una vez
pnpm run test:watch  # queda corriendo y repite al guardar

# Frontend (desde la raíz del repo)
npm test
npm run test:watch
```

No hace falta tener una base de datos ni el servidor levantado.

## Backend

Usa [supertest](https://github.com/ladjs/supertest) para llamar a la API real (la app de Express completa, con sus middlewares y controladores) sin abrir un puerto. Con `NODE_ENV=test` la conexión se reemplaza por una base **SQLite en memoria**, así que **nunca toca la base real** aunque el `.env` tenga `DATABASE_URL` ([decisión 10](decisiones.md#10-los-tests-de-integración-usan-sqlite-en-memoria)).

### Unitarios (`backend/tests/unit`)

| Archivo | Qué prueba |
|:-|:-|
| `http.test.js` | `toPositiveInt`, `isValidEmail`, `esErrorDeReferencia` (entradas válidas e inválidas) |
| `membresia.test.js` | `fechaValida` (rechaza `2026-02-30`, años no bisiestos, formatos raros), `valorValido` (rangos, redondeo a 2 decimales), `calcularEstado` (Pendiente / Activa / Por vencer / Vencida, incluidos los bordes) |
| `password.test.js` | Largo mínimo y máximo, hash y verificación, usuario inexistente |

### Integración (`backend/tests/integration`)

| Archivo | Qué prueba |
|:-|:-|
| `auth.test.js` | Login correcto (cookie `httpOnly`), mismo `401` para email inexistente y contraseña incorrecta, `/auth/me` sin y con sesión, rechazo de un origen no permitido (CSRF), logout |
| `clientes-membresias.test.js` | Alta de cliente (crea la cuenta con contraseña = DNI), DNI repetido `409`, email inválido `400`, permisos por rol (`403`), estado de la membresía según las fechas, el profesor no ve membresías, el cliente solo ve las suyas, listado de clientes con `membresia` (y sin ese campo para el profesor), borrado en cascada |
| `turnos.test.js` | Tipos de clase y turnos (validaciones y permisos), plantillas que generan 30 días sin duplicarse, inscripción (membresía que cubra el día del turno, cupo, 8 horas de anticipación, un turno por día, sin duplicados, cancelar y volver a anotarse), qué ve cada rol, registro de asistencia (profesor del turno, estados válidos, turno futuro) y reglas de borrado |

## Frontend

[Testing Library](https://testing-library.com/docs/react-testing-library/intro) sobre jsdom.

| Archivo | Qué prueba |
|:-|:-|
| `src/utils/membresia.test.ts` | Formato de fechas, suma de días (cruces de mes/año y bisiestos), días hasta el vencimiento, elección de la membresía vigente |
| `src/components/auth/ProtectedRoute.test.tsx` | Deja pasar al rol permitido, manda al login sin sesión, redirige a un cliente que intenta entrar a `/admin`, no muestra nada mientras se restaura la sesión |
| `src/components/cliente/ClienteCard.test.tsx` | Muestra el estado de membresía y su vencimiento, "Sin membresía", no muestra membresía en la vista del profesor, aviso de contraseña inicial, botón "Ver detalle" |
| `src/context/ColorModeProvider.test.tsx` | Tema claro por defecto, aplica y guarda el modo oscuro, recuerda la elección, ignora valores inválidos |
| `src/utils/turno.test.ts` | Formato de horas y días, lugares libres y turno completo, inscripción vigente, horas que faltan para el inicio, membresía que cubre el día |
| `src/components/turno/TurnoCard.test.tsx` | Horario, clase, profesor y lugares; turno completo; sin profesor; plantilla "Todos los días"; acciones |

## Lo que no cubren

- **No hay test end-to-end** (navegador real contra backend y base reales). Las pantallas se verificaron a mano en el navegador. La herramienta natural para sumarlo es [Playwright](https://playwright.dev).
- Las **migraciones** no se prueban con SQLite (usan SQL de PostgreSQL): se ejercitan al levantar el servidor contra una base PostgreSQL vacía.

## Evidencia

Salida resumida de la última ejecución:

```text
Backend
 Test Files  6 passed (6)
      Tests  94 passed (94)

Frontend
 Test Files  6 passed (6)
      Tests  41 passed (41)
```
