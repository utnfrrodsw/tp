![MasterHead](https://github.com/AlejoRetamal/TP-DdeS/blob/main/docs/assets/img/Documentation.jpg)

# 📄 Documentación

-   [📄 Documentación](#-documentación)
    -   [Instrucciones de Instalación](#instrucciones-de-instalación)
    -   [Pull Requests](#pull-requests)
    -   [Gestión del Proyecto](#gestión-del-proyecto)
    -   [Documentación de la API](#documentación-de-la-api)
    -   [Evidencia de Ejecución de Test Automáticos](#evidencia-de-ejecución-de-test-automáticos)
    -   [Demo de la Aplicación en Video](#demo-de-la-aplicación-en-video)
    -   [Deploy](#deploy)

## Instrucciones de Instalación

...

## Pull Requests

...

## Gestión del Proyecto

Para la gestión del proyecto utilizamos una combinación de las herramientas de proceso **Scrum** y **Kanban**.

-   Para consultar más información acerca de cómo gestionamos el proyecto, incluyendo las **minutas de reunión** y el **seguimiento de características, errores y problemas**, visite el siguiente enlace: 💼 [Gestión del Proyecto](https://github.com/AlejoRetamal/TP-DdeS/blob/main/docs/gesti%C3%B3n%20del%20proyecto/README.md)

## Documentación de la API

<details>
 <summary><h3>Introducción</h3></summary>

Nuestra API Rest de Prosefy ofrece un conjunto completo de operaciones **CRUD** (Crear, Leer, Actualizar y Borrar) para una variedad de recursos clave, incluyendo:

-   Libros.
-   Autores.
-   Categorías.
-   Usuarios.
-   Provincias.
-   Editoriales.
-   Localidades.
-   Reseñas.
-   Ofertas.
-   Pedidos.
-   Envíos.

También proporcionamos funcionalidades avanzadas para buscar libros, realizar pedidos y gestionar cuentas de usuario de manera segura.</details>

<details>
 <summary><h3>Requisitos</h3></summary>
 ...
 </details>

<details>
 <summary><h3>Autenticación y Seguridad</h3></summary>

La seguridad es una de nuestras principales prioridades. Implementamos un sólido sistema de autenticación para proteger las rutas y los recursos relacionados con los usuarios. Utilizamos la biblioteca `bcrypt` para el hash y la sal de las contraseñas, garantizando así que las contraseñas de los usuarios estén protegidas adecuadamente. También utilizamos `Passport.js` para gestionar la autenticación de manera eficiente y segura.

<!-- TODO: Implementar Passport.js para gestionar la autenticación  -->

</details>

<details>
 <summary><h3>Validación de Datos</h3></summary>

La API realiza una exhaustiva validación de datos de entrada para garantizar que los datos proporcionados sean correctos y cumplan con los requisitos. Esto incluye la validación de campos obligatorios, formatos numéricos y patrones específicos.

<h4>Usuarios</h4>

La validación de datos para los campos de usuario se realiza de la siguiente manera:

-   **Correo electrónico:** Debe ser una dirección de correo electrónico válida y única.
-   **Contraseña:** Debe tener al menos 8 caracteres, incluyendo al menos una letra mayúscula y una letra minúscula.</details>

<details>
 <summary><h3>Rutas API</h3></summary>
 ...
 </details>

<details>
 <summary><h3>Objetos de Respuesta JSON</h3></summary>
 ...
 </details>

<details>
 <summary><h3>Ejemplos de Uso</h3></summary>
 ...
 </details>

<details>
 <summary><h3>Notas Adicionales</h3></summary>
 ...
 </details>

## Evidencia de Ejecución de Test Automáticos

...

## Demo de la Aplicación en Video

Se ha creado un video demostrativo de la aplicación, que muestra su funcionalidad y características principales.

[Enlace a Video]

## Deploy

...
