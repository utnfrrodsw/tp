import { Injectable } from '@angular/core'
import { AuthModel, ResponseLogin } from 'src/app/models/auth/auth.model'
import { HttpClient } from '@angular/common/http'
import { Observable, map } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {

  }

  login(authModel: AuthModel): Observable<ResponseLogin> {
    return this.http.post<ResponseLogin>('http://localhost:4000/api/auth/login', authModel)
      .pipe(
        map((response: ResponseLogin) => {
          localStorage.setItem('token', JSON.stringify(response.token))
          localStorage.setItem('usuario', JSON.stringify(response.usuario))
          return response
        })
      )
  }
}
