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
