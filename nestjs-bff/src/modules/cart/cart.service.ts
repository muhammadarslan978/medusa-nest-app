import { Injectable, NotFoundException } from '@nestjs/common';
import { MedusaService } from '../../medusa/medusa.service';
import { MedusaCart } from '../../medusa/types';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddLineItemDto } from './dto/add-line-item.dto';
import { UpdateLineItemDto } from './dto/update-line-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';

interface CartResponse {
  cart: MedusaCart;
}

@Injectable()
export class CartService {
  constructor(private readonly medusaService: MedusaService) {}

  async createCart(createCartDto: CreateCartDto): Promise<CartResponseDto> {
    const body: any = {
      region_id: createCartDto.regionId,
    };

    // Only add country_code if provided
    if (createCartDto.countryCode) {
      body.country_code = createCartDto.countryCode;
    }

    // Add sales_channel_id if provided, otherwise use default
    if (createCartDto.salesChannelId) {
      body.sales_channel_id = createCartDto.salesChannelId;
    }

    const response = await this.medusaService.storeRequest<CartResponse>('/carts', {
      method: 'POST',
      body,
    });

    return { cart: this.transformCart(response.cart) };
  }

  async getCart(cartId: string): Promise<CartResponseDto> {
    try {
      const response = await this.medusaService.storeRequest<CartResponse>(`/carts/${cartId}`);
      return { cart: this.transformCart(response.cart) };
    } catch (error) {
      if ((error as { status?: number }).status === 404) {
        throw new NotFoundException(`Cart with ID ${cartId} not found`);
      }
      throw error;
    }
  }

  async addLineItem(cartId: string, addLineItemDto: AddLineItemDto): Promise<CartResponseDto> {
    const response = await this.medusaService.storeRequest<CartResponse>(
      `/carts/${cartId}/line-items`,
      {
        method: 'POST',
        body: {
          variant_id: addLineItemDto.variantId,
          quantity: addLineItemDto.quantity,
        },
      },
    );

    return { cart: this.transformCart(response.cart) };
  }

  async updateLineItem(
    cartId: string,
    lineItemId: string,
    updateLineItemDto: UpdateLineItemDto,
  ): Promise<CartResponseDto> {
    const response = await this.medusaService.storeRequest<CartResponse>(
      `/carts/${cartId}/line-items/${lineItemId}`,
      {
        method: 'POST',
        body: {
          quantity: updateLineItemDto.quantity,
        },
      },
    );

    return { cart: this.transformCart(response.cart) };
  }

  async removeLineItem(cartId: string, lineItemId: string): Promise<CartResponseDto> {
    const response = await this.medusaService.storeRequest<CartResponse>(
      `/carts/${cartId}/line-items/${lineItemId}`,
      {
        method: 'DELETE',
      },
    );

    return { cart: this.transformCart(response.cart) };
  }

  private transformCart(cart: MedusaCart) {
    return {
      id: cart.id,
      email: cart.email,
      items:
        cart.items?.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          thumbnail: item.thumbnail,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          subtotal: item.subtotal,
          total: item.total,
          variantId: item.variant_id,
          productId: item.product_id,
        })) || [],
      regionId: cart.region_id,
      subtotal: cart.subtotal,
      discountTotal: cart.discount_total,
      shippingTotal: cart.shipping_total,
      taxTotal: cart.tax_total,
      total: cart.total,
      createdAt: cart.created_at,
      updatedAt: cart.updated_at,
    };
  }
}
