// apps/web/src/modules/auth/index.ts

// 1. Exportar la página principal del módulo para usar en React Router
export { default as AuthPage } from './pages/AuthPage';

// 2. Exportar componentes clave si se necesitan reutilizar fuera
// apps/web/src/modules/auth/index.ts
// apps/web/src/modules/auth/index.ts

export { AuthCard } from './components/AuthCard';
export { FormularioLogin } from './components/LoginForm';
export { RegisterForm } from './components/RegisterForm';

// 3. (A futuro) Exportar Hooks o Servicios si otros módulos los requieren
// export * from './hooks/useAuth';
// export * from './services/auth.service';