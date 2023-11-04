import { Injectable } from '@nestjs/common';
import { CreateAnotherInvestmentDto } from './dto/create-another-investment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AnotherInvestment } from './entities/another-investment.entity';
import { Repository } from 'typeorm';
import { ConstructionData } from './static-data/construction';

@Injectable()
export class AnotherInvestmentService {
  constructor(
    @InjectRepository(AnotherInvestment)
    private investmentRepository: Repository<AnotherInvestment>,
    private constructionData: ConstructionData,
  ) {}
  create(createAnotherInvestmentDto: CreateAnotherInvestmentDto) {
    const newInvestment = this.investmentRepository.create(
      createAnotherInvestmentDto,
    );
    return this.investmentRepository.save(newInvestment);
  }

  investmentForAYear(id: number, money: { money: string }) {
    const prom = this.constructionData.getProm(id);
    const floatMoney = parseFloat(money.money);
    return (1 + prom / 100) ** 12 * floatMoney;
  }

  async findOneByLabel(label: string): Promise<AnotherInvestment> {
    return await this.investmentRepository.findOne({
      where: { Label: label },
    });
  }

  findAll(): Promise<AnotherInvestment[]> {
    return this.investmentRepository.find();
  }
}
