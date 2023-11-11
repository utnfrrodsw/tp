import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { jwtConstants } from 'auth.config';
import { Observable, Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginSuccessSubject = new Subject<void>();
  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) {}

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>('http://localhost:3001/auth/login', { username, password })
      .pipe(
        map((response) => {
          const token = response.access_token;
          localStorage.setItem(jwtConstants.access_token, token);
          this.loginSuccessSubject.next();
          return response;
        })
      );
  }

  onLoginSuccess(): Observable<void> {
    return this.loginSuccessSubject.asObservable();
  }

  getRolSession(): string | null {
    const accessToken = localStorage.getItem(jwtConstants.access_token);
    const tokenDecoded = accessToken ? this.jwtHelper.decodeToken(accessToken) : null;
    if(tokenDecoded){
      return tokenDecoded.rol;
    }
    return null;
  }

  getUsername(): string | null {
    const accessToken = localStorage.getItem(jwtConstants.access_token);
    const tokenDecoded = accessToken ? this.jwtHelper.decodeToken(accessToken) : null;
    if(tokenDecoded){
      return `${tokenDecoded.firstname} ${tokenDecoded.lastname}`;
    }
    return null;
  }

  logout(): boolean {
    if (localStorage.getItem(jwtConstants.access_token)) {
      localStorage.removeItem(jwtConstants.access_token);
      return true;
    } else return false;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(jwtConstants.access_token);
    return !this.jwtHelper.isTokenExpired(token);
  }
}
