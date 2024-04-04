import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Bank } from '../../models/bank';
import { Dolar } from '../../models/dolar';
import { Investment } from '../../models/investment';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AILogicService {
  investment?: number = 1;
  inflation: number = 124.4;

  constructor(private http: HttpClient) {
  }

  generateBanks(): Observable<Bank[]>{
    return this.http.get<Bank[]>(`${environment.baseUrl}bank`)
  }

  getContructionData(): Observable<Investment[]>{
    return this.http.get<Investment[]>(`${environment.baseUrl}another-investment`)
  }

  getProfit(id: number, money: number) {
    return this.http.get<number>(`${environment.baseUrl}another-investment/GetProfitForOneYearById/${id}?money=${money}`)
  }

  getDolar(): Observable<Dolar[]> {
    return this.http.get<Dolar[]>(`https://dolarapi.com/v1/dolares`)
  }

  getLastInflationRate(): Observable<number> {
    let header = { headers: new HttpHeaders()
      .set('Authorization', `Bearer ${environment.bankToken}`)
      .set("Access-Control-Allow-Origin", "https://api.estadisticasbcra.com/inflacion_interanual_oficial") 
      .set("withCredentials",  "true" )
      .set("Access-Control-Allow-Headers", "GET")
      }
    return this.http.get<Inflation[]>('https://api.estadisticasbcra.com/inflacion_interanual_oficial', header)
      .pipe(map(x => x[x.length - 1].v));
  }
}
export interface Inflation {
  d: string;
  v: number;
}