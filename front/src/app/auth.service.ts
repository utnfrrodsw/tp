import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private rolSubject = new BehaviorSubject<string | null>(localStorage.getItem('rol'))
  rol$ = this.rolSubject.asObservable()

  setRol(rol: string | null) {
    if (rol) {
      localStorage.setItem('rol', rol)
    } else {
      localStorage.removeItem('rol')
    }
    this.rolSubject.next(rol)
  }

  logOut() {
    localStorage.removeItem('token')
    this.setRol(null)
  }
}
