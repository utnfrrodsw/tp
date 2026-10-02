# Propuesta TP DSW

## Grupo
### Integrantes
* 53948 – Altamirano, Marianela Estefanía
* 54027 – Sayago, Valentina Nair

### Repositorios
* Frontend: https://github.com/dsw-2026/frontend
* Backend: https://github.com/dsw-2026/backend

## Tema: Adopción de Mascotas
### Descripción

Sistema de gestión de adopción de mascotas que conecta adoptantes con publicadores (refugios, rescatistas y hogares de tránsito) de toda la Argentina. Permite registrar usuarios, publicar animales disponibles y gestionar el proceso de postulación a una adopción. Su objetivo es agilizar el proceso de adopción y garantizar vínculos responsables.

### Modelo

 <img width="1282" height="1132" alt="MD-en drawio" src="https://github.com/user-attachments/assets/a3e3b28d-1731-4d8f-954d-c6bc5e8ab713" />


## Alcance Funcional

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Especie<br>3. CRUD Provincia|
|CRUD dependiente|1. CRUD Mascota {depende de} CRUD Publicador, CRUD Especie<br>2. CRUD Característica {depende de} CRUD Mascota<br>3. CRUD Localidad {depende de} CRUD Provincia|
|Listado<br>+<br>detalle|1. Listado de mascotas disponibles para adoptar filtrado por especie, muestra nombre, imagen, edad, tamaño, sexo, carácter, energía, vacunación y castración => detalle muestra datos completos de la mascota<br>2. Listado de solicitudes de adopción filtrado por estado, muestra mascota, adoptante, compatibilidad y estado => detalle muestra datos completos de la solicitud (mascota, adoptante y desglose de compatibilidad)|
|CUU/Epic|1. Solicitar adopción de una mascota<br>2. Publicar mascota en adopción|

Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD|1. CRUD Usuario<br>2. CRUD Localidad<br>3. CRUD Provincia<br>4. CRUD Adoptante<br>5. CRUD Publicador<br>6. CRUD Admin<br>7. CRUD Mascota<br>8. CRUD Especie<br>9. CRUD Característica<br>10. CRUD Solicitud|
|CUU/Epic|1. Solicitar adopción de una mascota<br>2. Publicar mascota en adopción<br>3. Gestionar solicitud (aprobar / rechazar)|

### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados|1. Listado de solicitudes propias del adoptante (historial), mostrando el estado de cada una (pendiente / aprobada / rechazada)|
|CUU/Epic|1. Cancelar una solicitud de adopción (por parte del adoptante)<br>2. Marcar mascotas como favoritas y consultarlas luego|
|Otros|1. Envío de email al adoptante confirmando la creación de su solicitud de adopción<br>2. Notificación al publicador cuando recibe una nueva solicitud sobre una de sus mascotas|

