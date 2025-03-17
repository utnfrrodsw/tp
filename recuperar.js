export function buscodni(personas, dnibuscado) {
    return personas.find((persona) => persona.dni === dnibuscado);
  }
  