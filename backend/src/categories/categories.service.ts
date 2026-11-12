import {
  BadRequestException,
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
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const { parentId, ...categoryData } = createCategoryDto;

      const category = this.categoryRepository.create(categoryData);

      if (parentId) {
        const parent = await this.categoryRepository.findOneBy({
          id: parentId,
        });
        if (!parent) {
          throw new NotFoundException(
            `Parent category with id "${parentId}" not found`,
          );
        }
        category.parent = parent;
      }

      return await this.categoryRepository.save(category);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(): Promise<Category[]> {
    // Retorna categorías raíz (sin padre) con sus subcategorías anidadas
    return this.categoryRepository.find({
      where: { isActive: true },
      relations: { children: true, parent: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(term: string): Promise<Category> {
    let category: Category | null;

    if (isUUID(term)) {
      category = await this.categoryRepository.findOne({
        where: { id: term },
        relations: { children: true, parent: true },
      });
    } else {
      category = await this.categoryRepository
        .createQueryBuilder('cat')
        .leftJoinAndSelect('cat.children', 'children')
        .leftJoinAndSelect('cat.parent', 'parent')
        .where('UPPER(cat.name) = :name OR cat.slug = :slug', {
          name: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .getOne();
    }

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

    if (!category) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }

    if (parentId !== undefined) {
      if (!parentId) {
        category.parent = undefined;
      } else {
        const parent = await this.categoryRepository.findOneBy({
          id: parentId,
        });
        if (!parent) {
          throw new NotFoundException(
            `Parent category with id "${parentId}" not found`,
          );
        }
        category.parent = parent;
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

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}

