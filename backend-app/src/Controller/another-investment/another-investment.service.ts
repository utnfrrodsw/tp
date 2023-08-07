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

  investmentForAYear(id: number, money: number) {
    const prom = this.constructionData.getProm(id);
    return (1 + prom / 100) ** 12 * money;
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
