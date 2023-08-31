# Reglas de trabajo

Este documento establece las reglas y convenciones de codificación que deben seguirse. El objetivo es garantizar la coherencia, la legibilidad y la facilidad de mantenimiento del código en todo el equipo de desarrollo.

## 1. Formato de Código

-   Utilizar indentación de 4 **espacios** para todos los lenguajes.
-   Usar espacios en lugar de tabulaciones.
-   Limitar la longitud de línea a 80 caracteres para mantener la legibilidad.
-   Usar Prettier Formatter. Soporta Javascript, TypeScript, HTML, CSS, JSON, etc.

## 2. Nomenclatura de Variables

-   Utilizar nombres descriptivos para variables y evitar abreviaturas poco claras.
-   Los nombres de variables deben estar en camelCase.
-   Evitar nombres de una sola letra, a menos que se estés usando contadores o estés en contextos muy específicos.
-   Las constantes deben estar en mayúsculas y si requieren espacios separadas por guiones bajos.
-   Para las variables booleanas usar un prefijo como "is", "has" o un verbo relevante que indique su propósito.

## 3. Comentarios

-   Usar comentarios para explicar el código complejo o confuso.
-   Mantén los comentarios actualizados. Si realizás cambios en el código, actualizá también los comentarios correspondientes.
-   Evitar comentarios obvios que no añaden información útil.
-   Utilizar comentarios FIXME para resaltar problemas específicos que necesitan ser abordados.
-   Usar comentarios TODO para indicar áreas de código que requieren atención o mejoras futuras.

## 4. Estructura del Código

-   Usar espacios entre operadores y elementos para mejorar la legibilidad.
-   Dividir el código en funciones o métodos coherentes y con un propósito específico, ni más ni menos.

## 5. Control de Versiones y Contribuciones

-   Cada cambio de código debe estar vinculado a un issue o tarea en el sistema de seguimiento.
-   Usar ramas separadas para nuevas características o correcciones de errores. 
-   Realizar un code review sobre los cambios realizados en el código entre los miembros del equipo para mantener la calidad del mismo.
-  Cada commit realizado deberá ser del tipo **#<id\> - <título> - <descripción>**. Para bugs o issues, el ID será según el bug tracker o se decide por el equipo. Si se trata de mantenimiento, usar **#00000 - <título> - <descripción>**.
-  Ponerse de acuerdo con el equipo para realizar usar Merge de Git con el fin de causar estragos en el código.

## 6. Pruebas Unitarias y Automatización

-   Escribir pruebas unitarias para todas las funciones y métodos clave del código.
-   Las pruebas unitarias deben ejecutarse automáticamente antes de la integración del código para mantener la calidad del software.
