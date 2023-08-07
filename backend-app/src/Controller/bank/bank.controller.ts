import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
} from '@nestjs/common';
import { BankService } from './bank.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { Bank } from './entities/bank.entity';

@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post()
  async create(@Body() createBankDto: CreateBankDto) {
    return await this.bankService.create(createBankDto);
  }

  @Get()
  findAll(): Promise<Bank[]> {
    return this.bankService.findAll();
  }

  @Get(':name')
  async findOne(@Param('name') name: string): Promise<Bank | HttpException> {
    return await this.bankService.findOne(name);
  }

  /* @Patch(':id')
  update(@Param('id') id: string, @Body() updateBankDto: UpdateBankDto) {
    return this.bankService.update(+id, updateBankDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bankService.remove(+id);
  }*/
}
