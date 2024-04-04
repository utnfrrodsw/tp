import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
export enum Currency {
  USD = 'US Dollar',
  ARS = 'Peso Argentino',
  EUR = 'Euro',
  CNY = 'Yuan',
}

@Entity()
export class Bank {
  @PrimaryGeneratedColumn()
  BankId: number;

  @Column()
  Name: string;

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.ARS,
  })
  Currency: Currency;

  @Column()
  InterestRate: number;
}
