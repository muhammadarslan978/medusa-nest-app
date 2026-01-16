import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  IsObject,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

// ============================================================================
// Store DTOs
// ============================================================================

export class UpdateStoreDto {
  @ApiPropertyOptional({ description: 'Store name', example: 'Rox Store' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Default sales channel ID' })
  @IsOptional()
  @IsString()
  default_sales_channel_id?: string;

  @ApiPropertyOptional({ description: 'Default region ID' })
  @IsOptional()
  @IsString()
  default_region_id?: string;

  @ApiPropertyOptional({ description: 'Default stock location ID' })
  @IsOptional()
  @IsString()
  default_location_id?: string;

  @ApiPropertyOptional({ description: 'Custom metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class AddStoreCurrencyDto {
  @ApiProperty({ description: 'Currency code', example: 'usd' })
  @IsString()
  @IsNotEmpty()
  currency_code: string;

  @ApiPropertyOptional({ description: 'Set as default currency', default: false })
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}

export class CurrencyResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() currency_code: string;
  @ApiProperty() is_default: boolean;
  @ApiPropertyOptional() symbol?: string;
  @ApiPropertyOptional() name?: string;
}

export class StoreResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional() default_sales_channel_id?: string;
  @ApiPropertyOptional() default_region_id?: string;
  @ApiPropertyOptional() default_location_id?: string;
  @ApiPropertyOptional() metadata?: Record<string, unknown>;
  @ApiProperty({ type: [CurrencyResponseDto] }) supported_currencies: CurrencyResponseDto[];
  @ApiProperty() created_at: string;
  @ApiProperty() updated_at: string;
}

// ============================================================================
// Sales Channel DTOs
// ============================================================================

export class CreateSalesChannelDto {
  @ApiProperty({ description: 'Sales channel name', example: 'Web Store' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Sales channel description', example: 'Main web storefront' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Is channel disabled', default: false })
  @IsOptional()
  @IsBoolean()
  is_disabled?: boolean;

  @ApiPropertyOptional({ description: 'Custom metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class UpdateSalesChannelDto {
  @ApiPropertyOptional({ description: 'Sales channel name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Sales channel description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Is channel disabled' })
  @IsOptional()
  @IsBoolean()
  is_disabled?: boolean;

  @ApiPropertyOptional({ description: 'Custom metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class SalesChannelProductsDto {
  @ApiPropertyOptional({ description: 'Product IDs to add', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  add?: string[];

  @ApiPropertyOptional({ description: 'Product IDs to remove', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  remove?: string[];
}

export class SalesChannelResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional() description?: string;
  @ApiProperty() is_disabled: boolean;
  @ApiPropertyOptional() metadata?: Record<string, unknown>;
  @ApiProperty() created_at: string;
  @ApiProperty() updated_at: string;
}

export class SalesChannelListResponseDto {
  @ApiProperty({ type: [SalesChannelResponseDto] }) sales_channels: SalesChannelResponseDto[];
  @ApiProperty() count: number;
  @ApiProperty() offset: number;
  @ApiProperty() limit: number;
}

// ============================================================================
// Region DTOs
// ============================================================================

export class CreateRegionDto {
  @ApiProperty({ description: 'Region name', example: 'Pakistan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Currency code', example: 'pkr' })
  @IsString()
  @IsNotEmpty()
  currency_code: string;

  @ApiPropertyOptional({ description: 'Country codes', type: [String], example: ['pk'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  countries?: string[];

  @ApiPropertyOptional({ description: 'Payment provider IDs', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  payment_providers?: string[];

  @ApiPropertyOptional({ description: 'Automatic tax calculation', default: true })
  @IsOptional()
  @IsBoolean()
  automatic_taxes?: boolean;

  @ApiPropertyOptional({ description: 'Custom metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class UpdateRegionDto {
  @ApiPropertyOptional({ description: 'Region name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Currency code' })
  @IsOptional()
  @IsString()
  currency_code?: string;

  @ApiPropertyOptional({ description: 'Country codes', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  countries?: string[];

  @ApiPropertyOptional({ description: 'Automatic tax calculation' })
  @IsOptional()
  @IsBoolean()
  automatic_taxes?: boolean;

  @ApiPropertyOptional({ description: 'Custom metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class RegionResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() currency_code: string;
  @ApiPropertyOptional() automatic_taxes?: boolean;
  @ApiPropertyOptional({ type: [Object] }) countries?: { iso_2: string; name: string }[];
  @ApiPropertyOptional() metadata?: Record<string, unknown>;
  @ApiProperty() created_at: string;
  @ApiProperty() updated_at: string;
}

export class RegionListResponseDto {
  @ApiProperty({ type: [RegionResponseDto] }) regions: RegionResponseDto[];
  @ApiProperty() count: number;
  @ApiProperty() offset: number;
  @ApiProperty() limit: number;
}

// ============================================================================
// Stock Location DTOs
// ============================================================================

export class StockLocationAddressDto {
  @ApiProperty({ description: 'Address line 1', example: '123 Main Street' })
  @IsString()
  @IsNotEmpty()
  address_1: string;

  @ApiPropertyOptional({ description: 'Address line 2' })
  @IsOptional()
  @IsString()
  address_2?: string;

  @ApiProperty({ description: 'City', example: 'Islamabad' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'Country code (ISO 2)', example: 'pk' })
  @IsString()
  @IsNotEmpty()
  country_code: string;

  @ApiPropertyOptional({ description: 'Province/State', example: 'Capital' })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({ description: 'Postal code', example: '44000' })
  @IsOptional()
  @IsString()
  postal_code?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class CreateStockLocationDto {
  @ApiProperty({ description: 'Location name', example: 'Main Warehouse' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Location address', type: StockLocationAddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => StockLocationAddressDto)
  address?: StockLocationAddressDto;

  @ApiPropertyOptional({ description: 'Custom metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class UpdateStockLocationDto {
  @ApiPropertyOptional({ description: 'Location name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Location address', type: StockLocationAddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => StockLocationAddressDto)
  address?: StockLocationAddressDto;

  @ApiPropertyOptional({ description: 'Custom metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class StockLocationSalesChannelsDto {
  @ApiPropertyOptional({ description: 'Sales channel IDs to add', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  add?: string[];

  @ApiPropertyOptional({ description: 'Sales channel IDs to remove', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  remove?: string[];
}

export class StockLocationResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional() address?: {
    address_1: string;
    address_2?: string;
    city: string;
    country_code: string;
    province?: string;
    postal_code?: string;
    phone?: string;
  };
  @ApiPropertyOptional() metadata?: Record<string, unknown>;
  @ApiProperty() created_at: string;
  @ApiProperty() updated_at: string;
}

export class StockLocationListResponseDto {
  @ApiProperty({ type: [StockLocationResponseDto] }) stock_locations: StockLocationResponseDto[];
  @ApiProperty() count: number;
  @ApiProperty() offset: number;
  @ApiProperty() limit: number;
}

// ============================================================================
// API Key DTOs
// ============================================================================

export class CreateApiKeyDto {
  @ApiProperty({ description: 'API key title', example: 'Mobile App Key' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'API key type',
    enum: ['publishable', 'secret'],
    example: 'publishable',
  })
  @IsString()
  @IsNotEmpty()
  type: 'publishable' | 'secret';
}

export class UpdateApiKeyDto {
  @ApiPropertyOptional({ description: 'API key title' })
  @IsOptional()
  @IsString()
  title?: string;
}

export class ApiKeySalesChannelsDto {
  @ApiPropertyOptional({ description: 'Sales channel IDs to add', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  add?: string[];

  @ApiPropertyOptional({ description: 'Sales channel IDs to remove', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  remove?: string[];
}

export class ApiKeyResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() title: string;
  @ApiProperty() token: string;
  @ApiProperty() redacted: string;
  @ApiProperty() type: string;
  @ApiPropertyOptional() last_used_at?: string;
  @ApiPropertyOptional() revoked_at?: string;
  @ApiPropertyOptional({ type: [Object] }) sales_channels?: { id: string; name: string }[];
  @ApiProperty() created_at: string;
  @ApiProperty() updated_at: string;
}

export class ApiKeyListResponseDto {
  @ApiProperty({ type: [ApiKeyResponseDto] }) api_keys: ApiKeyResponseDto[];
  @ApiProperty() count: number;
  @ApiProperty() offset: number;
  @ApiProperty() limit: number;
}

// ============================================================================
// Currency DTOs
// ============================================================================

export class CurrencyListResponseDto {
  @ApiProperty({ type: [Object] }) currencies: {
    code: string;
    name: string;
    symbol: string;
    symbol_native: string;
    decimal_digits: number;
  }[];
  @ApiProperty() count: number;
  @ApiProperty() offset: number;
  @ApiProperty() limit: number;
}

// ============================================================================
// Query DTOs
// ============================================================================

export class PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Number of items to skip', default: 0 })
  @IsOptional()
  offset?: number;

  @ApiPropertyOptional({ description: 'Number of items to return', default: 20 })
  @IsOptional()
  limit?: number;
}

// ============================================================================
// Delete Response DTO
// ============================================================================

export class DeleteResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() object: string;
  @ApiProperty() deleted: boolean;
}
