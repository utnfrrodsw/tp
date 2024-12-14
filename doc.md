# Repositorios #
- [frontend app](https://github.com/angelofaraci/tp-dsw-frontend "frontend app")
- [backend app](https://github.com/angelofaraci/tp-dsw-backend "backend app")
 
# Tema #
## Descripción ##
Realización de una página web de reseña de videojuegos hechas por usuarios, donde se ofrece información de cada videojuego reseñado y recomendaciones para los usuarios que facilite la elección de su próximo juego.
## Modelo ##
![Modelo de Dominio](https://github.com/angelofaraci/tp/blob/db26bb9a40f49eabd76474fadd07283ecde9d922/ModeloDominio.png)

## Alcance Funcional ##
Casos de uso:

- CUU 1.1: Reseñar juego.
- CUU 2.1: Modificar nivel usuario.

CRUD:

-	CRUD Juego
-	CRUD Usuario
-	CRUD Empresa
-	CRUD Reseña
-	CRUD Administrador
-	CRUD Nivelación
-	CRUD Interacción
-	CRUD Categoría


## Alcance Adicional Voluntario ##
Listado:

-	Listado de usuarios filtrados por nivel. Muestra ID_Usuario, Nombre y Puntuación. Detalle muestra listado de reseñas.
-	Listado de reseñas muestra Nombre(Juego) ID_Reseña, Puntuación, Fecha_Redaccion y Estado. Detalle muestra Cuerpo e Interacciones.

## Instrucciones de instalación ##
Comenzamos instalando npm siguiendo las instrucciones de [ésta página](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) dependiendo de nuestro sistema operativo. Se recomienda, además, instalar pnpm siguiendo [éstas instrucciones](https://pnpm.io/installation).
Luego, instalamos Angular CLI corriendo el siguiente comando en la terminal/Powershell:

    npm install -g @angular/cli

En Windows, antes de esto, debemos activar la ejecución de scripts con este comando:

    Set-ExecutionPolicy -Scope CurrentUser ExecutionPolicy RemoteSigned

Ahora debemos clonar los repositorios en una carpeta corriendo los siguientes comandos en el git bash o en la terminal:

    git clone https://github.com/angelofaraci/tp-dsw-backend.git

    git clone https://github.com/angelofaraci/tp-dsw-frontend.git

Seguimos con la instalación de MongoDB en [este enlace](https://www.mongodb.com/docs/manual/installation/).
Una vez terminemos con lo anterior, abrimos dos terminales, una en la carpeta del backend y otra en la del frontend. En la del backend ingresamos el comando

    pnpm install

Ya tenemos el proyecto instalado, si lo queremos correr usamos, en la carpeta del backend, el comando 

    pnpm start:dev
y en la del front usamos

    ng serve

# Fechas: #
30/08
Inicialización del front.

31/08
Cambio de tarjetas por Carrousel. Creacion de utilidades.

03/09
Diseño del LogIn

05/09
Prototipo del SignUp

15/09
Tarjetas en el front

16/09
Inicialización de lógica de User en back. Creacion del AuthService

17/09
Añadida la lógica de login tanto en back como en front. Creacion y armado del SignUp. Intento de conexión con el backend.

18/09
ABM de Review fue adaptado a mongoDB.

21/09
Mejoramos el backend creando los ABMs de game utilizando la base de datos y definimos correctamente el método GetUserData. Aplicamos este último método en el front end para correctamente recibir los datos del User y mostrarlos como placeholder de lo que será la página del perfil. Creacion del GamePage.

23/09
Actualizamos Review pues decidimos agregar typegoose para utilizar tipos de manera más cómoda.

27/09
Comentamos el backend y empezamos a investigar para realizar el front de perfil de usuario. 

28/09
ABM de Company inicializado.

29/09
Cambios en atributos de Review y User para poder hacer join (populate). Cambios en el perfil de User e inicio de diseño del GamePage.

08/10
Cambios en atributos de Review y Game para poder hacer join(populate).

12/10
Cambios en Reviews. Inicio de la logica para creacion de Review desde frontend.

13/10
Avances en el post de una Review, se eliminaron funcionalidades innecesarias. Logica del front para cargar una Review con Servicios.

14/10
Creamos los abms de Admin, Leveling e Interaction.

15/10
Logica para encontrar Reviews de un Game. Verificacion entre Review, User y Game. Logica para encontrar todas las Reviews de un Game y verificar que el User tenga o no una.

22/10
Calculo de score sobre un Game.

23/10
Creacion del metodo para cambiar level del User (ChangeLevel). Creacion de los componentes para el Admin en frontend.

24/10
Logica para la recuperacion de juegos desde el Home.

29/10
Fixeo del Metodo ChangeLevel. Eliminacion del patron Repository en User. Interaccion del boton de borrado de Review.

30/10
Log in de Admin terminado. Usamos otro tipo de token para darle permisos al leveling.

31/10
Realizada la funcionalidad para cambiar el nombre de un User.
