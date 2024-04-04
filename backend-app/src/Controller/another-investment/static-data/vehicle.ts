/* eslint-disable prettier/prettier */
export class VehicleData {
    //plan de ahorro, de 60 a 84 cuotas mensuales
    //100% financiado, el total del valor del auto en las cuotas
    //70/30, es pagar el 70% en cuotas y el 30% al entregar le auto
    //patentar es el 1.5% 
    //el plan de ahorro se actualzia al valor del auto
    //si pedis un prestamo en el banco a tasa fija en pesos, es mejor
    //plan de ahorro se comienza con cuotasd diferidas (puede ser el 50% de la cuota)
    //que mas tarde se paga en las cuotas futuras
    
    //valor a agosto 2023
    PromInflationRateMin = 0.70;
    PromInflationRateMax = 1.1;
    Patentamiento = 0.02;
    CuotasPlanAhorro84 = 84;

    StaticData: Map<number, number> = new Map([
        [4, 6400000],
        [5, 7500000],
        [6, 14000000]
    ])

    getId(label: string): number {
        if (label == 'Chevrolet Onix 5P 1.2 LS'){
            return 4;
        }
        if (label == 'Peugeot 208 5P 1.6 ACTIVE 2023'){
            return 5;
        }
        if (label == 'Volkswagen Amarok DC 4x2 Trendline'){
            return 6;
        }
    }
}
