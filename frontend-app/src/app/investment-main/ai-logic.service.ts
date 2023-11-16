import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Bank } from 'src/models/bank';
import { Dolar } from 'src/models/dolar';
import { Investment } from 'src/models/investment';

@Injectable({
  providedIn: 'root'
})
export class AILogicService {
  investment?: number = 1;
  inflation: number = 124.4;

  bankToken = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTI2MDUzNTEsInR5cGUiOiJleHRlcm5hbCIsInVzZXIiOiJmZWRlcmljb2luZ3Npc0BnbWFpbC5jb20ifQ.5v2FekmCFBSWcP2nd6WnhbLgXTAqdgZgMHfwcbgldDOGOkrYt6auydqvpfFpvN013p6V1d7MW-TmhUypK_8Iow";
  constructor(private http: HttpClient) {
  }

  generateBanks(): Observable<Bank[]>{
    return this.http.get<Bank[]>('http://localhost:3001/bank')
  }

  getContructionData(): Observable<Investment[]>{
    return this.http.get<Investment[]>('http://localhost:3001/another-investment')
  }

  getProfit(id: number, money: number) {
    return this.http.get<number>(`http://localhost:3001/another-investment/GetProfitForOneYearById/${id}?money=${money}`)
  }

  getDolar(): Observable<Dolar[]> {
    return this.http.get<Dolar[]>(`https://dolarapi.com/v1/dolares`)
  }

  getLastInflationRate(): Observable<number> {
    let header = { headers: new HttpHeaders()
      .set('Authorization', `Bearer ${this.bankToken}`)
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
/*var header = {
  headers: new HttpHeaders()
    .set('Authorization',  `Basic ${btoa(AuthService.getToken())}`) 
 

}*/