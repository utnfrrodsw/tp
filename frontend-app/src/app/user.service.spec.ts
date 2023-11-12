import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UserService } from './user.service';
import { User } from '../models/user';
import { Address } from '../models/address';

describe('UserService', () => {
  let userService: UserService;
  const addresMock = new Address('street', 'number', 'city');
  const userMock = new User('testname', 'testlastname', 'testemail', 'testpass', addresMock);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService
      ],
      imports: [HttpClientTestingModule]
    });
    userService = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(userService).toBeTruthy();
  });

  it('should call getUsers', () => {
    const users = userService.getUsers();

    expect(users).toBeDefined();
  });

  it('should call Users', () => {
    const users = userService.users(userMock);

    expect(users).toBeDefined();
  });

  it('should call deleteUser', () => {
    const users = userService.deleteUser(1);

    expect(users).toBeDefined();
  });

  it('should call updateEmailUser', () => {
    const updateMock = {userId: 1, newEmail: 'testemail'};
    const users = userService.updateEmailUser(updateMock.userId, updateMock.newEmail);

    expect(users).toBeDefined();
  });
});
