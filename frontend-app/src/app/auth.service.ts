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
    return this.http.post<any>('http://localhost:3001/login', { username, password })
      .pipe(
        map(response => {
          const token = response[jwtConstants.tokenKey];
          localStorage.setItem(jwtConstants.tokenKey, token);
          return response;
        })
      );
  }

  logout(): void {
    localStorage.removeItem(jwtConstants.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(jwtConstants.tokenKey);
    return !this.jwtHelper.isTokenExpired(token);
  }
}