# Musicboxd — Frontend

Aplicación web de Musicboxd: **Vite + React + TypeScript**, React Router, Context API
con `useReducer` para el estado global y SASS con arquitectura 7-1.

## Puesta en marcha

```bash
npm install
cp .env.example .env
npm run dev
```

Levanta en `http://localhost:5173`. El backend tiene que estar corriendo en el
puerto 3000 (ver [`../backend/README.md`](../backend/README.md)): el frontend no
consulta ninguna API externa, todo sale de nuestra propia API.

### Variables de entorno

| Variable       | Descripción                                                   |
| :------------- | :------------------------------------------------------------ |
| `VITE_API_URL` | URL base de la API, incluyendo `/api`. Nunca se hardcodea la URL |
| `VITE_WEB3FORMS_ACCESS_KEY` | Access key de [Web3Forms](https://web3forms.com), que recibe el formulario de `/contact` y lo reenvía por mail. Se pide gratis con la casilla que va a recibir los mensajes. Sin ella, el formulario avisa que no está configurado |

## Scripts

| Script            | Qué hace                                    |
| :---------------- | :------------------------------------------ |
| `npm run dev`     | Servidor de desarrollo con HMR              |
| `npm run build`   | Chequeo de tipos (`tsc -b`) + build de Vite |
| `npm run lint`    | ESLint sobre todo el proyecto               |
| `npm run preview` | Sirve el build de producción                |
| `npm test`        | Tests de componentes (Vitest)               |
| `npm run test:watch` | Los corre y queda escuchando cambios     |
| `npm run test:e2e` | Test end-to-end (Playwright)               |

## Tests

Son de dos tipos, y la diferencia es qué tan lejos llega cada uno.

**Tests de componente** — con Vitest y React Testing Library, montando el
componente solo en un DOM simulado (`jsdom`). El requisito de la cátedra es uno; hay
siete, uno por cada pieza donde la regla vive en lo que se dibuja y no se puede
verificar leyendo el backend:

| Test | Qué fija |
| :--- | :------- |
| `core/components/SegmentedControl/SegmentedControl.test.tsx` | Una opción por cada `option`, `aria-pressed` solo en la elegida y el aviso al padre al hacer click |
| `features/membership/components/MembershipPanel/MembershipPanel.test.tsx` | La regla del pago único: el panel no ofrece renovar ni dar de baja |
| `features/membership/components/RevenueDashboard/RevenueDashboard.test.tsx` | El tablero de métricas con ventas y sin ninguna |
| `features/membership/components/PlanForm/PlanForm.test.tsx` | La validación propia del formulario de planes |
| `features/user/components/CreateUserForm/CreateUserForm.test.tsx` | La validación del alta de usuarios |
| `features/home/pages/ContactPage/ContactPage.test.tsx` | El formulario de contacto, incluido el caso sin access key |
| `features/ad/components/AdModal/AdModal.test.tsx` | El anuncio no se puede saltar antes de los 5 segundos, y su imagen se envuelve en un enlace solo si tiene destino |

`SegmentedControl` es el más simple a propósito: no depende del router, ni del
`AuthContext`, ni de la API, así que se monta con un `render()` pelado y sin mocks.
Los demás mockean su servicio o se envuelven en un `MemoryRouter`.

Hay además un test que no monta ningún componente: `core/utils/validators.test.ts`
prueba las reglas de validación (`required`, `isEmail`, `minLength`, `isUrl`, …) como
funciones sueltas, que es lo que son. Nada de esto necesita tener algo levantado:

```bash
npm test
```

**Test end-to-end** — `e2e/login.spec.ts`, con Playwright. Un navegador real
abre la aplicación y hace el login como lo haría una persona: entra a la home,
abre el modal desde la barra de navegación, completa el formulario y comprueba
que la barra pase a mostrar su cuenta. Un segundo caso verifica que con la
contraseña incorrecta el error del backend llegue a la pantalla como un mensaje
legible. Nada está mockeado: el pedido viaja hasta MySQL y vuelve.

Playwright levanta el backend y el frontend por su cuenta (y reutiliza los que ya
tengas corriendo), pero **MySQL con `npm run seed` hecho es un prerrequisito
manual**. La primera vez hay que bajar el navegador con
`npx playwright install chromium`.

```bash
npm run test:e2e
```

Con `npm run test:e2e -- --headed` se ve el navegador haciendo el recorrido.

## Estructura

```
src/
  app/App.tsx       Rutas y providers globales
  core/
    components/     Componentes reutilizables por todas las features
                    (Navbar, Footer, Loader, ProtectedRoute, Tabs, ...)
    context/        Estado global: AuthContext (sesión), AuthModalContext (modal)
    services/       httpClient (único punto de salida HTTP) y tokenStorage
    utils/          ApiError y traducción de errores a mensajes de pantalla
  features/<x>/     Una carpeta por entidad del dominio:
    components/     Componentes propios de la feature, uno por carpeta con su .scss
    models/         Clases que representan los datos de la API
    pages/          Páginas enrutadas, una por carpeta con su .scss
    services/       Llamadas HTTP de la feature (usan el httpClient)
    styles/         Solo tokens (_tokens.scss): variables compartidas, sin CSS
  styles/           7-1: abstracts (variables, breakpoints, mixins), base, main.scss
```

## Cómo hablar con la API

Ningún componente usa `fetch` directo: **todo pasa por el `httpClient`**, que arma
la URL, adjunta el token de sesión si hay alguien logueado y convierte cualquier
respuesta con error en un `ApiError`.

El servicio de la feature es el único que ve el JSON crudo: lo mapea a la clase del
modelo y devuelve eso.

```ts
// features/album/services/albumService.ts
import { httpClient } from '../../../core/services/httpClient';
import { Album } from '../models/Album';
import type { AlbumApiResponse } from '../models/Album';

export const albumService = {
  async findAll(): Promise<Album[]> {
    const data = await httpClient.get<AlbumApiResponse[]>('/albums');
    return data.map((item) => new Album(item.id_album, item.title));
  },
};
```

En el componente se manejan siempre los tres estados: cargando, error y sin datos.

```tsx
const [albums, setAlbums] = useState<Album[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  albumService
    .findAll()
    .then(setAlbums)
    .catch((err) => setError(getErrorMessage(err)))
    .finally(() => setIsLoading(false));
}, []);

if (isLoading) return <Loader />;
if (error) return <p className="error">{error}</p>;
if (albums.length === 0) return <p>Todavía no hay álbumes cargados.</p>;
```

## Sesión del usuario

El `AuthContext` es la única fuente de verdad de quién está logueado. Cualquier
componente lo lee con el hook `useAuth`:

```tsx
const { state, login, register, logout } = useAuth();

state.status;       // 'checking' | 'authenticated' | 'guest'
state.user;         // instancia de User, o null
state.isSubmitting; // hay un login/registro en curso
state.error;        // mensaje del último intento fallido, listo para mostrar
```

El token se guarda en `localStorage` y el `httpClient` lo adjunta solo en cada
request. Al abrir la app, el contexto le pregunta a `GET /auth/me` si ese token
sigue siendo válido, en vez de confiar en lo que haya guardado el navegador.

### Rutas privadas

```tsx
<Route path="/profile" element={
  <ProtectedRoute><UserProfilePage /></ProtectedRoute>
} />

<Route path="/admin/moderation" element={
  <ProtectedRoute roles={['ADMIN']}><ModerationPage /></ProtectedRoute>
} />
```

`ProtectedRoute` es **solo para la experiencia de usuario**: evita mostrar pantallas
que el usuario no va a poder usar. La validación que importa es la del backend
(`requireAuth` y `requireRole`), porque el estado del navegador se puede editar pero
la firma de un token no se puede falsificar.

### Las excepciones: `/reviews/:id` y `/lists/:id`

Casi todo el catálogo pide sesión, pero la página de una reseña es **pública**, y a
propósito: es el destino del botón "Compartir", así que el enlace lo tiene que poder
abrir alguien que todavía no tiene cuenta (la API de ese detalle también es pública).

Adentro, lo que lleva al catálogo va con `GatedLink`, el mismo componente que usan
las tarjetas del explorador: con sesión navega, y sin sesión abre el modal de
registro. Así un enlace compartido se lee entero y desde ahí se entra al sitio, en
vez de rebotar contra una pantalla de login.

Las columnas de "más reseñas" son la única parte que no se muestra sin sesión. No
es una restricción de la API (el listado de reseñas también es público): es una
decisión de la pantalla. Quien llega por un enlace compartido lee la reseña
entera, y en vez de seguir navegando reseñas sin cuenta ve la invitación a
registrarse.

La ficha de una lista (`/lists/:id`) es pública por el mismo motivo: también tiene
botón "Compartir". Lo que cambia con sesión son los controles del dueño y el
estado del corazón.

### Listas personalizadas: qué ve cada usuario

Una lista es de **álbumes o de canciones**, nunca de las dos. De qué es lo decide
el selector del modal de alta, y a partir de ahí la pantalla entera se adapta:
qué busca el buscador, qué dicen los contadores ("3 álbumes" / "5 canciones") y si
cada ítem enlaza a `/albums/:id` o a `/songs/:id`.

**Armar listas es un beneficio Pro.** El reparto quedó así:

| | Visitante | `FREE` | `PRO` / `ADMIN` |
| :-- | :-- | :-- | :-- |
| Ver `/lists` y la ficha de una lista | sí | sí | sí |
| Compartir el enlace | sí | sí | sí |
| "Me gusta" | abre el registro | sí | sí |
| Crear, editar, borrar y administrar ítems | — | cartel `ProOnlyNotice` | sí |

Al `FREE` no se le esconde la función: el botón "Crear lista" sigue ahí y, al
apretarlo, el modal muestra el cartel con el candado y el acceso a `/pro`, igual
que la pestaña "Estadísticas". Al dueño de una lista que **dejó de ser Pro** se le
ocultan los controles de gestión y se le explica por qué con un aviso en la ficha,
en vez de dejarle botones que responden 403.

Como siempre, esto es solo para no ofrecer lo que va a fallar: el corte real lo
hace el backend, que además revalida contra la base si la membresía sigue vigente.

### Pantallas que cambian según la sesión

No todo se resuelve bloqueando una ruta: hay pantallas públicas cuyo contenido tiene
que cambiar según quién mire. La regla es simple: **a quien ya inició sesión no se le
ofrece iniciar sesión**, y a quien ya es Pro no se le vende Pro.

| Pantalla | Visitante | Con sesión |
| :------- | :-------- | :--------- |
| Navbar | "Iniciar sesión" y "Registrarse" | avatar con el menú de la cuenta |
| Home (`Hero`, `CallToAction`) | invitación a registrarse | saludo por nombre y accesos a su perfil y al catálogo |
| `/pro` | `ProSalesView`, el pitch del plan | Free: mismo pitch, pero el botón dice "Pasarme a Pro"<br>Pro/Admin: `ProMemberView`, el área de socio |

Como red de seguridad, `openLogin` y `openSignup` del `AuthModalContext` no hacen
nada si ya hay sesión: así ningún botón que se haya pasado por alto puede abrir el
modal de registro a alguien que ya entró.

### Panel de administración (`/admin`)

Solo para `ADMIN` (`<ProtectedRoute roles={['ADMIN']}>`). Adentro se divide en seis
pestañas, cada una con su propio componente de panel:

| Pestaña | Componente | Qué gestiona |
| :------ | :--------- | :----------- |
| Métricas | `RevenueAdminSection` | Ventas de la membresía y usuarios por plan. Es la que abre por defecto |
| Usuarios | `AdminUsersPanel` | Alta de cuentas, cambio de rol y suspensión |
| Música | `AdminMusicPanel` | ABM del catálogo: artistas, álbumes y canciones |
| Solicitudes | `AdminRequestsPanel` | Moderación de los aportes que mandan los usuarios Pro (CUU 3) |
| Planes | `PlanAdminSection` | ABM de los planes de membresía |
| Anuncios | `AdAdminSection` | ABM de la publicidad que ven los usuarios Free |

La página solo decide qué pestaña está activa: **cada panel pide sus propios datos**,
así abrir el panel no dispara las requests de las seis áreas a la vez.

La barra de pestañas es el componente compartido `core/components/Tabs`, el mismo que
usa el perfil: si cambia el diseño de las pestañas, cambia en las dos pantallas a la
vez. `Tabs` solo dibuja lo que recibe; qué pestañas existen y cuál se muestra lo
deciden `ProfileTabs` y `AdminPage`.

El panel vivía en `/admin/users` cuando solo gestionaba cuentas; esa URL sigue
funcionando porque redirige a `/admin`.

### La publicidad que ve un usuario Free

Es la contracara de la promesa de la membresía: el sitio ofrece "sin anuncios" como
beneficio Pro, así que tiene que haber un anuncio que sacarse. La feature `ad` tiene
dos mitades: el ABM de la pestaña **Anuncios** de `/admin`, y el panel que aparece en
la navegación.

Quién lo ve y cuándo lo decide `AdRotator`, montado una sola vez en `App.tsx`:

- **solo un `FREE` con la sesión abierta.** Un visitante sin cuenta no ve ninguno: la
  vitrina pública queda limpia para quien todavía no se registró;
- **cada 20 segundos de navegación real.** El reloj no corre mientras hay un anuncio
  en pantalla, y cambiar de página no lo reinicia;
- **nunca en el flujo de pago** (`/pro/checkout`, `/pro/return`): cortar a alguien que
  está por contratar la membresía con la publicidad que viene a sacarse sería la peor
  forma de perder la venta;
- **nunca encima de un diálogo abierto.** Si al cumplirse la espera hay un modal en
  pantalla (una reseña a medio escribir, una lista que se está armando), el anuncio se
  posterga y se vuelve a intentar unos segundos después. Los modales del sitio se
  reconocen por su `aria-modal="true"`.

El panel (`AdModal`) **no bloquea el sitio**: flota a un costado y se puede seguir
navegando con él en pantalla, pero no se va solo. No se cierra con Escape ni con un
click al costado y no tiene una X: la única salida es "Saltar", que se habilita a los
cinco segundos. Por eso tampoco se marca como `aria-modal`, que le mentiría al lector
de pantalla. Todos los anuncios llevan además el acceso a `/pro`, que es el motivo por
el que el anuncio existe.

## Convenciones

- Todo en TypeScript: no se crean archivos `.js` / `.jsx`.
- Componentes funcionales con Hooks, en PascalCase; hooks en camelCase con prefijo `use`.
- Handlers de eventos con prefijo `handle` (`handleSubmit`, `handleLogout`).
- Una carpeta por componente (`AlbumCard/AlbumCard.tsx`, `AlbumCard.scss`, `index.ts`): cada
  componente importa su propio `.scss`. `styles/main.scss` queda solo con lo global
  (`abstracts` y `base`).
- Mobile-first: primero el estilo base, después `@media (min-width: ...)`.
- Sin librerías de UI, de estado ni de estilos fuera del stack definido.
