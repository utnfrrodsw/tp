import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../models/user';
import { Address } from '../models/address';
import { environment } from '../environments/environment';
import { usersStub } from '../testing/usersStub';

const addresMock = new Address('street', 'number', 'city');
const userMock = new User('testname', 'testlastname', 'testemail', 'testpass', addresMock);
const expectedUrl = `${environment.baseUrl}users`

describe('UserService', () => {
  let userService: UserService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService
      ],
      imports: [HttpClientTestingModule]
    });
    userService = TestBed.inject(UserService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(userService).toBeTruthy();
  });

  it('should call getUsers', () => {
    let curUsers: any | undefined;
    userService.getUsers().subscribe(
      (users) => {
        curUsers = users;
      }
    );

    const request = controller.expectOne(expectedUrl);
    request.flush(usersStub);
    controller.verify();

    expect(curUsers).toEqual(usersStub);
  });

  it('should call Users', () => {
    let response: any | undefined;
    userService.users(userMock).subscribe(
      (resp)=>{
        response = resp;
      }
    );

    const request = controller.expectOne(expectedUrl);
    request.flush(usersStub);

    expect(response).toEqual(usersStub);
  });

  it('should call deleteUser', () => {
    let response: any | undefined;
    userService.deleteUser(1).subscribe(
      (resp) => {
        response = resp;
      }
    );

    const request = controller.expectOne(expectedUrl + "/delete");
    request.flush(usersStub);

    expect(response).toEqual(usersStub);
  });

  it('should call updateEmailUser', () => {
    let response: any | undefined;
    const updateMock = {userId: 1, newEmail: 'testemail'};
    userService.updateEmailUser(updateMock.userId, updateMock.newEmail).subscribe(
      (resp) => {
        response = resp;
      }
    );

    const request = controller.expectOne(expectedUrl + `/${updateMock.userId}`);
    request.flush(usersStub);

    expect(response).toEqual(usersStub);
  });
});
