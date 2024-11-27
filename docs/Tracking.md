SEGUIMIENTO DE ALGUNOS ERRORES, BUGS Y COMPLICACIONES QUE TUVIMOS EN EL DESAROLLO DEL PROYECTO:


[1] Problema:
El dist no se actualizaba y debíamos copiar todo manualmente ya que
se creaba una subcarpeta dist en la carpeta dist.
[1.a] Solucion:
Crear el backend y el frontend en 2 carpetas separadas, borrar el dist y volver a ejecutar.


[2] Problema: No se conectaba a nuestra base de datos en la carpeta shared.
[2.a] Solucion: Actualización del nombre de nuestra base de datos sin usar un alias.


[3] Problema: No mostraba los valores correctamente cuando los solicitamos en el backend.
[3.a] Solucion:
                    {list | json}
                    {{sucursal | json}}


La solución es mostrarlo en formato JSON si no nos mostraba [OBJECT OBJECT].

[4] Problema:La forma en la que se conecta el backend con el frontend en angular, en la documentación de angular 17 con standalone false, y la forma en la que se escribe Ng Modules es diferente.
[4.a] Solucion: Agregando las rutas en el path de app routing modules
y la utilización de router outlet.

[5] Problema: Al asignar un participante a un equipo, nos encotramos con el problema de que al enviar la data, se sobreescribian los datos. Validando el tipo de participante y la cantidad que hay de cada uno de ellos en los equipos.
[5.a] Solucion: Creamos un arreglo, el cual va guardando los participantes que ya estan en el equipo, validando que se ingresen en cada equipo solo 2 delanteros, 2 defensas y 1 arquero. Enviando como data, dicho arreglo que se va cargando con los participantes que ya estaban en un equipo y el nuevo ingresante.
