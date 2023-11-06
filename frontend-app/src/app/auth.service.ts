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

  deleteUser(UserId: number): Observable<any> {
    console.log(UserId);
    return this.http.post<any>('http://localhost:3001/users/delete', {
      UserId: UserId,
    });
  }

  // updateUsers(): Observable<any>{
  //   return this.http.patch<any>('http://localhost:3001/users');
  // }
  updateEmailUser(userId: number, newEmail: string){
    const url = `http://localhost:3001/users/${userId}`;
    const updateData = { UserId: userId, NewEmail: newEmail };

    return this.http.patch(url, updateData);
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
