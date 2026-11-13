import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger('CategoriesService');

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { parentId, ...categoryData } = createCategoryDto;
    const category = this.categoryRepository.create(categoryData);

    if (parentId) {
      category.parent = await this.findActiveParent(parentId);
    }

    try {
      return await this.categoryRepository.save(category);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository
      .createQueryBuilder('cat')
      .leftJoinAndSelect(
        'cat.children',
        'children',
        'children.isActive = :isActive',
        { isActive: true },
      )
      .leftJoinAndSelect('cat.parent', 'parent', 'parent.isActive = :isActive', {
        isActive: true,
      })
      .where('cat.isActive = :isActive', { isActive: true })
      .orderBy('cat.name', 'ASC')
      .getMany();
  }

  async findOne(term: string): Promise<Category> {
    const qb = this.categoryRepository
      .createQueryBuilder('cat')
      .leftJoinAndSelect(
        'cat.children',
        'children',
        'children.isActive = :isActive',
        { isActive: true },
      )
      .leftJoinAndSelect('cat.parent', 'parent', 'parent.isActive = :isActive', {
        isActive: true,
      })
      .where('cat.isActive = :isActive', { isActive: true });

    if (isUUID(term)) {
      qb.andWhere('cat.id = :id', { id: term });
    } else {
      qb.andWhere('(UPPER(cat.name) = :name OR cat.slug = :slug)', {
        name: term.toUpperCase(),
        slug: term.toLowerCase(),
      });
    }

    const category = await qb.getOne();

    if (!category) {
      throw new NotFoundException(`Category with term "${term}" not found`);
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const { parentId, ...toUpdate } = updateCategoryDto;

    const category = await this.categoryRepository.preload({
      id,
      ...toUpdate,
    });

    if (!category || !category.isActive) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }

    if (parentId !== undefined) {
      if (parentId === null) {
        category.parent = null;
      } else {
        if (parentId === id) {
          throw new BadRequestException('A category cannot be its own parent');
        }
        category.parent = await this.findActiveParent(parentId);
      }
    }

    try {
      return await this.categoryRepository.save(category);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    // Soft-delete: desactivar en lugar de eliminar (puede tener productos asociados)
    category.isActive = false;
    await this.categoryRepository.save(category);
  }

  async deleteAllCategories(): Promise<void> {
    await this.categoryRepository
      .createQueryBuilder('category')
      .delete()
      .where({})
      .execute();
  }

  private async findActiveParent(parentId: string): Promise<Category> {
    const parent = await this.categoryRepository.findOneBy({
      id: parentId,
      isActive: true,
    });
    if (!parent) {
      throw new NotFoundException(
        `Parent category with id "${parentId}" not found`,
      );
    }
    return parent;
  }

  private handleDBExceptions(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
