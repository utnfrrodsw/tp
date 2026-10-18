Metodología del Proyecto

    # 1. Introducción

El desarrollo del proyecto se llevó a cabo siguiendo un enfoque ágil e iterativo, adaptando la organización del trabajo a las necesidades que fueron surgiendo durante el desarrollo.

El trabajo fue dividido en tareas pequeñas, concretas y asignables a los distintos integrantes del equipo. Cada tarea fue registrada y seguida mediante un tablero de gestión en Trello, permitiendo visualizar el estado de las actividades, distribuir responsabilidades y realizar un seguimiento del progreso general del proyecto.

La metodología utilizada fue evolucionando a medida que el proyecto creció, adaptándose a la cantidad de funcionalidades, al trabajo simultáneo de los integrantes y a la necesidad de mantener una estructura de desarrollo organizada.

    # 2. Enfoque de trabajo

El equipo adoptó un enfoque ágil e iterativo, en el cual el sistema se construyó progresivamente mediante la incorporación de nuevas funcionalidades y mejoras.

En lugar de desarrollar el sistema completo en una única etapa, el trabajo se dividió en diferentes tareas y funcionalidades que podían ser desarrolladas, probadas e integradas de manera independiente.

Este enfoque permitió:

Dividir funcionalidades complejas en tareas más pequeñas.
Distribuir el trabajo entre los integrantes del equipo.
Trabajar de manera paralela sobre diferentes partes del sistema.
Detectar y corregir problemas durante el desarrollo.
Incorporar cambios y mejoras a medida que avanzaba el proyecto.
Mantener un seguimiento del estado de cada tarea.

La metodología no se mantuvo estática durante todo el desarrollo, sino que fue ajustándose a medida que aumentaba la complejidad y cantidad de funcionalidades del sistema.

    # 3. Evolución de la estrategia de ramas

Durante la primera etapa del proyecto se utilizó una estrategia sencilla de ramas, en la cual cada integrante trabajaba principalmente sobre una rama asociada a su persona.

Esta organización resultó adecuada durante las primeras etapas, cuando la cantidad de funcionalidades desarrolladas simultáneamente era reducida.

Sin embargo, a medida que el proyecto comenzó a crecer, esta estrategia comenzó a dificultar la identificación de los cambios realizados y la relación entre el código y las tareas correspondientes.

Por este motivo, se decidió modificar la estrategia y comenzar a utilizar ramas asociadas a tareas específicas.

De esta manera, cada funcionalidad o tarea considerable e identificable cuenta con una rama propia, permitiendo relacionar de manera más clara:

Tarea → Rama → Cambios → Integración

Por ejemplo, las ramas pueden seguir una estructura similar a:

Feature/007-WorkOrderCreating
Feature/004-backend-restructuring

Esta organización permite identificar rápidamente el objetivo de una rama y facilita el seguimiento del desarrollo.

    # 4. Gestión y priorización de tareas

Las tareas del proyecto se gestionaron mediante Trello, donde se registraron las funcionalidades pendientes, tareas en desarrollo y actividades finalizadas.

La priorización se realizó teniendo en cuenta principalmente la dependencia entre funcionalidades y el flujo principal del sistema.

En el caso de nuestro proyecto, se tomó como eje principal el proceso relacionado con la creación y gestión de una orden de trabajo, debido a que representa uno de los procesos centrales del sistema.

A partir de este proceso se identificaron funcionalidades relacionadas y dependientes, priorizando aquellas que resultaban necesarias para poder continuar con el desarrollo de las siguientes etapas.

De esta manera, la planificación siguió una lógica similar a:

Proceso principal
       ↓
Funcionalidad necesaria
       ↓
Tareas relacionadas
       ↓
Implementación
       ↓
Pruebas e integración
       ↓
Nuevas funcionalidades

Esta forma de priorización permitió evitar desarrollar funcionalidades aisladas que todavía no contaran con los componentes necesarios para funcionar correctamente dentro del sistema.

    # 5. Seguimiento del desarrollo

El estado de las tareas fue gestionado mediante el tablero de Trello, permitiendo identificar qué actividades se encontraban pendientes, en desarrollo o finalizadas.

El tablero también permitió visualizar la distribución de las tareas entre los integrantes del equipo y mantener un registro de las problemáticas o actividades que fueron surgiendo durante el desarrollo.

La utilización de un tablero centralizado facilitó la coordinación del trabajo y permitió reducir la superposición de tareas entre los integrantes.

    # 6. Herramientas utilizadas

Durante el desarrollo se utilizaron diferentes herramientas para cubrir las necesidades de gestión, comunicación, desarrollo y diseño del proyecto.

    ## 6.1. GitHub

Se utilizó GitHub como plataforma para alojar y gestionar el código fuente del proyecto.

Además del almacenamiento del repositorio, se utilizó el control de versiones para registrar los cambios realizados durante el desarrollo y facilitar el trabajo colaborativo entre los integrantes.

La utilización de ramas permitió que los integrantes trabajaran de manera independiente sobre diferentes funcionalidades antes de integrar los cambios al código principal.

    ## 6.2. Trello

Se utilizó Trello como herramienta principal para la gestión y seguimiento de tareas.

El tablero permitió registrar:

Funcionalidades pendientes.
Tareas en desarrollo.
Tareas finalizadas.
Problemáticas detectadas.
Actividades relacionadas con el desarrollo.

De esta manera, Trello funcionó como un punto central para organizar el trabajo del equipo.

    ## 6.3. Discord y WhatsApp

Se utilizaron Discord y WhatsApp como medios de comunicación entre los integrantes del equipo.

Estas herramientas fueron utilizadas principalmente para:

Coordinar actividades.
Resolver dudas durante el desarrollo.
Comunicar problemas encontrados.
Coordinar reuniones.
Realizar reuniones de seguimiento y avance.
    ## 6.4. Visual Studio Code

Se utilizó Visual Studio Code como entorno de desarrollo integrado (IDE) para la implementación del proyecto.

La herramienta fue utilizada para desarrollar, modificar y revisar el código fuente tanto del frontend como del backend, además de facilitar la integración con las herramientas de control de versiones y desarrollo utilizadas en el proyecto.

    ## 6.5. Stitch IA

Se utilizó Stitch IA como herramienta de apoyo para la generación de propuestas de interfaces.

Las interfaces generadas fueron utilizadas principalmente como referencia y punto de partida para el diseño de las distintas vistas del sistema.

Las propuestas obtenidas mediante esta herramienta fueron posteriormente adaptadas a las necesidades funcionales y visuales específicas del proyecto, por lo que no se utilizaron necesariamente de forma directa.

    # 7. Control de versiones y trabajo colaborativo

El código fuente se gestionó mediante Git, utilizando GitHub como repositorio remoto.

Cada integrante pudo desarrollar funcionalidades de manera independiente mediante ramas específicas. Una vez finalizado el desarrollo de una tarea, los cambios fueron integrados al código principal del proyecto.

La utilización del control de versiones permitió mantener un historial de modificaciones y facilitar la identificación de los cambios realizados durante el desarrollo.

La estrategia adoptada buscó mantener una relación clara entre las tareas gestionadas y los cambios realizados sobre el código fuente.