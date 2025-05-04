export function buscaIndice (personas,dni) {
    return personas.findIndex((element) => element.dni === dni);

}