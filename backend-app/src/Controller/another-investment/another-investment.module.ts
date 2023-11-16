import { Module } from '@nestjs/common';
import { AnotherInvestmentService } from './another-investment.service';
import { AnotherInvestmentController } from './another-investment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnotherInvestment } from './entities/another-investment.entity';
import { ConstructionData } from './static-data/construction';

@Module({
  imports: [TypeOrmModule.forFeature([AnotherInvestment])],
  controllers: [AnotherInvestmentController],
  providers: [AnotherInvestmentService, ConstructionData],
})
export class AnotherInvestmentModule {}
