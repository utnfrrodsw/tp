import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name (unique)',
    example: 'Herramientas',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    description: 'Category slug for SEO (auto-generated if omitted)',
    example: 'herramientas',
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Martillos, destornilladores, llaves y más.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Whether the category is active',
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'Parent category UUID if this is a subcategory',
    example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  parentId?: string;
}

