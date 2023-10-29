// currency.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private selectedCurrency: string = 'ARS'; // Moneda predeterminada

  constructor() { }

  getCurrency(): string {
    return this.selectedCurrency;
  }

  setCurrency(currency: string): void {
    this.selectedCurrency = currency;
  }

  calculatePriceInSelectedCurrency(precio: number): number {
    if (this.selectedCurrency === 'USD') {
      // Divide el precio en dólares por 800 y redondea el resultado
      return Math.round(precio / 1000);
    }
    return precio; // Devuelve el precio original si la moneda es ARS
  }
}
