# Propuesta TP DSW

## Grupo
### Integrantes
* 53948 – Altamirano, Marianela Estefanía
* 54027 – Sayago, Valentina Nair
* 54207 – Spirce, Yasmín
 
### Repositorios
* Frontend: https://github.com/dsw-2026/frontend
* Backend: https://github.com/dsw-2026/backend

## Tema: Adopción de Mascotas
### Descripción

Sistema de gestión de adopción de mascotas que conecta adoptantes con publicadores (refugios y rescatistas) de toda la Argentina. Permite registrar usuarios, publicar animales disponibles y gestionar el proceso de postulación a una adopción. Su objetivo es agilizar el proceso de adopción y garantizar vínculos responsables.

### Modelo
<img width="1141" height="971" alt="Modelo_de_Dominio_Version_3" src="https://github.com/user-attachments/assets/50955df6-1e20-4079-b9a6-c63e43ccea5b" />

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Especie <br>3. CRUD Provincia|
|CRUD dependiente|1. CRUD Mascota {depende de} CRUD Publicador, CRUD Especie <br>2. CRUD Característica {depende de} CRUD Mascota|
|Listado<br>+<br>detalle| 1. Listado de mascotas disponibles para adoptar filtrado por especie, muestra nombre, imagen, edad, tamaño, sexo, caracter, energia, vacunación y castración => detalle muestra datos completos de la mascota<br> 2. Listado de solicitudes de adopción en proceso, filtrado por fecha descendente, muestra código de solicitud, nombre adoptante, nombre publicador, días transcurridos desde fecha solicitud => detalle CRUD Solicitud|
|CUU/Epic|1. Solicitar adopción de una mascota<br>2. Publicar mascota en adopción|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Usuario<br>2. CRUD Localidad<br>3. CRUD Provincia<br>4. CRUD Adoptante<br>5. CRUD Publicador<br>6. CRUD Mascota<br>7. CRUD Especie<br>8. CRUD Característica<br>9. CRUD Solicitud <br>|
|CUU/Epic|1. Solicitar adopción de una mascota<br>2. Publicar mascota en adopción<br>3. Adoptar una mascota|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |-|
|CUU/Epic|-<br>-|
|Otros|-|

