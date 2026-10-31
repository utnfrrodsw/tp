# Decisiones de diseño

Registro de las decisiones que tomó el grupo y por qué. Si algo cambia, se agrega una entrada nueva en lugar de borrar la anterior.

## 1. Contraseña inicial = DNI

**Decisión:** cuando el admin da de alta un cliente o un profesor, su cuenta se crea con el **DNI como contraseña inicial**, y queda marcada con `debeCambiarPassword: true`.

**Por qué:** es lo más simple para el usuario y para el gimnasio (en el mostrador el admin ya tiene el DNI, no hay que inventar ni comunicar una clave). Es el mismo criterio que usa la propia facultad con algunos de sus sistemas.

**Riesgo conocido:** **no es la mejor práctica**: el DNI es un dato semipúblico y fácil de adivinar. Lo asumimos de forma consciente y lo mitigamos así:
- El frontend le recuerda al usuario que cambie la contraseña mientras `debeCambiarPassword` siga en `true` (Configuración → cambiar contraseña). Al cambiarla vuelve a `false`.
- El login tiene límite de intentos (10 cada 15 minutos por IP).
- El admin puede desactivar una cuenta (`activo: false`) o cambiarle la contraseña en cualquier momento.
- Si se cambia la contraseña de una cuenta, las sesiones anteriores dejan de valer (`tokenVersion`).

Si en el futuro se quisiera endurecer, la alternativa es forzar el cambio en el primer login (hoy no bloquea nada) o generar una clave temporal aleatoria.

## 2. Sesión con JWT en cookie httpOnly

**Decisión:** login propio, JWT firmado (HS256) guardado en una cookie `httpOnly`; las contraseñas se guardan con bcrypt (costo 12).

**Por qué:** una cookie httpOnly no se puede leer desde JavaScript, así que un XSS en el frontend no puede robar la sesión (con `localStorage` sí). Además se vuelve a consultar al usuario en cada request: desactivar una cuenta o cambiar la contraseña corta el acceso al instante.

**Detalles:**
- El frontend no llama al backend directo: pide todo a `/api` en su propio origen y Vercel/Vite lo reenvían. Así la cookie es del mismo sitio y alcanza `SameSite=lax` (si se llamara de `vercel.app` a `onrender.com`, sería una cookie de terceros y Safari la bloquearía).
- Como protección extra contra CSRF, los métodos que modifican datos verifican que el `Origin` sea el del frontend.
- El mensaje de error del login es el mismo si el email no existe o la contraseña es incorrecta, y se compara contra un hash falso cuando el usuario no existe, para que el tiempo de respuesta no revele qué emails están registrados.

## 3. Todo cliente y todo profesor tiene cuenta

**Decisión:** la cuenta se crea junto con el cliente/profesor y se borra con él. No existen clientes ni profesores sin cuenta.

**Por qué:** tener personas que "no pueden entrar" generaba casos raros (¿cómo ve su rutina un cliente sin cuenta?) y dos formas de crear lo mismo. El email es obligatorio porque es el usuario con el que entra.

## 4. No hay registro público

Solo un admin crea cuentas. Es un sistema interno de un gimnasio: los clientes los da de alta el personal. El primer admin se crea con `pnpm run create-admin`.

## 5. Migraciones en lugar de `sequelize.sync()`

**Decisión:** el esquema se maneja con migraciones versionadas (Umzug) que se aplican al arrancar el servidor. Ver [migraciones](migraciones.md).

**Por qué:** `sync()` solo crea tablas nuevas y nunca modifica las existentes, así que la base de producción fue quedando distinta de los modelos (hubo tablas duplicadas y restricciones que no coincidían). Con migraciones, cualquiera que levante el proyecto obtiene el mismo esquema.

## 6. El estado de la membresía se calcula

No se guarda una columna `estado`: se calcula con las fechas y la fecha de hoy en Argentina (el servidor puede estar en UTC). Evita que quede desactualizado y no necesita un proceso programado. "Por vencer" es un vencimiento dentro de los próximos 7 días.

## 7. El profesor no ve las membresías

Las membresías tienen datos de pagos que no le corresponden a un profesor. El backend responde `403` en `/membresias` y no incluye `membresia` en el listado de clientes que recibe el profesor. El frontend también oculta el filtro y el chip, pero la protección real es la del backend.

## 8. Se quita Salón del alcance

El grupo pasó de 4 a 3 integrantes. Para no sobrecargar el alcance se eliminó la entidad **Salón** (CRUD simple) y se quitó del frontend. Las clases (tipos de clase, turnos, inscripciones) se resuelven con las tablas de `TiposClase` y `Turnos`, sin una entidad Actividad ni Salón aparte.

## 9. Borrado de un cliente en cascada

Al borrar un cliente se borran también sus membresías, sus rutinas y su cuenta. El frontend lo avisa en un cuadro de confirmación ("¿Estás seguro?") antes de hacerlo. Se prefirió esto a bloquear el borrado y obligar a eliminar todo a mano. En cambio, **un profesor con rutinas no se puede borrar** (`409`), porque esas rutinas también pertenecen a clientes.

## 10. Los tests de integración usan SQLite en memoria

Los tests del backend corren con `NODE_ENV=test`, que reemplaza la conexión por una base SQLite en memoria. Así no necesitan un PostgreSQL instalado, son rápidos y, aunque el `.env` tenga `DATABASE_URL`, **nunca tocan la base real**. El esquema de los tests sale de los modelos (`sequelize.sync`), no de las migraciones: las migraciones usan SQL específico de PostgreSQL y se prueban al levantar el servidor contra Postgres.

## 11. Clases y turnos: plantillas, reglas de reserva y asistencia

**Plantillas diarias:** un turno sin fecha es una plantilla que genera los turnos de los próximos 30 días, así el admin no carga uno por uno una clase que se repite todos los días. La generación se hace una vez por día (o al cambiar una plantilla) y es idempotente: pedir los turnos varias veces no duplica nada. Una plantilla mal cargada se omite en lugar de romper el listado de turnos para todos.

**Reglas de reserva:** se reserva con una membresía que cubra el día del turno, con al menos 8 horas de anticipación, un turno por día y hasta la capacidad máxima. Las valida el backend dentro de una transacción con el turno bloqueado, para que dos clientes a la vez no se pasen del cupo; el frontend avisa antes para no frustrar al usuario, pero no es lo que las hace cumplir. Todas devuelven `409` con el motivo.

**Asistencia:** se registra sobre la inscripción (`asistio` o `ausente`) sin agregar tablas: el estado de la inscripción ya existía. Se puede registrar el día del turno o después, y se puede deshacer. Los estados `asistio` y `ausente` siguen contando para el cupo.

**Lo que ve cada rol:** el profesor solo ve los turnos que dicta; el cliente solo ve su propia inscripción en cada turno (por eso cada turno trae `inscriptos`, para saber cuántos lugares quedan). La membresía se pide para el **día del turno** y no solo para hoy, así nadie se anota a una clase que cae después de su vencimiento; si necesita reservar más adelante, renueva primero. Esto une las dos partes del sistema: las membresías que carga el admin habilitan las reservas.

**Sin Salón:** los turnos no tienen salón ni actividad aparte (ver la decisión 8): alcanza con el tipo de clase.
