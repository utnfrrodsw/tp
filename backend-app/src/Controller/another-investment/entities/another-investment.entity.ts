import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AnotherInvestment {
  @PrimaryGeneratedColumn()
  InvestmentId: number;

  @Column()
  GroupLabel: string;

  @Column()
  Label: string;
}
