# Propuesta TP DSW 

## Grupo
### Integrantes
* 42795 - Delbianco, Emanuel Iván
* 50275 - Panatti, Marina Andrea
* 50429 - Spitale, Camila

### Repositorios
* [Frontend App](https://github.com/Marina-Rookie/frontend-petguardian/tree/main)
* [Backend App](https://github.com/camilaspt/api-petguardian)

### Deployment
[PetGuardian](https://app-petguardian.vercel.app/login)

## Tema

### Descripción

PetGuardian es una aplicación diseñada para facilitar la conexión entre dueños de mascotas y cuidadores de confianza. Los usuarios pueden registrarse como clientes o cuidadores de mascotas. 
Los clientes tienen la posibilidad de registrar a sus mascotas en la plataforma y buscar cuidadores que se adapten a sus necesidades específicas. Una vez que encuentran un cuidador adecuado, pueden reservar los días necesarios y coordinar las visitas a su domicilio.
Para asegurar la calidad del servicio, todos los cuidadores son evaluados y aprobados por un administrador. Al final de la experiencia, los clientes pueden reseñar las visitas y asignar un puntaje al cuidador. PetGuardian es la solución ideal para aquellos que necesitan reservar cuidadores de mascotas cuando están fuera de casa.

### Modelo

![Modelo_de_Dominio_PetGuardian](https://github.com/user-attachments/assets/ae7b91ff-384a-460e-b106-99515413952e)




## Alcance Funcional

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD EtapaVida<br>3. CRUD TipoMascota<br>4. CRUD Estado|
|CRUD dependiente|1. CRUD Mascota {depende de} CRUD EtapaVida,  CRUD TipoMascota y CRUD Usuario<br>2. CRUD DisponibilidadCuidador  {depende de} CRUD Usuario<br>3. CRUD Reserva {depende de} CRUD Usuario, CRUD Estado y  CRUD Mascota<br>4. CRUD Resenia {depende de} CRUD Reserva <br>5. CRUD Turno {depende de} CRUD Reserva  |
|Listado<br>+<br>detalle| 1. Listado de mascotas. Detalles: nombre, tipo de mascota, etapa de vida, observaciones de comida, observaciones de enfermedades, otras observaciones y foto. <br> 2. Listado de cuidador. Detalles: puntuación y comentarios de las reseñas|
|CUU/Epic|1. Gestión de Usuario<br>2. Gestión de Masctotas<br>3. Consultar Cuidadores <br>4. Reservar Cuidador <br>5. Aprobar Reserva <br>6. Cancelar Reserva <br>7. Carga de Reseña <br>8. Aprobar Cuidador <br>9. Gestionar disponibilidad horaria del cuidador|

### Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD EtapaVida<br>3. CRUD TipoMascota<br>4. CRUD Estado|
|CRUD dependiente|1. CRUD Mascota {depende de} CRUD EtapaVida,  CRUD TipoMascota y CRUD Usuario<br>2. CRUD DisponibilidadCuidador  {depende de} CRUD Usuario<br>3. CRUD Reserva {depende de} CRUD Usuario, CRUD Estado y  CRUD Mascota<br>4. CRUD Resenia {depende de} CRUD Reserva <br>5. CRUD Turno {depende de} CRUD Reserva  |
|Listado<br>+<br>detalle| 1. Listado de mascotas. Detalles: nombre, tipo de mascota, etapa de vida, observaciones de comida, observaciones de enfermedades, otras observaciones y foto.<br> 2. Listado de cuidador.  Detalles: puntuación y comentarios de las reseñas|
|CUU/Epic|1. Gestión de Usuario<br>2. Gestión de Masctotas<br>3. Consultar Cuidadores <br>4. Reservar Cuidador <br>5. Aprobar Reserva <br>6. Cancelar Reserva <br>7. Carga de Reseña <br>8. Aprobar Cuidador <br>9. Gestionar disponibilidad horaria|

### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |-|
|CUU/Epic|-|
|Otros|1. Enviar notificación vía mail al crear un usuario.<br>2. Enviar notificación vía mail al cambiar los estados de la reserva.|

### Links Trello
[BackEnd](https://trello.com/invite/b/66020281ce119294245a4d9d/ATTId3162f8357137cdeb5c80ad67782ce17DD695109/back-pet-guardian)

[FrontEnd](https://trello.com/invite/b/66fc93a33e1bfe0d5b04d09e/ATTI12aac7cb3a06942ae62109240ce7602f91157EDD/front-pet-guardian)

### Video APP
[Video utilizando la app](https://drive.google.com/file/d/1RWAVZ28V57qF1fO3IsSPRupU6hvpXxHo/view?usp=drive_link)

### Videos Tests
[Videos de los tests implementados](https://drive.google.com/drive/folders/1Jf_8sOYq2uLyr11KEuAcK5jRxTPoSFdh?usp=drive_link)

### Documentación de API
[Documentación de la API realizada con Swagger(solo local)](http://localhost:3000/api-docs/#/)  
