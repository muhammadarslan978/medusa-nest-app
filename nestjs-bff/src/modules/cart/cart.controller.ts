import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddLineItemDto } from './dto/add-line-item.dto';
import { UpdateLineItemDto } from './dto/update-line-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cart' })
  @ApiResponse({
    status: 201,
    description: 'Cart created successfully',
    type: CartResponseDto,
  })
  async createCart(@Body() createCartDto: CreateCartDto): Promise<CartResponseDto> {
    return this.cartService.createCart(createCartDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cart by ID' })
  @ApiHeader({ name: 'x-cart-id', description: 'Cart ID', required: false })
  @ApiResponse({
    status: 200,
    description: 'Cart retrieved successfully',
    type: CartResponseDto,
  })
  async getCart(@Param('id') id: string): Promise<CartResponseDto> {
    return this.cartService.getCart(id);
  }

  @Post(':id/line-items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({
    status: 201,
    description: 'Item added to cart successfully',
    type: CartResponseDto,
  })
  async addLineItem(
    @Param('id') cartId: string,
    @Body() addLineItemDto: AddLineItemDto,
  ): Promise<CartResponseDto> {
    return this.cartService.addLineItem(cartId, addLineItemDto);
  }

  @Put(':id/line-items/:lineItemId')
  @ApiOperation({ summary: 'Update cart line item quantity' })
  @ApiResponse({
    status: 200,
    description: 'Line item updated successfully',
    type: CartResponseDto,
  })
  async updateLineItem(
    @Param('id') cartId: string,
    @Param('lineItemId') lineItemId: string,
    @Body() updateLineItemDto: UpdateLineItemDto,
  ): Promise<CartResponseDto> {
    return this.cartService.updateLineItem(cartId, lineItemId, updateLineItemDto);
  }

  @Delete(':id/line-items/:lineItemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({
    status: 200,
    description: 'Item removed from cart successfully',
    type: CartResponseDto,
  })
  async removeLineItem(
    @Param('id') cartId: string,
    @Param('lineItemId') lineItemId: string,
  ): Promise<CartResponseDto> {
    return this.cartService.removeLineItem(cartId, lineItemId);
  }
}
