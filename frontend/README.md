# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  # Frontend

  Interfaz web del sistema de gestión del taller, implementada con React, TypeScript y Vite. Se comunica con la API Express y recibe actualizaciones de estado en tiempo real mediante Socket.IO.

  ## Desarrollo

  Desde este directorio:

  ```bash
  pnpm install
  pnpm dev
  ```

  Vite inicia la aplicación en `http://localhost:5173` por defecto. Configurar las URLs del backend en `frontend/.env`; los valores y pasos están en la [guía de instalación](../docs/05-instalacion/instalacion-configuracion.md).

  ## Variables de entorno

  - `VITE_BACKEND_URL`: origen de la API; default `http://localhost:3000`.
  - `VITE_WS_URL`: origen de Socket.IO; opcional, default `ws://localhost:3000`.

  ## Scripts

  | Comando | Descripción |
  |---|---|
  | `pnpm dev` | Servidor Vite de desarrollo. |
  | `pnpm build` | Verificación TypeScript y build de producción. |
  | `pnpm lint` | ESLint. |
  | `pnpm preview` | Previsualización del build. |

  La documentación general está en el [README del proyecto](../README.md), la [referencia de API](../server/api-doc.md) y el [índice de documentación](../docs/README.MD).
import reactX from 'eslint-plugin-react-x'
