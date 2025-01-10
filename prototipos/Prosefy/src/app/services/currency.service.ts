// currency.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private selectedCurrency: string = 'ARS';

  constructor() { }

  getCurrency(): string {
    return this.selectedCurrency;
  }

  setCurrency(currency: string): void {
    this.selectedCurrency = currency;
  }

  calculatePriceInSelectedCurrency(precio: number): number {
    if (this.selectedCurrency === 'USD') {
      return Math.round(precio / 1000);
    }
    return precio;
  }
}