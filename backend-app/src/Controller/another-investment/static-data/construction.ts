/* eslint-disable prettier/prettier */
export class ConstructionData {
    //indice construccion de Buenos Aires(1), Santa Fe(2) y Cordoba(3)
    //de Julio del 2022 a Junio del 2023
    StaticData: Map<number, number[]> = new Map([
      [1, [5.4, 6.5, 7.8, 3.8, 5.4, 6.8, 4.8, 6.3, 6.8, 7.1, 6.8, 6]],
      [2, [3.8, 2.3, 6.9, 6.8, 7, 6.6, 6.8, 7.3, 7.3, 4.7, 6.6, 5.4]],
      [3, [6.75, 4.38, 6.13, 7.67, 6.3, 6.67, 6, 6.37, 6, 4.7, 6.5, 6.9]],
    ]);

    getProm(id: number): number {
        const prom = this.StaticData.get(+id);
        let sum = 0;
        prom.forEach(rate => sum+= rate)
        return (sum/12)
    }
}
