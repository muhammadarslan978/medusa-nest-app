import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';

/**
 * DTO for setting inventory level at a location
 */
export class SetInventoryLevelDto {
  @ApiProperty({
    description: 'Stock location ID',
    example: 'sloc_01ABC123...',
  })
  @IsString()
  location_id: string;

  @ApiProperty({
    description: 'Stocked quantity at this location',
    example: 100,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  stocked_quantity: number;

  @ApiPropertyOptional({
    description: 'Incoming quantity (expected to arrive)',
    example: 50,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  incoming_quantity?: number;
}

/**
 * DTO for updating inventory level
 */
export class UpdateInventoryLevelDto {
  @ApiPropertyOptional({
    description: 'Stocked quantity',
    example: 150,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stocked_quantity?: number;

  @ApiPropertyOptional({
    description: 'Incoming quantity',
    example: 25,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  incoming_quantity?: number;
}

/**
 * DTO for updating inventory item details
 */
export class UpdateInventoryItemDto {
  @ApiPropertyOptional({
    description: 'SKU',
    example: 'PROD-001-SM',
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({
    description: 'Title',
    example: 'Small / Black',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Thumbnail URL',
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({
    description: 'HS Code for customs',
  })
  @IsOptional()
  @IsString()
  hs_code?: string;

  @ApiPropertyOptional({
    description: 'Country of origin (ISO 2 code)',
    example: 'pk',
  })
  @IsOptional()
  @IsString()
  origin_country?: string;

  @ApiPropertyOptional({
    description: 'MID Code',
  })
  @IsOptional()
  @IsString()
  mid_code?: string;

  @ApiPropertyOptional({
    description: 'Material',
    example: 'Cotton',
  })
  @IsOptional()
  @IsString()
  material?: string;

  @ApiPropertyOptional({
    description: 'Weight in grams',
  })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({
    description: 'Length in cm',
  })
  @IsOptional()
  @IsNumber()
  length?: number;

  @ApiPropertyOptional({
    description: 'Height in cm',
  })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiPropertyOptional({
    description: 'Width in cm',
  })
  @IsOptional()
  @IsNumber()
  width?: number;

  @ApiPropertyOptional({
    description: 'Requires shipping',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  requires_shipping?: boolean;
}

/**
 * Location level response
 */
export class LocationLevelDto {
  @ApiProperty({ example: 'ilev_01ABC123...' })
  id: string;

  @ApiProperty({ example: 'sloc_01XYZ...' })
  location_id: string;

  @ApiProperty({ example: 100 })
  stocked_quantity: number;

  @ApiProperty({ example: 0 })
  reserved_quantity: number;

  @ApiProperty({ example: 100 })
  available_quantity: number;

  @ApiProperty({ example: 0 })
  incoming_quantity: number;

  @ApiPropertyOptional()
  metadata?: Record<string, unknown>;
}

/**
 * Inventory item response DTO
 */
export class InventoryItemResponseDto {
  @ApiProperty({ example: 'iitem_01ABC123...' })
  id: string;

  @ApiPropertyOptional({ example: 'PROD-001-SM' })
  sku?: string;

  @ApiProperty({ example: 'Small / Black' })
  title: string;

  @ApiPropertyOptional({ example: 'Product variant description' })
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/thumb.jpg' })
  thumbnail?: string;

  @ApiPropertyOptional({ example: 'pk' })
  origin_country?: string;

  @ApiPropertyOptional({ example: '6109.10' })
  hs_code?: string;

  @ApiProperty({ example: true })
  requires_shipping: boolean;

  @ApiPropertyOptional({ example: 'Cotton' })
  material?: string;

  @ApiPropertyOptional({ example: 200 })
  weight?: number;

  @ApiPropertyOptional({ example: 30 })
  length?: number;

  @ApiPropertyOptional({ example: 5 })
  height?: number;

  @ApiPropertyOptional({ example: 20 })
  width?: number;

  @ApiProperty({ example: 0 })
  reserved_quantity: number;

  @ApiProperty({ example: 100 })
  stocked_quantity: number;

  @ApiProperty({ type: [LocationLevelDto] })
  location_levels: LocationLevelDto[];

  @ApiProperty({ example: '2026-01-16T05:00:00.000Z' })
  created_at: string;

  @ApiProperty({ example: '2026-01-16T05:00:00.000Z' })
  updated_at: string;
}

/**
 * Single inventory item API response wrapper
 */
export class InventoryItemApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: InventoryItemResponseDto })
  data: InventoryItemResponseDto;

  @ApiProperty({ example: '2026-01-16T05:00:00.000Z' })
  timestamp: string;
}

/**
 * Inventory item list API response wrapper
 */
export class InventoryItemListApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({
    type: 'object',
    properties: {
      inventory_items: {
        type: 'array',
        items: { $ref: '#/components/schemas/InventoryItemResponseDto' },
      },
      count: { type: 'number', example: 10 },
      offset: { type: 'number', example: 0 },
      limit: { type: 'number', example: 20 },
    },
  })
  data: {
    inventory_items: InventoryItemResponseDto[];
    count: number;
    offset: number;
    limit: number;
  };

  @ApiProperty({ example: '2026-01-16T05:00:00.000Z' })
  timestamp: string;
}

/**
 * Query parameters for listing inventory items
 */
export class ListInventoryItemsQueryDto {
  @ApiPropertyOptional({
    description: 'Number of items to skip',
    default: 0,
  })
  @IsOptional()
  offset?: number;

  @ApiPropertyOptional({
    description: 'Number of items to return',
    default: 20,
  })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Filter by SKU',
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({
    description: 'Filter by location ID',
  })
  @IsOptional()
  @IsString()
  location_id?: string;

  @ApiPropertyOptional({
    description: 'Search query',
  })
  @IsOptional()
  @IsString()
  q?: string;
}
