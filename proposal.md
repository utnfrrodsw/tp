# Propuesta TP DSW

## Grupo
### Integrantes
* 48615 - Miño, Jeremias

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab/Frontend-Chatbot-DSW)
* [backend app](http://hyperlinkToGihubOrGitlab/Backend-Chatbot-DSW)

## Tema
### Descripción
El proyecto consiste en una **aplicación web** que permite a los empleados de la empresa **consultar información sobre procesos internos** utilizando un modelo tipo ChatGPT a través de la API de OpenAI. El sistema tiene como objetivo **empoderar la lectura y navegación de documentos internos**, proporcionando respuestas precisas y contextualizadas. Además, registrará consultas, configuraciones de modelos, roles de usuarios y controlará el acceso de manera segura.

### Modelo
![imagen del modelo]([Link al Diagrama de Clases/DER aquí])

*Nota*: El diagrama debe incluir las entidades principales: **Usuario**, **Conversacion**, **Mensaje** (dependiente de Conversacion), y **ConfiguracionIA**.

## Alcance Funcional 

### Alcance Mínimo (1 Integrante)

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple (1)|1. CRUD **Usuario**|
|CRUD dependiente (1)|1. CRUD **Mensaje** {depende de} CRUD **Conversacion** (un mensaje pertenece a una conversación)|
|Listado<br>+<br>detalle (1)|1. Listado de **Conversaciones** filtrado por **Usuario** y **Fecha de Inicio**, muestra usuario, configuración de IA usada y fecha => detalle muestra la **Conversación completa** con todos los **Mensajes** asociados.|
|CUU/Epic (1)|1. **Iniciar y Gestionar una Conversación**: El usuario selecciona una **ConfiguraciónIA** (modo, segun su rol, si es administrador puede cambiar mas parámetros), inicia la conversiacioon, el backend llama a la API, guarda el mensaje enviado y la respuesta recibida.|


Adicionales para Aprobación (1 Integrante)
|Req|Detalle|
|:-|:-|
|CRUD (todos)|1. CRUD **Usuario**<br>2. CRUD **Conversacion**<br>3. CRUD **Mensaje**<br>4. CRUD **ConfiguracionIA** (para administrar modelos y parámetros)|
|CUU/Epic (Mínimo 2 relacionados)|1. **Iniciar y Gestionar una Conversación** con la IA, con persistencia del historial.<br>2. **Administrar las Configuraciones de IA**: Permite al administrador crear, editar y seleccionar los diferentes modelos y parámetros de la API (e.g. `Temperatura`, `Modelo`, `Tokens`) a utilizar en una nueva conversación. (Se relaciona con el CUU 1 al proveer el input de la configuración requerida).|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. **Métricas de Uso**: Listado de las Configuraciones de IA más utilizadas, filtrado por rango de fecha, con detalle de los usuarios que la usaron. |
|CUU/Epic|1. **Exportar Historial**: Permite al usuario exportar el historial completo de una conversación específica en formato TXT o PDF.<br>2. **Restricción por Rol**: Limitar el uso de ciertas **ConfiguracionesIA** (e.g., modelos costosos) solo a ciertos roles de usuario.|
|Otros|1. Implementación de **autenticación y protección de rutas** Login + JWT + protección de rutas según rol (admin/usuario) mediante tokens (JWT).|