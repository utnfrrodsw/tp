import { Injectable, signal } from "@angular/core";
import { UserInterface } from "../../model/interfaces/user.interface.js";

@Injectable({
  providedIn: 'root'
})
export class AuthService{
  //Se genera una señal para notificar a los componentes a renderizar. Visto
  // MonsterLessons Academy, en "Angular Authentication, the correct way"

  currentUserSig=signal<UserInterface|undefined|null>(undefined);
  /* Si no sabes si el user está loggeado, te va a Undefined (initial state),
  null para no autorizar, y si está logged obtenes la UserInterface en la señal.
  Son 3 estados */
  
  
}