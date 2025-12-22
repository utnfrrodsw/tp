## 1. Comentarios en el Código

### 1.1 Clases  

Utiliza JSDoc para describir el propósito, responsabilidades y contexto de uso de cada clase.

**Evita referencias a archivos físicos, usa siempre el nombre del símbolo exportado.**

```typescript
/**

* [NombreDeLaClase] - [Breve descripción de la clase]

*

* [Explicación de su responsabilidad principal, contexto de uso y cualquier detalle relevante]

*

* Ejemplo de uso:

* const instancia = new NombreDeLaClase();

*

* @see {@link OtroNombreDeClase} para lógica relacionada.

*/

export class NombreDeLaClase { ... }

```

**Ejemplo real:**

```typescript

/**

* BaseEntity class that serves as a base for all entities in the application.

*

* Contains common properties such as _id and id.

* Extend this class for all MongoDB entities.

*/

export abstract class BaseEntity { ... }

```

  

---
### 1.2 Funciones y Métodos


Describe qué hace la función, sus parámetros y el valor de retorno.

Usa `@param` y `@returns` para que TypeDoc los procese correctamente.


```typescript

/**

* [Breve descripción de la función]

*

* @param nombre - Descripción del parámetro.

* @returns Descripción del valor de retorno.

* @see {@link OtroMetodo} para operaciones relacionadas.

*/

function nombreFuncion(parametro: Tipo): Tipo { ... }

```

  

**Ejemplo:**

```typescript

/**

* Obtiene un estudiante por su ID.

*

* @param id - ID del estudiante.

* @returns El estudiante encontrado o null.

*/

async function getStudentById(id: string): Promise<Student | null> { ... }

```

  

---

  

### 1.3 Archivos sin Clases (solo funciones o constantes)

  

Cuando un archivo exporta solo funciones, tipos o constantes, agrega un bloque JSDoc al inicio usando `@module` para indicar el módulo y una breve descripción.

**No uses `@description` ni referencias a archivos.**

  

```typescript

/**

* @module models/institution

* Define utility functions for the institution module.

* @see {@link InstitutionService}

*/

```

  

---

  

### 1.4 Flujos y Lógica Compleja

  

Cuando un bloque de código implementa lógica compleja o un flujo importante, agrega un comentario explicativo antes del bloque.

**No uses `@link` para archivos, solo para símbolos exportados.**

  

```typescript

// Validación de datos de entrada antes de crear un nuevo curso.

// Si algún campo es inválido, retorna un error 400.

```

  

---

  

### 1.5 Qué etiquetas usar y cuáles evitar

  

- **Usa siempre:**

- `@module` para indicar el módulo lógico (ej: `@module models/professor`)

- `@see {@link NombreDeClase}` o `@see {@link nombreFuncion}` para referencias internas

- `@param` y `@returns` en funciones y métodos

  

- **Evita:**

- `@description` (TypeDoc no la reconoce, usa texto plano en el bloque)

- Referencias a archivos físicos (ej: `{@link ./archivo.ts}`), usa siempre símbolos exportados

- Etiquetas no estándar de JSDoc

  

---

  

## 2. Documentación de Carpetas y Módulos

  

Cada carpeta principal (`models`, `auth`, `shared`, etc.) debe tener un archivo `README.md` o `docs.md` explicando:

  

- El propósito de la carpeta/módulo.

- La estructura interna (subcarpetas y archivos relevantes).

- Cómo extender o modificar el módulo.

- Ejemplo de uso si aplica.

  

**Ejemplo para `models/course/README.md`:**

  

```markdown

# Módulo Course

  

Este módulo gestiona la lógica relacionada con los cursos.

  

## Estructura

  

- `course.controller.ts`: Controlador de endpoints de cursos.

- `course.entity.ts`: Definición de la entidad Course.

- `course.routes.ts`: Rutas de la API para cursos.

- `course.schemas.ts`: Esquemas de validación.

- `course.services.ts`: Lógica de negocio.

  

## Extensión

  

Para agregar una nueva funcionalidad:

1. Define el método en el service.

2. Expón el endpoint en el controller y las rutas.

3. Documenta el cambio en este archivo.

```

  

---

  

## 3. Estructura de Documentación Markdown

  

- Usa títulos claros y jerárquicos (`#`, `##`, `###`).

- Explica el propósito general al inicio.

- Detalla la estructura de archivos y carpetas.

- Incluye ejemplos de uso cuando sea relevante.

- Mantén los archivos `.md` actualizados con cada cambio importante.

  

---

  

## 4. Generación Automática de Documentación

  

Utiliza [TypeDoc](https://typedoc.org/) para generar documentación navegable a partir de los comentarios JSDoc.

  

**Pasos recomendados:**

1. Instala TypeDoc:

```

npm install --save-dev typedoc

```

2. Agrega un script en `package.json`:

```json

"scripts": {

"docs": "typedoc --out docs/api src/"

}

```

3. Genera la documentación:

```

npm run docs

```

  

---

  

## 5. Buenas Prácticas

  

- Sé claro, conciso y consistente.

- Documenta todo lo que no sea trivial.

- Actualiza la documentación junto con el código.

- Usa inglés para los comentarios técnicos, salvo que el equipo acuerde lo contrario.

- Usa siempre `@see {@link NombreDeClase}` o `@see {@link nombreFuncion}` para referencias internas, nunca rutas de archivo.

  

---

  

**La documentación clara y actualizada es clave para la colaboración y el éxito del proyecto.**