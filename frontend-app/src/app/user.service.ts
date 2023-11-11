import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  
  users(user: User): Observable<any> {
    return this.http.post<any>('http://localhost:3001/users', user, {
      withCredentials: true,
    });
  }

  getUsers(): Observable<any> {
    return this.http.get<any>('http://localhost:3001/users');
  }

  deleteUser(UserId: number): Observable<any> {
    return this.http.post<any>('http://localhost:3001/users/delete', {
      UserId: UserId,
    });
  }
  
  updateEmailUser(userId: number, newEmail: string){
    const url = `http://localhost:3001/users/${userId}`;
    const updateData = { UserId: userId, NewEmail: newEmail };
    console.log(updateData);
    return this.http.patch(url, updateData);
  }
}
