import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  // TODO: Proteger con @Auth(ValidRoles.admin) al incorporar AuthModule
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiResponse({ status: 201, description: 'Categoría creada', type: Category })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las categorías activas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías',
    type: [Category],
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':term')
  @ApiOperation({ summary: 'Obtener una categoría por ID, nombre o slug' })
  @ApiResponse({
    status: 200,
    description: 'Categoría encontrada',
    type: Category,
  })
  @ApiResponse({ status: 404, description: 'Not found' })
  findOne(@Param('term') term: string) {
    return this.categoriesService.findOne(term);
  }

  @Patch(':id')
  // TODO: Proteger con @Auth(ValidRoles.admin) al incorporar AuthModule
  @ApiOperation({ summary: 'Actualizar una categoría' })
  @ApiResponse({
    status: 200,
    description: 'Categoría actualizada',
    type: Category,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  // TODO: Proteger con @Auth(ValidRoles.admin) al incorporar AuthModule
  @ApiOperation({ summary: 'Desactivar una categoría (soft-delete)' })
  @ApiResponse({ status: 200, description: 'Categoría desactivada' })
  @ApiResponse({ status: 404, description: 'Not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id);
  }
}

