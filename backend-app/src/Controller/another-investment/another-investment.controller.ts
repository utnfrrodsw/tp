import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { AnotherInvestmentService } from './another-investment.service';
import { CreateAnotherInvestmentDto } from './dto/create-another-investment.dto';
import { AnotherInvestment } from './entities/another-investment.entity';

@Controller('another-investment')
export class AnotherInvestmentController {
  constructor(
    private readonly anotherInvestmentService: AnotherInvestmentService,
  ) {}

  @Post()
  async create(@Body() createAnotherInvestmentDto: CreateAnotherInvestmentDto) {
    return await this.anotherInvestmentService.create(
      createAnotherInvestmentDto,
    );
  }

  @Get()
  findAll(): Promise<AnotherInvestment[]> {
    return this.anotherInvestmentService.findAll();
  }

  @Get('GetProfitForOneYearById/:id')
  profitForOneYearById(
    @Param('id') id: number,
    @Query() money: { money: string },
  ): number {
    return this.anotherInvestmentService.investmentForAYear(id, money);
  }
}
