import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsBoolean,
  ValidateNested,
  IsEnum,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductVariantPriceDto {
  @ApiProperty({ description: 'Currency code (e.g., usd, eur)', example: 'usd' })
  @IsString()
  currency_code: string;

  @ApiProperty({ description: 'Price amount in cents', example: 1999 })
  @IsNumber()
  @Min(0)
  amount: number;
}

export class CreateProductVariantDto {
  @ApiProperty({ description: 'Variant title', example: 'Small / Black' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'SKU', example: 'SHIRT-SM-BLK' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ description: 'Inventory quantity', example: 100 })
  @IsOptional()
  @IsNumber()
  inventory_quantity?: number;

  @ApiPropertyOptional({ description: 'Allow backorders', default: false })
  @IsOptional()
  @IsBoolean()
  allow_backorder?: boolean;

  @ApiPropertyOptional({ description: 'Manage inventory', default: true })
  @IsOptional()
  @IsBoolean()
  manage_inventory?: boolean;

  @ApiProperty({ description: 'Variant prices', type: [CreateProductVariantPriceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantPriceDto)
  prices: CreateProductVariantPriceDto[];

  @ApiPropertyOptional({
    description: 'Option values for this variant',
    example: { Size: 'Small', Color: 'Black' },
  })
  @IsOptional()
  options?: Record<string, string>;
}

export class CreateProductOptionDto {
  @ApiProperty({ description: 'Option title', example: 'Size' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Option values', example: ['Small', 'Medium', 'Large'] })
  @IsArray()
  @IsString({ each: true })
  values: string[];
}

export enum ProductStatus {
  DRAFT = 'draft',
  PROPOSED = 'proposed',
  PUBLISHED = 'published',
  REJECTED = 'rejected',
}

export class CreateProductDto {
  @ApiProperty({ description: 'Product title', example: 'Premium T-Shirt' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Product subtitle', example: 'Comfortable cotton tee' })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'A high-quality cotton t-shirt...',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'URL-friendly handle/slug', example: 'premium-t-shirt' })
  @IsOptional()
  @IsString()
  handle?: string;

  @ApiPropertyOptional({ description: 'Is this a gift card', default: false })
  @IsOptional()
  @IsBoolean()
  is_giftcard?: boolean;

  @ApiPropertyOptional({
    description: 'Product status',
    enum: ProductStatus,
    default: ProductStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({ description: 'Thumbnail URL', example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({ description: 'Image URLs', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ description: 'Collection ID to add product to' })
  @IsOptional()
  @IsString()
  collection_id?: string;

  @ApiPropertyOptional({ description: 'Category IDs', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiPropertyOptional({ description: 'Product options', type: [CreateProductOptionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductOptionDto)
  options?: CreateProductOptionDto[];

  @ApiPropertyOptional({ description: 'Product variants', type: [CreateProductVariantDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants?: CreateProductVariantDto[];

  @ApiPropertyOptional({ description: 'Custom metadata' })
  @IsOptional()
  metadata?: Record<string, unknown>;
}
