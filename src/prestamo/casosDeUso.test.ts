import request from "supertest";

const baseURL = "http://localhost:3000";

// TESTEO DE CASOS DE USO INUTILIZADOS POR LA INCORPORACIÓN DE UNIQUE EN TITULO Y NOMBRE EDITORIAL. (A menos que sea la primera vez)
// RECORDAR INSTANCIAR LA POLITICA BIBLIOTECA PRIMERO, EN CASO DE USAR EL TESTEO LUEGO DE UN DROP SCHEMA.

describe("Testeo completo pedir un ejemplar y devolverlo", () => {
  let idAutor: number;
  let idEditorial: number;
  let idLibro: number;
  let idEjemplar: number;
  let idSocio: number;

  it("deberia crear un Autor", async () => {
    const newAutor = {
      nombre: "Autor Jest",
      apellido: "Montini",
    };
    const response = await request(baseURL).post("/api/autores").send(newAutor);
    idAutor = response.body.data.id;
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("id");
  });
  it("deberia crear una Editorial", async () => {
    const newEditorial = {
      nombre: "Editorial Jest",
    };
    const response = await request(baseURL)
      .post("/api/editoriales")
      .send(newEditorial);
    idEditorial = response.body.data.id;
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("id");
  });
  it("deberia crear un libro con un ejemplar", async () => {
    const newLibro = {
      titulo: "Libro para borrar",
      descripcion: "Un clásico de la literatura contemporanéa",
      isbn: "0-7645-2641-3",
      misAutores: [idAutor],
      miEditorial: idEditorial,
      cantEjemplares: 1,
    };
    const response = await request(baseURL).post("/api/libros").send(newLibro);
    idLibro = response.body.data.id;
    idEjemplar = response.body.data.misEjemplares[0].idEjemplar;

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("id");
  });
  it("deberia crear un socio", async () => {
    const newSocio = {
      nombre: "SocioJest",
      apellido: "Montini",
      email: "mailJest@gmail.com",
      domicilio: "oroño 1000",
      telefono: "15428317",
    };
    const response = await request(baseURL).post("/api/socios").send(newSocio);
    idSocio = response.body.data.id;
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("id");
  });
  it("deberia crear un prestamo (paso 3 cu retirar libros)", async () => {
    const newPrestamo = {
      idSocio: idSocio,
      ejemplares: [{ id: idEjemplar, miLibro: idLibro }],
    };
    const response = await request(baseURL)
      .post("/api/prestamos/retirarLibrosPaso3R")
      .send(newPrestamo);

    expect(response.status).toBe(201);
  });
  it("deberia rechazar el prestamo por estar ya prestado el ejemplar con un 400 ", async () => {
    const newPrestamo = {
      idSocio: idSocio,
      ejemplares: [{ id: idEjemplar, miLibro: idLibro }],
    };
    const response = await request(baseURL)
      .post("/api/prestamos/retirarLibrosPaso3R")
      .send(newPrestamo);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "El socio tiene pendiente un ejemplar de ese libro"
    );
    // El mensaje es ese porque es el mismo socio.
  });

  it("deberia devolver el prestamo, si se configuro manualmente atrasado, con atraso", async () => {
    const devolucion = {
      idSocio: idSocio,
      idEjemplar: idEjemplar,
      idLibro: idLibro,
    };

    const response = await request(baseURL)
      .patch("/api/prestamos/devolverLibro")
      .send(devolucion);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Devolucion registrada y socio sancionado."
    );
  });
});
