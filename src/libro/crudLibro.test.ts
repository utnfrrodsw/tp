import request from "supertest";
import { Libro } from "./libro.entity.js";

const baseURL = "http://localhost:3000";

describe("CRUD /api/libros", () => {
  // Variable compartidas entre testeos
  let idLibroCreate: number;
  let idLibroCreateSinEjemplares: number;

  it("should return a list of books", async () => {
    const response = await request(baseURL).get("/api/libros");

    expect(response.status).toBe(200); // Verificar que el estado sea 200 (OK)
    expect(Array.isArray(response.body.data)).toBe(true); // Verificar que el cuerpo de la respuesta sea un array
    expect(response.body.data[0].misAutores[0]).toHaveProperty("nombre"); // Verifica que se haya populado bien la relacion con Autor.
    expect(response.body.data[0].miEditorial).toHaveProperty("nombre"); // Verifica que se haya populado bien la relacion con Editorial.
    //expect(response.body.length).toBeGreaterThan(0); // Verifica que haya al menos un libro
    //expect(response.body[0]).toHaveProperty("id"); // Verificar que cada libro tenga una propiedad 'id'
    //expect(response.body[0]).toHaveProperty("title"); // Verificar que cada libro tenga una propiedad 'title'
  });

  it("should create a libro with N ejemplares", async () => {
    const N = 1;
    const newBook = {
      titulo: "Libro para borrar",
      descripcion: "Un clásico de la literatura contemporanéa",
      isbn: "0-7645-2641-3",
      misAutores: [1],
      miEditorial: 1,
      cantEjemplares: N,
    };

    const response = await request(baseURL)
      .post("/api/libros") // Hacer la petición POST
      .send(newBook); // Enviar el cuerpo con los datos del libro

    // Verificaciones libro
    expect(response.status).toBe(201); // Verificar que el código de estado sea 201 (Created)
    expect(response.body.data).toHaveProperty("id"); // Verificar que el libro creado tenga un 'id'
    idLibroCreate = response.body.data.id;
    // Verificacion de ejemplares
    expect(response.body.data.misEjemplares[0]);
    expect(Array.isArray(response.body.data.misEjemplares)).toBe(true);
    expect(response.body.data.misEjemplares).toHaveLength(N);

    for (let x = 0; x < N; x++) {
      expect(response.body.data.misEjemplares[x]).toHaveProperty(
        "idEjemplar",
        x + 1
      );
    }
  });

  it("should create a libro sin ejemplares", async () => {
    const newBook = {
      titulo: "Libro para borrar 2",
      descripcion: "Un clásico de la literatura contemporanéa",
      isbn: "978-0-262-03384-8",
      misAutores: [1],
      miEditorial: 1,
    };

    const response = await request(baseURL)
      .post("/api/libros") // Hacer la petición POST
      .send(newBook); // Enviar el cuerpo con los datos del libro

    expect(response.status).toBe(201); // Verificar que el código de estado sea 201 (Created)
    expect(response.body.data).toHaveProperty("id"); // Verificar que el libro creado tenga un 'id'
    idLibroCreateSinEjemplares = response.body.data.id;
  });

  it("should update a book in the database", async () => {
    const response = await request(baseURL)
      .patch(`/api/libros/${idLibroCreate}`)
      .send({ titulo: "Nuevo Título" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Libro actualizado");

    const getResponse = await request(baseURL).get(
      `/api/libros/${idLibroCreate}`
    );
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.data.titulo).toBe("Nuevo Título"); // Verificar que el título fue actualizado
  });

  it("should return 409, no se puede borrar un libro con ejemplares", async () => {
    const getResponseBeforeDelete = await request(baseURL).get(
      `/api/libros/${idLibroCreate}`
    );
    expect(getResponseBeforeDelete.status).toBe(200);
    expect(getResponseBeforeDelete.body.data).toHaveProperty(
      "id",
      idLibroCreate
    );

    // Ahora, realiza la petición DELETE
    const deleteResponse = await request(baseURL).delete(
      `/api/libros/${idLibroCreate}`
    );
    expect(deleteResponse.status).toBe(409); // Verifica que el código de estado sea 409 (No se puede borrar un libro con ejemplares)
  });

  // ---------------------

  // ----------------
  it("should delete el libro sin ejemplares en la DB", async () => {
    const getResponseBeforeDelete = await request(baseURL).get(
      `/api/libros/${idLibroCreateSinEjemplares}`
    );
    expect(getResponseBeforeDelete.status).toBe(200);

    const deleteResponse = await request(baseURL).delete(
      `/api/libros/${idLibroCreateSinEjemplares}`
    );
    expect(deleteResponse.status).toBe(200); // Verifica que el código de estado sea 200

    // Asegúrate de que el libro ya no existe
    const getResponseAfterDelete = await request(baseURL).get(
      `/api/libros/${idLibroCreateSinEjemplares}`
    );
    expect(getResponseAfterDelete.status).toBe(404); // Verifica que ahora devuelve un 404
  });

  // Este testeo va a fallar por MikroOrm.

  it("debería devolver 409 al intentar borrar un libro prestado", async () => {
    // Mockear solo el método en Libro
    const mockFuistePrestado = jest.fn().mockReturnValue(true);
    jest
      .spyOn(Libro.prototype, "fuistePrestado")
      .mockImplementation(mockFuistePrestado);

    // Intentar borrar el libro
    const deleteResponse = await request(baseURL).delete(
      `/api/libros/${idLibroCreateSinEjemplares}`
    );

    // Verificar la respuesta
    expect(deleteResponse.status).toBe(409);
    expect(deleteResponse.body.message).toBe(
      "No puede borrarse un libro que haya sido prestado. (Testeo: Borrar el socio que lo haya pedido)"
    );

    // Restaurar el mock después del test
    jest.restoreAllMocks();
  });
});
