import { Observable, of } from "rxjs";
import { User } from "src/models/user";

export class UserServiceStub {

    users(user: User): Observable<any> {
        return of(null);
      }
    
      getUsers(): Observable<any> {
        return of(null);
      }
    
      deleteUser(UserId: number): Observable<any> {
        return of(null);
      }
      
      updateEmailUser(userId: number, newEmail: string){
      }
}