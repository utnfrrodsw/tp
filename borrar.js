export function eliminarPersona (personas,indice){

    personas.splice(indice, 1);
    return  console.log('\nPersona borrada con éxito');
}