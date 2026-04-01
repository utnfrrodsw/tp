const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let hoteles = [];

function preguntar(pregunta) {
    return new Promise(resolve => rl.question(pregunta, resp => resolve(resp)));
}
function asignarID(){
    let ultimoid= hoteles.length;
    return (ultimoid+1);
}

async function preguntarSN(mensaje) {
    let r;
    do {
        console.clear();
        console.log('marque s para continuar o n para salir');
        r = (await preguntar(mensaje)).trim().toLowerCase();
    } while (r !== 's' && r !== 'n');
    return r;
}

function mostrarMenu() {
    console.clear();
    console.log('--- MENÚ DE Hoteles ---');
    console.log('1. Agregar Hotel');
    console.log('2. Ver todos los hoteles');
    console.log('3. Editar hotel pre existente');
    console.log('4. Eliminar hotel');
    console.log('5. Salir');
}
async function checkeovacio(campo){
    let ingreso= await preguntar(`Ingrese ${campo} : `);
    while (ingreso===""){
        console.log(' este campo  es obligatorio');
        ingreso = await preguntar(`Ingrese ${campo} : `);
    }
    return ingreso;
}

async function agregarHotel() {
    while (true) {
        console.clear();
        console.log('--- AGREGAR HOTEL ---');
        let idHotel= asignarID(); 
        if (idHotel=== 0){
            idHotel = 1;
        }
        const direccion = await checkeovacio('direccion');
        const nombreHotel = await checkeovacio('nombre del hotel'); 
        const imagenes = await preguntar ('ingrese imagenes separadas por coma: ')

        hoteles.push({
            idHotel,
            nombreHotel,
            direccion,
            imagenes: imagenes.split(',').map(img => img.trim())
        });

        console.log('Hotel agregado correctamente.');
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.clear();
        const otra = await preguntarSN('¿Desea agregar otro hotel? (s/n): ');
        if (otra !== 's') break;
    }
}

function mostrarHoteles() {
    console.clear();
    console.log('--- LISTADO DE HOTELES ---');
    if (hoteles.length === 0) {
        console.log('No hay hoteles cargados.');
    } else {
        hoteles.forEach(h  => {
            console.log(`ID: ${h.idHotel} | Nombre: ${h.nombreHotel} | Direccion: ${h.direccion}`);
            console.log(`Imágenes: ${h.imagenes.join(', ')}`);
            console.log('--------------------------');
        });
    }
}

async function editarhotel() {
    while (true) {
        console.clear();
        if (hoteles.length === 0) {
            console.log('No hay hoteles para editar.');
            await preguntar('Presione Enter para volver al menú...');
            break;
        }
        mostrarHoteles();
        const id = await preguntar('Ingrese el ID del hotel a editar o "x" para volver al menu: ');
        if (id.toLowerCase() === 'x') break;
        const hotel = hoteles.find(h => h.idHotel == id);
        if (!hotel) {
            console.log('ID no encontrado.');
            await preguntar('Presione Enter para intentar de nuevo...');
            continue;
        }
        console.log(`Nombre actual: ${hotel.nombreHotel}`);
        const nombre = await preguntar('Nuevo nombre (Enter para no cambiar): ');
        if (nombre) hotel.nombreHotel = nombre;

        console.log(`Direccion actual: ${hotel.direccion}`);
        const dire = await preguntar('Nueva direccion (Enter para no cambiar): ');
        if (dire) hotel.direccion = dire;

        console.log(`Imágenes actuales: ${hotel.imagenes.join(', ')}`);
        const imagenes = await preguntar('Nuevas imágenes (separadas por coma, Enter para no cambiar): ');
        if (imagenes) hotel.imagenes = imagenes.split(',').map(img => img.trim());

        console.log('hotel editado correctamente.');
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.clear();
        const otra = await preguntarSN('¿Desea editar otro hotel? (s/n): ');
        if (otra !== 's') break;
    }
}

async function eliminarhotel() {
    while (true) {
        console.clear();
        if (hoteles.length === 0) {
            console.log('No hay hoteles para eliminar.');
            await preguntar('Presione Enter para volver al menú...');
            break;
        }
        console.log('--- HOTELES DISPONIBLES ---');
        hoteles.forEach(h => {
            console.log(`ID: ${h.idHotel} | Nombre: ${h.nombreHotel}`);
        });
        const id = await preguntar('Ingrese el ID del hotel a eliminar o "x" para volver al menu: ');
        if (id.toLowerCase() === 'x') break;
        const index = hoteles.findIndex(h => h.idHotel == id);//uso comparacion debil porque con === no lo encuentra por ser dif tipo de variable
        if (index === -1) {
            console.log('ID no encontrado.');
            await preguntar('Presione Enter para intentar de nuevo...');
            continue;
        }
        hoteles.splice(index, 1);
        console.log('hotel eliminado correctamente.');
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.clear();
        const otra = await preguntarSN('¿Desea eliminar otro hotel? (s/n): ');
        if (otra !== 's') break;
    }
}

async function main() {
    while (true) {
        mostrarMenu();
        const opcion = await preguntar('Seleccione una opción: ');
        switch (opcion) {
            case '1':
                await agregarHotel();
                break;
            case '2':
                mostrarHoteles();
                await preguntar('Presione Enter para volver al menú...');
                break;
            case '3':
                await editarhotel();
                break;
            case '4':
                await eliminarhotel();
                break;
            case '5':
                console.log('¡Hasta luego!');
                rl.close();
                return;
            default:
                console.log('Opción inválida.');
                await preguntar('Presione Enter para intentar de nuevo...');
        }
    }
}

main();
