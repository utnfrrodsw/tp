import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { jwtConstants } from 'auth.config';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService
  ) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>('http://localhost:3001/auth/login', { username, password }, { withCredentials: true })
      .pipe(
        map(response => {
          const token = response.access_token
          console.log(token);
          localStorage.setItem(jwtConstants.access_token, token);
          return response;
        })
      );
  }

  logout(): boolean {
    if(localStorage.getItem(jwtConstants.access_token)){
      localStorage.removeItem(jwtConstants.access_token);
      return true;
    }
    else return false;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(jwtConstants.access_token);
    return !this.jwtHelper.isTokenExpired(token);
  }
}