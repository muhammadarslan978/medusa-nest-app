import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, MinLength, MaxLength, IsArray } from 'class-validator';

/**
 * DTO for creating a product collection
 */
export class CreateCollectionDto {
  @ApiProperty({
    description: 'Collection title',
    example: 'Summer Sale 2026',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    description: 'URL-friendly handle (auto-generated if not provided)',
    example: 'summer-sale-2026',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  handle?: string;

  @ApiPropertyOptional({
    description: 'Custom metadata key-value pairs',
    example: { featured: true, banner_url: 'https://example.com/banner.jpg' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

/**
 * DTO for updating a product collection
 */
export class UpdateCollectionDto {
  @ApiPropertyOptional({
    description: 'Collection title',
    example: 'Summer Sale 2026 - Extended',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    description: 'URL-friendly handle',
    example: 'summer-sale-2026-extended',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  handle?: string;

  @ApiPropertyOptional({
    description: 'Custom metadata',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

/**
 * DTO for adding/removing products from collection
 */
export class UpdateCollectionProductsDto {
  @ApiPropertyOptional({
    description: 'Product IDs to add to collection',
    example: ['prod_01ABC...', 'prod_01DEF...'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  add?: string[];

  @ApiPropertyOptional({
    description: 'Product IDs to remove from collection',
    example: ['prod_01XYZ...'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  remove?: string[];
}

/**
 * Collection response DTO
 */
export class CollectionResponseDto {
  @ApiProperty({ example: 'pcol_01ABC123...' })
  id: string;

  @ApiProperty({ example: 'Summer Sale 2026' })
  title: string;

  @ApiProperty({ example: 'summer-sale-2026' })
  handle: string;

  @ApiPropertyOptional()
  metadata?: Record<string, unknown>;

  @ApiProperty({ example: '2026-01-16T05:00:00.000Z' })
  created_at: string;

  @ApiProperty({ example: '2026-01-16T05:00:00.000Z' })
  updated_at: string;
}

/**
 * Single collection API response wrapper
 */
export class CollectionApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: CollectionResponseDto })
  data: CollectionResponseDto;

  @ApiProperty({ example: '2026-01-16T05:00:00.000Z' })
  timestamp: string;
}

/**
 * Collection list API response wrapper
 */
export class CollectionListApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({
    type: 'object',
    properties: {
      collections: { type: 'array', items: { $ref: '#/components/schemas/CollectionResponseDto' } },
      count: { type: 'number', example: 10 },
      offset: { type: 'number', example: 0 },
      limit: { type: 'number', example: 10 },
    },
  })
  data: {
    collections: CollectionResponseDto[];
    count: number;
    offset: number;
    limit: number;
  };

  @ApiProperty({ example: '2026-01-16T05:00:00.000Z' })
  timestamp: string;
}

/**
 * Collection delete response
 */
export class CollectionDeleteResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'string', example: 'pcol_01ABC123...' },
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
 * Query parameters for listing collections
 */
export class ListCollectionsQueryDto {
  @ApiPropertyOptional({
    description: 'Number of items to skip',
    default: 0,
  })
  @IsOptional()
  offset?: number;

  @ApiPropertyOptional({
    description: 'Number of items to return',
    default: 10,
  })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Search query for collection title',
  })
  @IsOptional()
  @IsString()
  q?: string;
}
