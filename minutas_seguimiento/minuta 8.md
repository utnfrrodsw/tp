# Minuta 8

**Período de la Minuta:** 21/01/2026 - 18/03/2026  
**Fecha de Generación de la Minuta:** 24/01/2026  
**Modalidad de Trabajo:** Sincrónica (Reunión Virtual) / Asincrónica (Trabajo Separado)

---

## 1. Asistentes / Participantes

**21/01/2026 (Reunión Virtual):**

- `Achares, Jonatan Francisco Angel`
- `Correa, Martiniano León`
- `Varrenti, Lara`

---

## 2. Temas Tratados y Decisiones Clave

- **21/01/2026- Reencuentro y planteo de nuevos objetivos:**

  - **Tema:** Reiniciamos el desarrollo del proyecto para este año fijando los proximos objetivos.
  - **Decisión:** Se detallaron los objetivos a corto y mediano plazo. 
  - **Acciones Pendientes:** Se acordó comenzar el traspaso de JavaScript a TypeScript para luego hacer la transición de Sequelize a MikroORM.

---

## 3. Avances del Proyecto

### 3.1. Frontend

- **Cambios Realizados:**

  - Se corrigió la ruta del logo en el Sidebar para cargar correctamente desde public.
  - Se adaptó el Dashboard de alumno a la nueva estructura de respuesta del backend (curso y dictados anidados).
  - Se mejoró el filtrado de dictados por curso para mantener compatibilidad con estructuras nuevas y anteriores.

- **Adiciones:**

  - Validaciones al leer respuestas de la API para evitar errores cuando cambia el formato.
  - Ajustes de lectura de dictadosData.data en lugar de asumir arrays directos.


- **Sustracciones:**

  - Se eliminaron rutas relativas incorrectas para recursos estáticos.
  - Se eliminaron supuestos de estructura plana en los datos recibidos del backend.

### 3.2. Backend

- **Cambios Realizados:**

  - Avance fuerte en la migración de JavaScript a TypeScript en controladores, servicios, middlewares y utilidades.
  - Migración progresiva de Sequelize a MikroORM, incluyendo configuración central, contexto por request y adaptación de consultas.
  - Refactor de módulos funcionales (curso, evaluación y dictado) para trabajar con entidades y relaciones de MikroORM.
  - Actualización del sistema de seeders al nuevo esquema, con datos de prueba alineados a entidades y relaciones actuales.

- **Adiciones:**

  - Incorporación de dependencias de MikroORM (core, mysql, reflection, cli y seeder) y tipados TypeScript necesarios.
  - Creación y ajuste de archivos de configuración para inicialización y cierre del ORM, y middleware de contexto de request.
  - Nuevos seeders con datos de docentes, alumnos, dictados y exámenes, incluyendo IDs explícitos para consistencia.
  - Tipado global de request para disponer de EntityManager y mejoras de robustez en parseo/validación de parámetros.
  - Migración de sanitización de datos y manejo de errores a TypeScript con manejo específico para excepciones de MikroORM.

- **Sustracciones:**

  - Eliminación de archivos legacy de JavaScript de módulos ya migrados.
  - Eliminación del punto de entrada y artefactos de inicialización basados en Sequelize.
  - Eliminación de seeders antiguos dependientes de Sequelize CLI.
  - Desacople de patrones antiguos de acceso a datos para consolidar el enfoque Data Mapper con MikroORM.

---

## 4. Nuevas Tecnologías / Herramientas Exploradas o Integradas

- **Lenguaje TypeScript:** Comenzamos a utilizar el lenguaje tipado de JavaScript que mejora la mantenibilidad y la detección temprana de errores. 
- **MikroORM:** ORM nativo para TypeScript que conecta con la base de datos utilizando el patrón Data Mapper, manejo de entidades/relaciones y contexto por request para una persistencia más robusta.

---

## 5. Obstáculos / Desafíos Identificados

- **Idea inicial de transición de ORM:** Tras la entrega de la regularidad se encontraron múltiples vulnerabilidades con el uso de Sequelize por lo que se toma la decisión de utilizar MikroORM, afrontando los desafíos que conlleva esta transición (cambio de patrón de entidades y de lenguaje).  
- **Transición tecnológica integral (JavaScript/Sequelize a TypeScript/MikroORM):** La migración simultánea de lenguaje y ORM incrementó la complejidad técnica y exigió refactorizar controladores, servicios, middlewares y configuración de persistencia sin afectar la continuidad del sistema.
- **Compatibilidad entre capas backend y frontend:** Los cambios en la estructura de datos (pasaje de campos planos a relaciones anidadas) obligaron a ajustar el consumo de API en frontend para evitar regresiones funcionales y errores de renderizado.


## 6. Próximos Pasos y Objetivos para la Siguiente Minuta

- **Comprobar correcto pasaje de ORM:** Procurar que la transición de ORM no vulnere la funcionalidad del sistema.

  - **Responsable(s):** Todos los integrantes.
  - **Fecha Límite Sugerida:** 20/02/26

## 7. Anexos / Referencias

- 

---
