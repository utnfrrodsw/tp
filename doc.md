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

16/09
Inicialización de lógica de usuario en back.

17/09
Añadida la lógica de login tanto en back como en front.

21/09
Mejoramos el backend creando los ABMs de game utilizando la base de datos y definimos correctamente el método GetUserData. Aplicamos este último método en el front end para correctamente recibir los datos del usuario y mostrarlos como placeholder de lo que será la página del perfil.

23/09
Actualizamos Review pues decidimos agregar typegoose para utilizar tipos de manera más cómoda.

27/09
Comentamos el backend y empezamos a investigar para realizar el front de perfil de usuario.

29/09
Cambios en atributos de review y usuario para poder hacer join (populate).

