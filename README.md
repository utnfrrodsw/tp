# TP DSW
tags: #dsw #tp

Status: Draft

## 1. Objetivo

Desarrollar en grupo una aplicación web full stack en base a un alcance propuesto por los integrantes.

Durante dicho desarrollo se deberá aplicar todo lo aprendido en la materia Desarrollo de Software.

## 2. Tema y Alcance
El grupo debe deberá proponer a los docentes un tema para el trabajo práctico de su preferencia utilizando la [plantilla de propuesta](proposal.md)

## 3. Requisitos
La aplicación debe:
1. Desarrollarse en 2 partes: Frontend y Backend; agnósticas entre si, comunicadas mediante una API.
2. Cumplir con los requisitos:  [técnicos](#3.1%20Requisitos%20técnicos) y [funcionales](#3.2%20Requisitos%20funcionales).
3. Desarrollarse en grupo utilizando metodologías de gestión de proyecto y llevar evidencia de ello.
4. Cumplir con las fechas de entrega estipuladas.
5. Utilizar github o gitlab para gestión del código fuente.
6. Realizar una defensa oral del trabajo práctico.
7. Presentar la [documentación](#3.3%20Documentación) durante la defensa.

### 3.1 Requisitos técnicos
La app cuenta con 2 partes: Backend y Frontend agnósticas entre si que se comunican mediante una API.

#### 3.1.1 Backend
El backend debe cumplir con las siguientes condiciones para regularidad y aprobación.

##### Regularidad
* Desarrollarse en JavaScript.
* Utilizar un framework web que permita integrarse a las demás.
* herramientas a través de middlewares, pluggins o modulos.
* Exponer una API web (rest, tRPC o gRPC) para interactuar con el frontend.
* Utilizar una base de datos persistente que acceda a través de un servicio externo (es decir que no sea una base de datos embebida).
* La persistencia a la base de datos debe realizarse mediante un mapper (ORM/ODM/OXM). En caso que la base de datos utilizada no tenga un mapper disponible para JavaScript se deberá implementar la persistencai utilizando un patron Repository.
* Realizarse mediante capas.
* Validar entrada de datos, manejar e informar apropiadamente los errores a través de la API.

##### Aprobación Directa o en Examen
* Cumplir con todas las condiciones de regularidad.
* Implementar 1 test automatizado por integrante.
* Implementar 1 test de integración.
* Implementar un login con autenticación propia o de third-party y al menos 2 niveles de acceso diferentes.
* Proteger las diferentes rutas en base al nivel de acceso requerido.
* Definir ambientes, ya sea mediante enviroment del framework o .env

#### 3.1.2 Frontend
El frontend debe cumplir con las siguientes condiciones para regularidad y aprobación.

##### Regularidad
* Desarrollarse utilizando un framework de Frontend.
* Utilizar HTML5
* Utilizar CSS según las directrices alguna biblioteca de componentes, guía de estilo o framework de CSS y la metodología propuesta por el framework de frontend elegido. Se sugiere el uso de biblioteca de componentes;  preprocesadores: sass, scss, less, stylus, etc o frameworks de css: Pico.css, Bulma, Material etc.
* Seguir buenas prácticas de UX/UI ( Que no requiera manual de usuario o explicaciones específicas para utilizar la interfaz )
* Las app debe mostrar las siguientes características entre sus componentes:
	* Reactividad ante un estado.
	* Input property
	* Output property
* Implementar al menos un servicio
* Incluir un readme con instrucciones para instalar y hacer funcionar el proyecto sin conocimientos de cómo está desarrollado.

##### Aprobación Directa o en Examen
* Cumplir con las condiciones de regularidad.
* Realizar al menos 1 test unitario de un componente.
* Realizar al menos 1 test de end-to-end.
* Implementar el login y proteger el acceso a las distintas partes del frontend en base a los niveles de usuarios del backend.
* Definir ambientes, ya sea mediante enviroment del framework o .env

### 3.2 Requisitos funcionales
La app debe cumplir con los siguientes requisitos.

#### Regularidad
* 1 CRUD Simple por integrante
* 1 CRUD Dependiente cada 2 integrantes o fracción.
* 1 Listado con filtro (al menos un atributo) cada 2 integrantes o fracción.
* Para cada listado, al seleccionar un elemento, se debe mostrar un detalle.
* Debe implementar un caso de uso de usuario o epic con valor para el negocio cada 2 integrantes. 

#### Aprobación Directa o en Examen
* CRUDs de todas las clases de negocio necesarias para el funcionamiento de la app.
* Implementar 1 caso de uso usuario o epic con valor para el negocio por cada integrantes. 
  Se deben implementar un mínimo de 2 relacionadas entre si. Es decir que la data registrada por uno CU o epic sirva de input para otro.

### 3.3 Documentación
La documentación debe presentarse para la instancia de defensa de aprobación.

Para conocer el detalle de la documentación referirse a [docs](docs.md).

## Gestión del proyecto

## Evaluación



![FAQ](FAQ.md)
