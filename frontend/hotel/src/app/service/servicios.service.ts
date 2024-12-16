import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  private urlApi = 'http://localhost:3000/servicios';

  constructor(private http : HttpClient) { }

  public getData(): Observable<any> {

    return this.http.get<any>(this.urlApi);
  }


}
