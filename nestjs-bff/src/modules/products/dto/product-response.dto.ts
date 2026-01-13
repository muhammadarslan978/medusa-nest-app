import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductImageDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  url: string;
}

export class ProductOptionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ type: [String] })
  values: string[];
}

export class ProductPriceDto {
  @ApiProperty()
  currencyCode: string;

  @ApiProperty()
  amount: number;
}

export class ProductVariantDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  sku: string | null;

  @ApiProperty()
  inventoryQuantity: number;

  @ApiProperty({ type: [ProductPriceDto] })
  prices: ProductPriceDto[];
}

export class ProductCollectionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  handle: string;
}

export class ProductCategoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  handle: string;
}

export class ProductDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  subtitle: string | null;

  @ApiPropertyOptional()
  description: string | null;

  @ApiProperty()
  handle: string;

  @ApiPropertyOptional()
  thumbnail: string | null;

  @ApiProperty({ type: [ProductImageDto] })
  images: ProductImageDto[];

  @ApiProperty({ type: [ProductOptionDto] })
  options: ProductOptionDto[];

  @ApiProperty({ type: [ProductVariantDto] })
  variants: ProductVariantDto[];

  @ApiPropertyOptional({ type: ProductCollectionDto })
  collection: ProductCollectionDto | null;

  @ApiProperty({ type: [ProductCategoryDto] })
  categories: ProductCategoryDto[];

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class ProductResponseDto {
  @ApiProperty({ type: ProductDto })
  product: ProductDto;
}

export class ProductsListResponseDto {
  @ApiProperty({ type: [ProductDto] })
  products: ProductDto[];

  @ApiProperty()
  count: number;

  @ApiProperty()
  offset: number;

  @ApiProperty()
  limit: number;
}
