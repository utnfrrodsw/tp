import { Currency } from '../entities/bank.entity';

export class CreateBankDto {
  Name: string;
  Currency: Currency;
  InterestRate: number;
}
