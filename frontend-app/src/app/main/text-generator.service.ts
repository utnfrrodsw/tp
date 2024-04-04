import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextGeneratorService {

  generateTextForBanks(bankName: string, intestRate: number): string{
    let result: string;
    const seed = Math.floor(Math.random()*10);
    switch(seed) {
      case 1: {
        result = `El ${bankName} ofrece tasas de interés del ${intestRate} en sus plazos fijos anuales.`;
        break;
      }
      case 2: {
        result = `${bankName} destaca con una tasa de interés del ${intestRate} en sus plazos fijos anuales.`;
        break;
      }
      case 3: {
        result = `En el ${bankName} puedes obtener un ${intestRate} en sus plazos fijos anuales.`;
        break;
      }
      case 4: {
        result = `${bankName} ofrece tasas de interés del ${intestRate} para los plazos fijos anuales.`;
        break;
      }
      case 5: {
        result = `Con el ${bankName} disfrutas de un ${intestRate} de interés en tus plazos fijos anuales.`;
        break;
      }
      case 6: {
        result = `El ${bankName} te brinda un ${intestRate} de tasa de interés en sus plazos fijos anuales.`;
        break;
      }
      case 7: {
        result = `En el ${bankName} puedes obtener un ${intestRate} en sus plazos fijos anuales.`;
        break;
      }
      case 8: {
        result = `El ${bankName} destaca con una tasa de interés del ${intestRate} en sus plazos fijos anuales.`;
        break;
      }
      case 9: {
        result = `En el ${bankName} disfrutas de un ${intestRate} de interés en tus plazos fijos anuales.`;
        break;
      }
      default: {
        result = `El ${bankName} es conocido por ofrecer a sus clientes tasas de interés anuales del  ${intestRate} para los plazos fijos anuales.`;
        break;
      }
    }
    return result;
  }
}
