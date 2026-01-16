import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsObject, MinLength, MaxLength } from 'class-validator';

/**
 * DTO for creating a product category
 */
export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Electronics',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'URL-friendly handle (auto-generated if not provided)',
    example: 'electronics',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  handle?: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Electronic devices and accessories',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Whether the category is active and visible',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({
    description: 'Whether the category is internal (hidden from storefront)',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  is_internal?: boolean;

  @ApiPropertyOptional({
    description: 'Parent category ID for nested categories',
    example: 'pcat_01ABC123...',
  })
  @IsOptional()
  @IsString()
  parent_category_id?: string;

  @ApiPropertyOptional({
    description: 'Custom metadata key-value pairs',
    example: { icon: 'laptop', color: '#3498db' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

/**
 * DTO for updating a product category
 */
export class UpdateCategoryDto {
  @ApiPropertyOptional({
    description: 'Category name',
    example: 'Electronics & Gadgets',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    description: 'URL-friendly handle',
    example: 'electronics-gadgets',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  handle?: string;

  @ApiPropertyOptional({
    description: 'Category description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Whether the category is active',
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({
    description: 'Whether the category is internal',
  })
  @IsOptional()
  @IsBoolean()
  is_internal?: boolean;

  @ApiPropertyOptional({
    description: 'Parent category ID',
  })
  @IsOptional()
  @IsString()
  parent_category_id?: string;

  @ApiPropertyOptional({
    description: 'Display rank/order',
  })
  @IsOptional()
  rank?: number;

  @ApiPropertyOptional({
    description: 'Custom metadata',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

/**
 * Parent category reference
 */
export class ParentCategoryDto {
  @ApiProperty({ example: 'pcat_01ABC123...' })
  id: string;

  @ApiProperty({ example: 'Electronics' })
  name: string;

  @ApiProperty({ example: 'electronics' })
  handle: string;
}

/**
 * Child category reference
 */
export class ChildCategoryDto {
  @ApiProperty({ example: 'pcat_01DEF456...' })
  id: string;

  @ApiProperty({ example: 'Smartphones' })
  name: string;

  @ApiProperty({ example: 'smartphones' })
  handle: string;

  @ApiProperty({ example: true })
  is_active: boolean;
}

/**
 * Category response DTO
 */
export class CategoryResponseDto {
  @ApiProperty({ example: 'pcat_01ABC123...' })
  id: string;

  @ApiProperty({ example: 'Electronics' })
  name: string;

  @ApiProperty({ example: 'electronics' })
  handle: string;

  @ApiPropertyOptional({ example: 'Electronic devices and accessories' })
  description?: string;

  @ApiProperty({ example: true })
  is_active: boolean;

  @ApiProperty({ example: false })
  is_internal: boolean;

  @ApiProperty({ example: 0 })
  rank: number;

  @ApiPropertyOptional({ example: 'pcat_01XYZ...' })
  parent_category_id?: string;

  @ApiPropertyOptional({ type: ParentCategoryDto })
  parent_category?: ParentCategoryDto;

  @ApiProperty({ type: [ChildCategoryDto] })
  category_children: ChildCategoryDto[];

  @ApiPropertyOptional()
  metadata?: Record<string, unknown>;

  @ApiProperty({ example: '2026-01-16T05:00:00.000Z' })
  created_at: string;

  @ApiProperty({ example: '2026-01-16T05:00:00.000Z' })
  updated_at: string;
}

/**
 * Single category API response wrapper
 */
export class CategoryApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: CategoryResponseDto })
  data: CategoryResponseDto;

  @ApiProperty({ example: '2026-01-16T05:00:00.000Z' })
  timestamp: string;
}

/**
 * Category list API response wrapper
 */
export class CategoryListApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({
    type: 'object',
    properties: {
      categories: { type: 'array', items: { $ref: '#/components/schemas/CategoryResponseDto' } },
      count: { type: 'number', example: 10 },
      offset: { type: 'number', example: 0 },
      limit: { type: 'number', example: 50 },
    },
  })
  data: {
    categories: CategoryResponseDto[];
    count: number;
    offset: number;
    limit: number;
  };

  @ApiProperty({ example: '2026-01-16T05:00:00.000Z' })
  timestamp: string;
}

/**
 * Category delete response
 */
export class CategoryDeleteResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'string', example: 'pcat_01ABC123...' },
      deleted: { type: 'boolean', example: true },
    },
  })
  data: {
    id: string;
    deleted: boolean;
  };

  @ApiProperty({ example: '2026-01-16T05:00:00.000Z' })
  timestamp: string;
}

/**
 * Query parameters for listing categories
 */
export class ListCategoriesQueryDto {
  @ApiPropertyOptional({
    description: 'Number of items to skip',
    default: 0,
  })
  @IsOptional()
  offset?: number;

  @ApiPropertyOptional({
    description: 'Number of items to return',
    default: 50,
  })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Search query for category name',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description: 'Filter by parent category ID',
  })
  @IsOptional()
  @IsString()
  parent_category_id?: string;

  @ApiPropertyOptional({
    description: 'Include only root categories (no parent)',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  include_descendants_tree?: boolean;
}
