
# Estándar para Construcción de Componentes UI

### Principios

- **Flexibilidad:** Los componentes deben poder usarse en distintos contextos sin forzar estilos de layout.
- **Consistencia:** Usar props estándar como `variant`, `size`, `fullWidth` y `className`.
- **Accesibilidad:** Incluir soporte para atributos como `aria-*`, `disabled`, etc.
- **Documentación:** Comentar los props y variantes en el código y mantener ejemplos aquí.

### Props recomendadas

- **variant:** Define el estilo principal del componente (`primary`, `outline`, `ghost`, etc.).
- **size:** Controla el tamaño (`sm`, `md`, `lg`).
- **fullWidth:** Hace que el componente ocupe el ancho completo de su contenedor (opcional).
- **className:** Permite agregar o sobreescribir clases de Tailwind o personalizadas.
- **Otros props estándar:** Como `disabled`, `isLoading`, etc.

### Ejemplo de Componente Button

```tsx
/**
 * Componente de botón reutilizable.
 * @param {ButtonProps} props - Props del botón.
 * @returns {JSX.Element} El botón renderizado.
 */
import React from 'react';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  outline: 'bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-400',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-50 focus:ring-slate-400',
  destructive: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
};

const sizeClasses = {
  sm: 'py-1.5 px-3 text-sm',
  md: 'py-2.5 px-4 text-base',
  lg: 'py-3 px-6 text-lg',
};

const Button = ({
  children,
  isLoading = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  ...props
}: ButtonProps) => (
  <button
    className={[
      'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses[variant],
      sizeClasses[size],
      fullWidth ? 'w-full' : '',
      className,
    ].join(' ')}
    disabled={isLoading || props.disabled}
    {...props}
  >
    {isLoading ? (
      <span className="animate-spin h-5 w-5 border-2 border-transparent border-t-current rounded-full"></span>
    ) : (
      children
    )}
  </button>
);

export default Button;
```

### Ejemplo de uso

```tsx
<Button variant="primary" size="lg" fullWidth>
  Confirmar
</Button>
<Button variant="outline" size="sm">
  Cancelar
</Button>
```

### Recomendaciones para nuevos componentes

- No forzar `w-full`, `flex`, `block`, márgenes o posiciones en los estilos base.
- Usar props para variantes y tamaños.
- Permitir siempre la prop `className`.
- Documentar los props y variantes en el archivo del componente.
- Incluir ejemplos de uso en este archivo o en el README de la carpeta.
