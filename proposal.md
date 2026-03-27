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

### Modelo de dominio
<img width="791" height="955" alt="ModeloDominio" src="https://github.com/user-attachments/assets/dc45d07b-98f8-40e8-bb37-e97abf0cbbe0" /><br>
Enlace a Draw IO: https://drive.google.com/file/d/1r72gW-qDQekjdE1gyDHyM7gbv3EYp8JS/view?usp=sharing

### Diagrama de Entidad - Relación
<img width="1165" height="1247" alt="DER - MyRacing" src="https://github.com/user-attachments/assets/f18a4508-21f6-48c5-b2f2-fa6326c2220a" /><br>
Enlace a Draw IO: https://drive.google.com/file/d/1NLlt48m_9nrwYKXjhb4iLp0q-1TZbcka/view?usp=sharing

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Simulador<br>2. CRUD Categoría<br>3. CRUD Circuito<br>4. CRUD Usuario|
|CRUD dependiente|1. CRUD Versión_Categoría {depende de} CRUD Simulador, CRUD Categoría<br>2. CRUD Versión_Circuito {depende de} CRUD Simulador, CRUD Circuito<br>3. CRUD Combinación {depende de} CRUD Versión_circuito, CRUD Versión_Disciplina<br>4. CRUD Carrera {depende de} CRUD Combinaión|
|Listado<br>+<br>detalle| 1. Listado de combinaciones con filtrado opcional por disciplina: muestra nombre, circuito y disciplina<br> 2. Listado de carreras: muestra fecha y hora del final inscripción, fecha y hora de inicio de la carrera, cantidad de vueltas y de paradas obligatorias, y un botón para la inscripción|
|CUU/Epic|1. Cargar circuito<br>2. Cargar simulador<br>3. Cargar disciplina<br>4. Cargar combinación<br>5. Registrarse<br>6. Iniciar sesión|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |01. CRUD Simulador<br>02. CRUD Circuito<br>03. CRUD Categoría<br>04. CRUD Version_Circuito<br>05. CRUD Version_Categoria<br>06. CRUD Combinación<br>07. CRUD Usuario<br>08. CRUD Carrera<br>09. CRUD Carrera del usuario<br>10. CRUD Membresía<br>11. CRUD Pago|
|CUU/Epic|1. Cargar circuito<br>2. Cargar simulador<br>3. Cargar disciplina<br>4. Cargar combinación<br>5. Cargar membresía<br>6. Registrase<br>7. Iniciar sesión<br>8. Pagar membresía premium<br>9. Inscribirse a carrera|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. Resultados de las carreras a las que el usuario se inscribió<br>|
