# Propuesta TP DSW

## Grupo
### Integrantes
* 49841 - Chiesa, Máximo
* 50022 - Goya, Santiago
* 50221 - Marini, Luciano
* 50374 - Teglia Staseri, Lisandro

### Repositorios
* [Frontend MyRacing](https://github.com/goya02-ops/MyRacing-Frontend)
* [Backend MyRacing](https://github.com/goya02-ops/MyRacing-Backend)

## Tema
### Descripción
*Plataforma de simracing competitivo que conecta a pilotos virtuales con eventos organizados en distintos simuladores. Permite crear, gestionar e inscribirse a carreras, llevar un historial de resultados. Su objetivo es profesionalizar la experiencia del automovilismo virtual, combinando tecnología, comunidad y competitividad.*

### Modelo
![MD Carreras](https://github.com/user-attachments/assets/429112f9-b10d-4d08-ae8f-b4e2d0a49245)
https://drive.google.com/file/d/1r72gW-qDQekjdE1gyDHyM7gbv3EYp8JS/view?usp=sharing

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Simulador<br>2. CRUD Circuito<br>3. CRUD Disciplina<br>4. CRUD Usuario|
|CRUD dependiente|1. CRUD Combinación {depende de} CRUD Simulador, CRUD Circuito, CRUD Disciplina<br>2. CRUD Carrera {depende de} CRUD Combinación|
|Listado<br>+<br>detalle| 1. Listado de combinaciones con filtrado opcional por disciplina: muestra nombre, circuito y disciplina<br> 2. Listado de carreras: muestra fecha y hora del final inscripción, fecha y hora de inicio de la carrera, cantidad de vueltas y de paradas obligatorias, y un botón para la inscripción|
|CUU/Epic|1. Cargar circuito<br>2. Cargar simulador<br>3. Cargar disciplina<br>4. Cargar combinación<br>5. Registrarse<br>6. Iniciar sesión|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Simulador<br>2. CRUD Circuito<br>3. CRUD Disciplina<br>4. CRUD Combinación<br>5. CRUD Usuario<br>6. CRUD Carrera<br>7. CRUD Carrera del usuario<br>8. CRUD Membresía<br>9. CRUD Pago|
|CUU/Epic|1. Cargar circuito<br>2. Cargar simulador<br>3. Cargar disciplina<br>4. Cargar combinación<br>5. Cargar membresía<br>6. Registrase<br>7. Iniciar sesión<br>8. Pagar membresía premium<br>9. Inscribirse a carrera|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. Resultados de las carreras a las que el usuario se inscribió<br>|
