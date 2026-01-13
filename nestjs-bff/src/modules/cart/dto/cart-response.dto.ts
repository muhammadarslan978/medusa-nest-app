import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CartLineItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description: string | null;

  @ApiPropertyOptional()
  thumbnail: string | null;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  variantId: string;

  @ApiProperty()
  productId: string;
}

export class CartDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  email: string | null;

  @ApiProperty({ type: [CartLineItemDto] })
  items: CartLineItemDto[];

  @ApiProperty()
  regionId: string;

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  discountTotal: number;

  @ApiProperty()
  shippingTotal: number;

  @ApiProperty()
  taxTotal: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class CartResponseDto {
  @ApiProperty({ type: CartDto })
  cart: CartDto;
}
