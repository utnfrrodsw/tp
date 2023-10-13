# TP DSW
Trabajo Practico de Desarrollo de Software UTN FRRO

## Integrantes:
- Fani, Nicolás  |  Legajo: 49449
- Fina, Gino  |  Legajo: 49721
- Sanchez, Franco Nahuel  |  Legajo: 49738
- Mongelos, Manuel  |  Legajo: 48959
- Zubiri, Joaquin  |  Legajo: 50206

## Repositorios
- [**FrontEnd**](https://github.com/fraancosan/gymScriptFE)
- [**BackEnd**](https://github.com/JoaquinZubiri/ServidorDSW)

## Descripción de Negocio
El gimnasio **“gymScript”** es un establecimiento dedicado a acompañar a sus miembros a conseguir una buena salud física y mental, mediante una gran variedad de servicios y actividades. El gimnasio ofrece diferentes planes de membresías que se adaptan a las necesidades y preferencias de los clientes.

## CRUD 
- CRUD de Clientes
- CRUD de Planes
- CRUD de Actividades
- CRUD de Entrenadores
- CRUD de Inscripción
- CRUD de Salones
- CRUD de Sedes
- CRUD de Cuotas
- CRUD de Artículos
- CRUD de Localidades 
- CRUD de Provincia
- CRUD de Horario
- CRUD de CheckIn

## Listado
- Listado de artículos de la tienda del gimnasio, filtrados por tipo de artículo (comida, bebida o suplementos) → Muestra nombre del artículo, y descripción del mismo.
- Listado de actividades del gimnasio, filtradas por plan → Muestra nombre de actividad, y descripción de la misma.
- Listado de entrenadores del gimnasio, filtrados por actividad → Muestra id del entrenador, nombre, y apellido del mismo.
- Listar sedes, filtradas por localidades → Muestra dirección de la sede.

## CUU
- Contratar plan de entrenamiento.
- Realizar check-in al llegar al gimnasio.
- Modificar actividades de un plan.
- Asignar entrenadores a actividades.
- Consultar el salón en el que se realiza una actividad determinada.

## Descripción modelo entidad relación:
El usuario contrata uno de los planes disponibles, el cual contiene una o más actividades.
Cuando el usuario contrata un plan, se crea una inscripción con una fecha de alta y una de baja, la cual se vencerá cuando no se paguen más las cuotas, las cuotas son cada 30 dias. Cada inscripción se realiza en una sede específica, la cual está ubicada en una localidad y está a su vez pertenece a una provincia. Las actividades son iguales para todas las sedes, dependiendo de la sede y la actividad seleccionada, se tendrá entrenadores específicos, a su vez los horarios y el salón en el que se realizarán depende también de la sede y la actividad. 
Cada cliente tendrá registrado un check in o registro de ingreso al gimnasio, en donde se validará que el socio exista y tenga una inscripción vigente.
El gimnasio cuenta también con muchos artículos disponibles, los cuales pueden ser comida, bebida o suplementos. Estos artículos son vendidos únicamente de manera física pero interesa mostrar a los clientes cuáles son mediante una página de internet.

## Link DER
https://drive.google.com/file/d/1P5hTo7BgIAT2n542mkwsYI71uelFhnp0/view?usp=sharing
