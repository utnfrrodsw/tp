import { Address } from './address';

export class User {
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  Address: Address;
  constructor(
    FirstName: string,
    LastName: string,
    Email: string,
    Password: string,
    Address: Address
  ) {
    this.FirstName = FirstName;
    this.LastName = LastName;
    this.Email = Email;
    this.Password = Password;
    this.Address = Address;
  }
}
