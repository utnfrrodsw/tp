# Propuesta TP DSW

## Grupo

### Integrantes

- 46211 - Fonseca, José
- 45337 - Galcerán, Ignacio Agustín
- 42101 - Gómez, Fernando

### Repositorios

- [frontend app](https://github.com/IgnacioGalceran/DSW-Frontend)
- [backend app](https://github.com/IgnacioGalceran/DSW-Backend)

## Tema

### Descripción

Una aplicación de gestión de turnos médicos diseñada para facilitar la programación eficiente de citas entre médicos y pacientes. Simplifica el proceso de reserva, seguimiento y gestión de turnos médicos.

### Modelo

- [imagen del modelo](https://media.discordapp.net/attachments/1228818666917724160/1229193189638930504/image.png?ex=662eca5d&is=661c555d&hm=1dafa77d7932918b9440b9758271d3e47e64d2f404943c80c28511d2b53a7ede&=&format=webp&quality=lossless&width=438&height=676)

### Alcance Funcional

#### Alcance Mínimo

| Req               | Detalle                                                                                         |
| :---------------- | :---------------------------------------------------------------------------------------------- |
| CRUD simple       | 1. CRUD de Médicos<br>2. CRUD de Pacientes<br>3. CRUD de Turnos                                 |
| CRUD dependiente  | 1. CRUD de Especialidad médica {depende de} CRUD de Médicos                                     |
| Listado + detalle | 1. Listado de médicos con detalles completos<br> 2. Listado de pacientes con detalles completos |
| CUU/Epic          | 1. Reservar un turno médico<br>2. Confirmar un turno                                            |

#### Adicionales para Aprobación

| Req      | Detalle                                                                                                                                                                        |
| :------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CRUD     | 1. CRUD de Médicos <br> 2. CRUD de Pacientes <br> 3. CRUD de Turnos <br> 4. CRUD Tipo de turnos <br> 5. CRUD Especialidad médica <br> 6. CRUD Localidad <br> 7. CRUD Provincia |
| Listado  | 1. Visualizar historial de turnos médicos realizados<br>2. Lista de turnos pendientes de confirmación                                                                          |
| CUU/Epic | 1. Permitir a los pacientes reprogramar sus turnos <br> <br> 2. Permitir a los pacientes cancelar turnos                                                                       |

#### Alcance Adicional Voluntario

| Req      | Detalle                                                                                                                            |
| :------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| Listados | 1. Estadísticas de la carga horaria de los médicos basadas en la cantidad de turnos programados<br>2. Informe de tiempos de espera |
| CUU/Epic | 1. Enviar recordatorios de turnos a los pacientes por correo electrónico                                                           |
| Otros    | 1. Permitir a los médicos registrar notas, instrucciones de seguimiento al paciente. Permitir al paciente revisar dichas notas.    |
