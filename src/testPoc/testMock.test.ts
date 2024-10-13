import { Pedido, testPedido } from "./testMock.js";

describe("Testeo mock metodo de una clase", () => {
  it("Deberia cambiarse el retorno del metodo de la clase pedido a TRUE", () => {
    const mockFuisteCompletado = jest.fn().mockReturnValue(true);
    jest
      .spyOn(Pedido.prototype, "fuisteCompletado")
      .mockImplementation(mockFuisteCompletado);
    const mensaje = testPedido();
    // Aserciones o comprobaciones para el test
    expect(mensaje).toEqual({
      message: "El pedido fue completado (El mockeo funciono)",
    });
  });
});
