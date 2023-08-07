import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bank } from './entities/bank.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank) private bankRepository: Repository<Bank>,
  ) {}
  async create(createBankDto: CreateBankDto) {
    const bank = await this.bankRepository.findOne({
      where: { Name: createBankDto.Name },
    });
    if (bank) {
      return new HttpException('Banco ya existe', HttpStatus.CONFLICT);
    }

    const newBank = this.bankRepository.create(createBankDto);
    return this.bankRepository.save(newBank);
  }

  findAll(): Promise<Bank[]> {
    return this.bankRepository.find();
  }

  async findOne(name: string) {
    const bank = await this.bankRepository.findOne({
      where: { Name: name },
    });
    if (!bank) {
      return new HttpException('Banco no encontrado', HttpStatus.NOT_FOUND);
    }

    return bank;
  }

  /*update(id: number, updateBankDto: UpdateBankDto) {
    return `This action updates a #${id} bank`;
  }

  remove(id: number) {
    return `This action removes a #${id} bank`;
  }*/
}
