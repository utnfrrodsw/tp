import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { jwtConstants } from 'auth.config';
import { Observable, map } from 'rxjs';
import { User } from 'src/models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) {}

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>('http://localhost:3001/auth/login', { username, password })
      .pipe(
        map((response) => {
          const token = response.access_token;
          console.log(token);
          localStorage.setItem(jwtConstants.access_token, token);
          return response;
        })
      );
  }

  users(user: User): Observable<any> {
    return this.http.post<any>('http://localhost:3001/users', user, {
      withCredentials: true,
    });
    //.pipe(
    //  map((response) => {
    //    //const token = response.access_token;
    //    //console.log(token);
    //    //localStorage.setItem(jwtConstants.access_token, token);
    //    return response;
    //  })
    //);
  }

  getUsers(): Observable<any> {
    return this.http.get<any>('http://localhost:3001/users');
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>('http://localhost:3001/users');
  }

  logout(): void {
    localStorage.removeItem(jwtConstants.access_token);
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
