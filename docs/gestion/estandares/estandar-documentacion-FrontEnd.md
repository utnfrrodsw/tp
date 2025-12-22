
# Comentarios en el Código

### 1.1. Comentarios de Clases y Funciones

- **Encabezado de función/componente:**  
  Cada función, componente o clase debe tener un comentario descriptivo sobre su propósito, sus props/parámetros y su retorno.
- **Formato recomendado (JSDoc):**

```tsx
/**
 * Componente de botón reutilizable.
 * @param {ButtonProps} props - Props del botón.
 * @returns {JSX.Element} El botón renderizado.
 */
const Button = (props: ButtonProps): JSX.Element => { ... }
```

### 1.2. Comentarios de flujo y lógica

- Comenta bloques de lógica compleja o flujos poco evidentes.
- Explica el "por qué" de las decisiones, no solo el "qué".

```tsx
// Si el usuario no está autenticado, redirigir a login
if (!isAuthenticated) {
  navigate('/login');
}
```

---

## 2. Estructura y Documentación de Carpetas

### 2.1. Archivos README.md

- Cada carpeta principal (`components/ui`, `pages`, `api`, etc.) debe tener un `README.md` explicando:
  - Propósito de la carpeta.
  - Estructura interna.
  - Convenciones de nombres.
  - Ejemplo de uso si aplica.

### 2.2. Ejemplo de README.md para una carpeta UI

```md
# Componentes UI

Esta carpeta contiene componentes reutilizables de interfaz de usuario.

## Estructura

- Button.tsx: Botón reutilizable.
- Card.tsx: Tarjeta de contenido.
- ...

## Convenciones

- Todos los componentes aceptan `className` para estilos personalizados.
- Props estándar: `variant`, `size`, `fullWidth`, etc.

## Ejemplo de uso

```tsx
<Button variant="primary" size="lg">Aceptar</Button>
```
```

---

## 3. Estandarización de Props y Ejemplo de Comentario

- Documenta cada prop importante en los componentes.
- Usa comentarios JSDoc para describir props y tipos.

```tsx
/**
 * @typedef {Object} ButtonProps
 * @property {'primary'|'outline'|'ghost'} [variant] - Variante de color.
 * @property {'sm'|'md'|'lg'} [size] - Tamaño del botón.
 * @property {boolean} [fullWidth] - Si el botón ocupa todo el ancho.
 * @property {string} [className] - Clases adicionales.
 */
```

---

## 4. Documentación de Flujos

- Si un flujo es complejo (autenticación, navegación, etc.), documenta el flujo en un archivo `.md` dentro de la carpeta correspondiente.
- Incluye diagramas o pseudocódigo si es útil.

---

## 5. Buenas Prácticas Generales

- Prefiere comentarios descriptivos y útiles.
- Mantén los README y archivos de documentación actualizados.
- Usa inglés para código y español para documentación interna si el equipo lo prefiere.
- Los nombres de archivos y carpetas deben ser claros y descriptivos.

---

## 6. Ejemplo de Comentario Completo en un Componente

```tsx
/**
 * Componente de tarjeta de curso.
 * Muestra información resumida de un curso.
 *
 * @param {CourseCardListPureProps} props - Props del componente.
 * @returns {JSX.Element} Tarjeta de curso.
 */
export default function CardList({ course }: CourseCardListPureProps) { ... }
```

---
