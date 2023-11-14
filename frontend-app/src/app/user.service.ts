import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from 'src/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  usersUrl = `${environment.baseUrl}users`
  constructor(private http: HttpClient) { }
  
  users(user: User): Observable<any> {
    return this.http.post<any>(this.usersUrl, user, {
      withCredentials: true,
    });
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(this.usersUrl);
  }

  deleteUser(UserId: number): Observable<any> {
    return this.http.post<any>(`${this.usersUrl}/delete`, {
      UserId: UserId,
    });
  }
  
  updateEmailUser(userId: number, newEmail: string){
    const url = `${this.usersUrl}/${userId}`;
    const updateData = { UserId: userId, NewEmail: newEmail };
    console.log(updateData);
    return this.http.patch(url, updateData);
  }
}
