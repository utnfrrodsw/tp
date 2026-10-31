# PlanIt — web

Frontend de PlanIt: marketplace de bienes y servicios para organizar eventos,
construido con React + TypeScript + Vite.

## Requisitos

* Node.js 20+
* Variables de entorno en `.env` (ver `.env` de ejemplo / `src/config`)

## Scripts

```bash
npm run dev       # servidor de desarrollo con HMR
npm run build     # type-check + build de producción (dist/)
npm run preview   # sirve el build de producción localmente
npm run lint      # ESLint
npm run test      # tests con Vitest
```

## Estructura

```
src/
  modules/        # un módulo por dominio (admin, auth, clientes, empresas, eventos)
    <modulo>/
      components/
      pages/
      services/
  shared/         # utilidades y componentes reutilizables entre módulos
  config/         # configuración de API/Supabase
```

Ver el [README de la raíz](../../README.md) para la descripción general del
proyecto y cómo levantar el monorepo completo.
