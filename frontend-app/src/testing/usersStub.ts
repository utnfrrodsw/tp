import { Address } from "../models/address";

export const usersStub = {
  FirstName: 'testFirstName',
  LastName: 'testLastName',
  Email: 'testEmail',
  Password: 'testPassword',
  Address: new Address('', '', ''),
  UserId: 1,
  Editing: true
};