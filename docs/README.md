Documentacion del proyecto

Proposal actualizado: https://github.com/Jorgemtzz98/tp_martinez.cordoba.rossi.ponce/blob/main/Proposal/proposal.md

Instrucciones de instalacion:
Clonar el repositorio de backend y frontend.
Usar npm install
Usar npm start para el front y npm run start:dev para el back, en el package.json estan todas las dependencias del trabajo y los scripts.
Correr el script de seed usando {npm run seed} para que se creen en la BD las especialidades y las obras sociales del backend.

Minutas de reunion y de avance:

En las primeras reuniones nos enfocamos en hacer el proposal, el DER y esquematizar todo lo que tenga que ver con el funcionamiento del sanatorio.
Luego empezamos con el backend donde lo primero que hicimos fue instalar mikro-orm y con una BD local y typescript empezamos a crear todas las entidades. Posteriormente seguimos 
creando los routers, controllers, y el app.ts en general, hicimos las funciones de find, add y remove para todas las entidades. Esta labor no nos conllevo casi ningun issue o bug ya que 
la hicimos apoyandonos de los videos que tiene la catedra DSW en youtube, gracias a estos videos pudimos configurar TS y hacer todo lo que comentamos recien de manera prolija y casi sin errores.

En las siguientes reuniones ya teniamos que empezar a probar que todo esto esté en funcionamiento por lo cual hicimos unos forms en el front basicos y temporales que eran solo de prueba, los usabamos solamente
para ver como se conectaba el front con el back y veiamos como se creaban las entidades, como se editaban y se borraban. De momento tampoco teniamos grandes problemas ya que era solo probar que todo esto funcione y no habia ningun tipo de validación por detras.
Una vez teniamos el back funcionando y el front hacia bien las peticiones (en este trabajo se uso axios para resolver ese tema) empezamos a borrar los formularios de prueba y a hacer forms mas realistas a lo que iba a ser el trabajo final. Acá nos encontramos el primer issue que nos dió mucho trabajo en resolver, pasaba que cuando haciamos una peticion por ejemplo en pacientes para listarlos nos traiamos un setPacientes(res.data) y en el front nos tiraba un error el cual hacia que ni siquiera podamos correrlo, despues de ver algunos videos encontramos que (por lo menos usando axios) ese res.data estaba devolviendo un objeto, no un array, lo que teniamos que hacer era poner (res.data.data) asi ese objeto accedia al data que tenia adentro que si era el array con todos los resultados adentro.
Luego de eso toco hacer los botones de editar y eliminar, usamos los mismos emojis y el mismo css para todos listados, en este momento nos topamos otro error y era que cuando en un turno queriamos cambiar el profesional le dabamos al boton de "guardar cambios" y aunque nos decia "turno editado con éxito" el profesional no se cambiaba, esto tambien nos llevo mucho tiempo en resolverlo, logramos dar con la resolución cuando nos dimos cuenta que el id de profesional se estaba pasando como un string pero en el back, en la parte de update de turno, no se estaba haciendo un find de profesional y comparando ese id que le llegaba con un id en la entidad de profesionales, luego de hacer ese pequeño cambio en el back pudimos seguir con el desarrollo.
Luego queriamos que un turno no se pueda crear dos veces con el mismo profesional, en la misma fecha y a la misma hora. Entonces lo que hicimos fue crear una funcion en el turno.controller la cual se llama getTurnosOcupados(), es una funcion bastante sencilla la cual hace un find en turnos pasandole como parametro el profesionalId y la fecha, entonces se crea un array de turnos que tengan ese profesional y esa fecha, luego de esa creamos un array el cual solo guarda las horas del array original, mandamos como res ese array llamado horasOcupadas y asi nos pudimos asegurar que un profesional no pueda tener dos turnos en la misma fecha y hora.

En las ultimas reuniones ya lo que hicimos fue darle estetica al home, a los listados, a los formularios y al navbar, creamos un menu hamburguesa para mobile y creamos un apartado de obras sociales con un carrusel sencillo el cual tiene todas las obras sociales asociadas del sanatorio con sus imagenes y nombres. Hicimos las validaciones que un paciente no pueda tener un dni que ya existe y que el profesional no pueda tener una matricula que ya existe, las dos validaciones mas "simples y directas" por asi decirlo se nos habian pasado por alto.

