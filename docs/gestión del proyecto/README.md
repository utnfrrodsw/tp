# 🗃️ Gestión del Proyecto

- **Enlace al proyecto:** www.github.com/users/MVRU/projects/1
- [Minutas de Reunión y Avances](https://github.com/AlejoRetamal/TP-DdeS/blob/66336071a9c7693da01b10dbd6f107c44bb76ea2/docs/gesti%C3%B3n%20del%20proyecto/minutas/README.md)
- [Tracking de Features, Bugs e Issues](https://github.com/AlejoRetamal/TP-DdeS/blob/66336071a9c7693da01b10dbd6f107c44bb76ea2/docs/gesti%C3%B3n%20del%20proyecto/tracking/README.md)

## 🔰 Metodologías Utilizadas

Para la gestión del proyecto utilizamos una combinación de las herramientas de proceso **Scrum** y **Kanban**, ya que consideramos que la unión de ambas nos permite encontrar un equilibrio en nuestro seguimiento, evitando que sea demasiado restrictivo y difícil de implementar como XP, o demasiado adaptativo como Kanban. Así, nuestro flujo de trabajo utilizando GitHub Projects consiste en los siguiente:

<details>
 <summary><h3>Prácticas de Scrum implementadas</h3></summary>

  1. El flujo de trabajo se dividirá en diferentes iteraciones ("sprints" en terminología Scrum) que serán reflejadas en GitHub como "Milestones" o hitos. **<sup>[1]</sup>**

  2. Al final de cada sprint, se llevará a cabo una reunión virtual por Discord para revisar el trabajo realizado, si se está conforme con el mismo, se planea el siguiente sprint (una mezcla de **Sprint Review** y **Sprint Planning**). **<sup>[2]</sup>**

  3. Cuando se finaliza un sprint, se limpia el tablero y se iniciará un nuevo sprint.

  4. No se pueden añadir nuevas tareas/spikes en el Sprint Backlog en medio de una iteración.

  5. Se incorporó una tabla específica para pilas de producto (o Product Backlog) que se trata de una lista de elementos que se desea completar en futuros sprints. Es decir, no se trabajará en estos en la iteración actual.

  6. Si se desea incorporar un elemento del Product Backlog al sprint actual, se agregará en la columna Sprint Backlog, donde se recopilarían la lista de tareas/spikes pendientes a abordar durante el sprint actual.

  7. Cada elemento del Sprint Backlog tendrá una prioridad y un tamaño. Además, estará conformado por microtareas para obtener mayor claridad, distribuir la carga de trabajo de manera más equitativa y evitar la sensación de abrumación.</details>

<details>
 <summary><h3>Prácticas de Kanban implementadas</h3></summary>

  1. En el estado de **"En proceso"**, no podrán haber más de 2 tareas/spikes al mismo tiempo (_límite del WIP directa por estado_).

  2. No habrán roles prescritos (una práctica de Scrum).

  3. Los elementos del Sprint Backlog no tendrán un nombre o estructura predefinida, como en el caso de Scrum que suelen usarse Historias de Usuario (User Stories).

  4. Cada elemento del Sprint Backlog (task/spike) será incorporado en el Tablero Kanban como una tarjeta.</details>

> **[1]** No habrá tiempo fijo en las iteraciones, **solo fechas tentativas**. Idealmente, no durarán más de 4 semanas.
>
> **[2]** No llevaremos a cabo Daily Scrums (reuniones diarias) ya que no lo consideramos necesario.

## 🎯 Sprints del Proyecto

<details>
 <summary><h3>💠 Sprint #1: Prototipos y Diseño Básico <i>(~2 semanas)</i></h3></summary>

- **Descripción:** Se elaborarán prototipos y se diseñará la estructura de navegación y los elementos de la página web. Se llevarán a cabo pruebas básicas para validar su funcionalidad y presentación en diferentes dispositivos y navegadores.

- **Objetivos:**

  - Elaborar diferentes prototipos hasta obtener uno que se ajuste a nuestras expectativas para la página web.
  - Realizar el diseño básico de la página web, incluyendo la estructura de navegación y la disposición de elementos.
  - Realizar pruebas básicas de funcionalidad y presentación para validar que la página web cumple con los requisitos iniciales y que se muestra correctamente en diferentes dispositivos y navegadores.
  - Asegurar que la configuración inicial esté lista para continuar con los siguientes sprints.

- **Sprint Backlog:**
  1. Elaborar prototipos.
  2. Diseñar la estructura de navegación.
  3. Desarrollo front-end del prototipo.
  4. Realizar pruebas básicas de funcionalidad y presentación.</details>

## 📖 Glosario

<details>
 <summary><h3>SCRUM</h3></summary>

- **Incremento:** Resultado final de un sprint que agrega valor al producto y es potencialmente entregable.
- **Historias de usuario:** Descripciones breves de funcionalidades o requisitos desde la perspectiva del usuario o cliente.
- **Product Backlog:** Lista priorizada de funcionalidades, requisitos y mejoras del producto, gestionada por el Product Owner.
- **Scrum diario:** Reunión corta y diaria en la que el equipo de desarrollo sincroniza actividades, identifica obstáculos y planifica el trabajo para el próximo día.
- **Sprint Backlog:** Lista de elementos seleccionados del Product Backlog para trabajar durante el sprint actual.
- **Sprint Planning:** Reunión en la que el equipo de desarrollo selecciona las tareas a realizar durante el próximo sprint y planifica cómo llevarlas a cabo.
- **Sprint Review:** Reunión al finalizar el sprint, en la que el equipo de desarrollo muestra el trabajo completado y recibe retroalimentación de los stakeholders.
- **Spike:** Actividad de investigación y exploración que se realiza para obtener información adicional antes de abordar una tarea específica.
- **Sprint o iteración:** Intervalo de tiempo fijo durante el cual se desarrolla un incremento del producto.
- **Task o tarea:** Unidad de trabajo específica y tangible que se debe realizar para completar un elemento del Sprint Backlog.</details>

<details>
 <summary><h3>KANBAN</h3></summary>

- **Columna:** Son las diferentes etapas o estados por los que pasa una tarjeta en el tablero Kanban. Por ejemplo, "Por hacer" (Sprint Backlog), "En progreso", "Revisar" y "Completado" son las columnas que utilizaremos.
- **Límite de trabajo en progreso (WIP):** Es el número máximo de tarjetas que se permiten en una columna específica. El WIP ayuda a controlar el flujo de trabajo y evitar la acumulación excesiva de trabajo en una etapa determinada.
- **Tarjeta:** Es una unidad de trabajo que se visualiza en el tablero Kanban. Cada tarjeta representa una tarea o un elemento de trabajo y contiene información relevante, como descripción, fecha límite y responsable.
- **Tablero Kanban:** Es la representación visual del flujo de trabajo, generalmente dividido en columnas que representan las diferentes etapas o estados de las tareas.</details>
