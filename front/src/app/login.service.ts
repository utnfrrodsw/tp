import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  readonly baseUrl = 'http://localhost:3000/api/'
  
  constructor(private http: HttpClient) { }

  login(mail: string, contraseña:string){
    const url = this.baseUrl + 'participantes/login';
    const data = {mail, contraseña}
    return this.http.post<any>(url, data)
  }
}
