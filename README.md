# TP Frontend 2022

## 1 - Enunciado
### 1.1 - Desarrollo
Crear un nuevo frontend para un sitio que brinde una api pública, utilizando:
* Un framework de frontend. Se propone Angular pero se admitirán otros. Quienes quieran utilizar otro deberán consultar con los profesores antes de hacerlo.
* Utilizar html 5.
* Crear los css usando un framework (bootstrap, foundation, etc) o un preprocesador (less, sass, stylus).
* El backend debe ser una API RESTfull o GraphQL propuesta por los alumnos y aprobada por los docentes de la cátedra. Puede utilizarse la API del trabajo de backend. La aprobación debe darse por escrito por email o telegram.

### 1.2 - Funcionalidad
* Página principal que:
  * Al acceder a la página liste elementos (listado general, favoritos, recientes o cualquier otra condicion) sin filtro.
  * Incluya un search box que permita devuelva y muestre el listado de elementos filtrados por el contenido del search box.
  * El listado debe mostrar al menos un nombre o identificador del item y alguna información adicional ( por ejemplo un detalle resumido, una imagen o los primeros N caracteres del detalle).
  * Al hacer click en un ítem listado debe realizar un request para obtener información detallada del ítem y redirigir a una página de detalle donde muestre dicha información.
  * El listado no debe ser una simple grilla con filas, debe ser amigable al usuario y cada proveer contenido estructurado en forma no tabular (Por ejemplo mostrar una imagen y texto, mostrar texto en dos niveles, utilizar tooltip, etc).
* La página de detalle debe al menos mostrar:
  * Un identificador del ítem (por ejemplo un nombre)
  * Detalle
  * Contenido adicional (comentarios, reviews, opiniones, ratings)
  * Se recomienda incluir una imagen, un mapa, o algún elemento visual no textual.
* Ya sea desde uno de los listados o desde la página de detalle debe permitir realizar una acción de modificación de datos (post, put, delete)

### 1.3 - Planificación y documentación

#### 1.3.1 - Entregas
El equipo deberá planificar y patuar entregas del trabajo práctico con el equipo docente. Indicando las fechas de entrega el alcance y los criterios de aceptación.

Las mismas podrán volverse a pactar con los profesores enviando las correcciones a la misma indicando, causas, acciones correctivas que se tomarán y nuevo cronograma.

#### 1.3.2 - Reuniones de avance
A su vez deberán hacer reuniones periódicas para planificar las acciones a realizar y los responsables entre una reunión y otra. La periodicidad la definirán los miembros del equipo pero no podrá ser menor a 1 por semana.

En la misma deberán indicar: fecha de la reunión, asistentes y por cada asistente:
* Tareas completadas desde la última reunión
* Blockers
* Tareas a realizar hasta la próxima reunión
* A su vez si no se alcanzó lo planificado en la reunión anterior las acciones correctivas que se tomarán.

## 2 - Criterio de correccion
### 2.1 - Sitio
* Usabilidad del sitio: debe ser fácil de usar, elegante y no tener contenido oculto o difícil de acceder
* Diseño adecuado de la interfaz: uso apropiado de los tags html y de los estilos, ya sea utilizando un FW CSS o un preprocesador.
* Calidad del código: uso adecuado de las características del FW y de la API. Para Angular usar la guia de estilos oficial [Angular.io Styleguide](https://angular.io/guide/styleguide) [HTML CSS StyleGuide de google](https://google.github.io/styleguide/htmlcssguide.html)
* Completitud de los requerimientos.
* Debera pasar la validacion automatica al ejecutar `ng lint`
* Debera pasar la compilacion completa al ejecutar `ng build --prod`



### 2.2 - Planificación
* Progreso en las capacidades para planificar adecuadamente y tomar acciones correctivas.
* Adecuación de las entregas con tiempos y acciones.

### 2.3 - Repositorio
* El desarrollo deberá realizarse en una plataforma de git gratuita. Se recomienda GitLab o GitHub.
* Se evaluará el uso de git: Frecuencia y responsables de los commits, uso de branches y merge.
* La creación del repositorio debe hacerse mediante un fork del repositorio del trabajo práctico.

## 3 - Entrega final
La entrega final deberá hacerse enviando por email a los profesores la URL del repositorio de git.

En el archivo readme.md deberá indicarse, el trabajo, año de cursado e integrantes (legajo, nombre y apellido)

Fecha de entrega final: TBD


