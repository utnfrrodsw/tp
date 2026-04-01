const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let destinos = [];

function preguntar(pregunta) {
    return new Promise(resolve => rl.question(pregunta, resp => resolve(resp)));
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
    console.log('--- MENÚ DE DESTINOS ---');
    console.log('1. Agregar destino');
    console.log('2. Ver todos los destinos');
    console.log('3. Editar destino');
    console.log('4. Eliminar destino');
    console.log('5. Salir');
}

async function agregarDestino() {
    while (true) {
        console.clear();
        console.log('--- AGREGAR DESTINO ---');
        let id;
        while (true) {
            id = await preguntar('Ingrese ID numérico del destino (o "x" para volver): ');
            if (id.toLowerCase() === 'x') return;
            if (!/^\d+$/.test(id)) {
                console.log('**El ID debe ser numérico**');
                await new Promise(resolve => setTimeout(resolve, 1000));
                console.clear();
            } else if (destinos.some(d => d.id === id)) {
                console.clear();
                console.log('El ID ya existe.');
            } else {
                break;
            }
        }
        const nombre = await preguntar('Ingrese nombre del destino: ');
        const pais = await preguntar('Ingrese país del destino: ');
        const descripcion = await preguntar('Ingrese descripción del destino: ');
        const imagenes = await preguntar('Ingrese imágenes del destino (separadas por coma): ');

        destinos.push({
            id,
            nombre,
            pais,
            descripcion,
            imagenes: imagenes.split(',').map(img => img.trim())
        });

        console.log('Destino agregado correctamente.');
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.clear();
        const otra = await preguntarSN('¿Desea agregar otro destino? (s/n): ');
        if (otra !== 's') break;
    }
}

function mostrarDestinos() {
    console.clear();
    console.log('--- LISTADO DE DESTINOS ---');
    if (destinos.length === 0) {
        console.log('No hay destinos cargados.');
    } else {
        destinos.forEach(d => {
            console.log(`ID: ${d.id} | Nombre: ${d.nombre} | País: ${d.pais}`);
            console.log(`Descripción: ${d.descripcion}`);
            console.log(`Imágenes: ${d.imagenes.join(', ')}`);
            console.log('--------------------------');
        });
    }
}

async function editarDestino() {
    while (true) {
        console.clear();
        if (destinos.length === 0) {
            console.log('No hay destinos para editar.');
            await preguntar('Presione Enter para volver al menú...');
            break;
        }
        mostrarDestinos();
        const id = await preguntar('Ingrese el ID del destino a editar o "x" para volver al menu: ');
        if (id.toLowerCase() === 'x') break;
        const destino = destinos.find(d => d.id === id);
        if (!destino) {
            console.log('ID no encontrado.');
            await preguntar('Presione Enter para intentar de nuevo...');
            continue;
        }
        console.log(`Nombre actual: ${destino.nombre}`);
        const nombre = await preguntar('Nuevo nombre (Enter para no cambiar): ');
        if (nombre) destino.nombre = nombre;

        console.log(`País actual: ${destino.pais}`);
        const pais = await preguntar('Nuevo país (Enter para no cambiar): ');
        if (pais) destino.pais = pais;

        console.log(`Descripción actual: ${destino.descripcion}`);
        const descripcion = await preguntar('Nueva descripción (Enter para no cambiar): ');
        if (descripcion) destino.descripcion = descripcion;

        console.log(`Imágenes actuales: ${destino.imagenes.join(', ')}`);
        const imagenes = await preguntar('Nuevas imágenes (separadas por coma, Enter para no cambiar): ');
        if (imagenes) destino.imagenes = imagenes.split(',').map(img => img.trim());

        console.log('Destino editado correctamente.');
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.clear();
        const otra = await preguntarSN('¿Desea editar otro destino? (s/n): ');
        if (otra !== 's') break;
    }
}

async function eliminarDestino() {
    while (true) {
        console.clear();
        if (destinos.length === 0) {
            console.log('No hay destinos para eliminar.');
            await preguntar('Presione Enter para volver al menú...');
            break;
        }
        console.log('--- DESTINOS DISPONIBLES ---');
        destinos.forEach(d => {
            console.log(`ID: ${d.id} | Nombre: ${d.nombre}`);
        });
        const id = await preguntar('Ingrese el ID del destino a eliminar o "x" para volver al menu: ');
        if (id.toLowerCase() === 'x') break;
        const index = destinos.findIndex(d => d.id === id);
        if (index === -1) {
            console.log('ID no encontrado.');
            await preguntar('Presione Enter para intentar de nuevo...');
            continue;
        }
        destinos.splice(index, 1);
        console.log('Destino eliminado correctamente.');
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.clear();
        const otra = await preguntarSN('¿Desea eliminar otro destino? (s/n): ');
        if (otra !== 's') break;
    }
}

async function main() {
    while (true) {
        mostrarMenu();
        const opcion = await preguntar('Seleccione una opción: ');
        switch (opcion) {
            case '1':
                await agregarDestino();
                break;
            case '2':
                mostrarDestinos();
                await preguntar('Presione Enter para volver al menú...');
                break;
            case '3':
                await editarDestino();
                break;
            case '4':
                await eliminarDestino();
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