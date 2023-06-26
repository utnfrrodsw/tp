# TP Desarrolo De Software 2023

**![](https://lh4.googleusercontent.com/ptjW-3iL9bTm5-C0QnpPKPrbyWRCVwPkUOvZBuJr4xk9ARJoB-mCguPI2OWRdajDE_Clo8_EcuzgCgXgnpppYL8HTSKqTSLk_Xk02xyIznusYUBmW0DocNbAnecqq-M3hW8DsDbdrfFq3C99JKxl_Qs)**

## GYM

 Integrantes:
 

 - LA BARBA HIPÓLITO 47313
   
  * EGUIAZÚ ROBMAN SOFIA 48141
   
   * MIRLENI ELISEO 47960
   
  *  SPINI SANTIAGO 49799
  

# Tema

Descripción: (2 a 6 líneas describiendo el negocio)

*Sistema de gestión de gimnasio*

El sistema permite llevar un mejor control acerca de las ventas dentro del local, registro de usuarios y sus respectivos estados con respecto al control de usuarios y registro de cuotas.

Los trabajadores ingresan los productos vendidos en el local.

Los trabajadores y el administrador pueden escribir posts

Los trabajadores asignan una rutina predeterminada al usuario.

Los trabajadores pueden marcar como abonado un mes de usuario

Los usuarios pueden abonar la cuota, ver su rutina, consultar su IMC recibiendo recomendaciones con respecto a su resultado.

El administrador tiene permitido realizar todas las funciones, dar de baja/alta los demás roles y ver estadísticas de ventas.

| Requerimiento  | Detalle                                                                 |
| -------------- | ----------------------------------------------------------------------- |
| Crud Simple        | - CRUD Actividad<br>-CRUD Rol<br>- CRUD Tipo Rutina<br>- CRUD Tipo Post                |
| Crud Dependiente        | -  CRUD Rutina { depende de } CRUD Tipo Rutina, CRUD Actividad, CRUD Persona<br>- CRUD Post { depende de } CRUD Tipo Post, CRUD Persona<br>-CRUD Post { depende de } CRUD Tipo Post, CRUD Persona                  |
|Listado + detalle        | - Rutinas y detalle de Tipo Rutina: listado de rutinas filtrado por tipo de rutina, muestra id, descripción de la rutina y del tipo y ejercicios ==> detalle CRUD Rutina<br>-Posts y detalle de Tipo Post: listado de posts filtrado por tipo de post, muestra id, autor, titulo, cuerpo y tipo y descripción de post ==> detalle CRUD Post<br>                     |
|CUU/Epic      | -Crear una rutina para una persona<br>- Realizar la inscripción a una actividad<br>                    |




```
