import { Injectable } from '@nestjs/common';
import { MedusaService } from '../../medusa/medusa.service';
import { MedusaCart, MedusaShippingOption, MedusaOrder } from '../../medusa/types';
import { UpdateShippingAddressDto } from './dto/update-shipping-address.dto';
import { SelectShippingOptionDto } from './dto/select-shipping-option.dto';
import { CompleteCheckoutDto } from './dto/complete-checkout.dto';

interface ShippingOptionsResponse {
  shipping_options: MedusaShippingOption[];
}

interface CartResponse {
  cart: MedusaCart;
}

interface OrderResponse {
  order: MedusaOrder;
  type: string;
}

@Injectable()
export class CheckoutService {
  constructor(private readonly medusaService: MedusaService) {}

  async getShippingOptions(cartId: string) {
    const response = await this.medusaService.storeRequest<ShippingOptionsResponse>(
      `/carts/${cartId}/shipping-options`,
    );

    return {
      shippingOptions: response.shipping_options.map((option) => ({
        id: option.id,
        name: option.name,
        amount: option.amount,
        priceInclTax: option.price_incl_tax,
      })),
    };
  }

  async updateShippingAddress(cartId: string, dto: UpdateShippingAddressDto) {
    const response = await this.medusaService.storeRequest<CartResponse>(`/carts/${cartId}`, {
      method: 'POST',
      body: {
        shipping_address: {
          first_name: dto.firstName,
          last_name: dto.lastName,
          address_1: dto.address1,
          address_2: dto.address2,
          city: dto.city,
          province: dto.province,
          postal_code: dto.postalCode,
          country_code: dto.countryCode,
          phone: dto.phone,
        },
        email: dto.email,
      },
    });

    return { cart: response.cart };
  }

  async selectShippingOption(cartId: string, dto: SelectShippingOptionDto) {
    const response = await this.medusaService.storeRequest<CartResponse>(
      `/carts/${cartId}/shipping-methods`,
      {
        method: 'POST',
        body: {
          option_id: dto.optionId,
        },
      },
    );

    return { cart: response.cart };
  }

  async initializePaymentSessions(cartId: string) {
    const response = await this.medusaService.storeRequest<CartResponse>(
      `/carts/${cartId}/payment-sessions`,
      {
        method: 'POST',
      },
    );

    return {
      cart: response.cart,
      paymentSessions:
        response.cart.payment_sessions?.map((session) => ({
          id: session.id,
          providerId: session.provider_id,
          status: session.status,
        })) || [],
    };
  }

  async completeCheckout(cartId: string, dto: CompleteCheckoutDto) {
    if (dto.paymentProviderId) {
      await this.medusaService.storeRequest<CartResponse>(`/carts/${cartId}/payment-session`, {
        method: 'POST',
        body: {
          provider_id: dto.paymentProviderId,
        },
      });
    }

    const response = await this.medusaService.storeRequest<OrderResponse>(
      `/carts/${cartId}/complete`,
      {
        method: 'POST',
      },
    );

    return {
      type: response.type,
      order: {
        id: response.order.id,
        displayId: response.order.display_id,
        status: response.order.status,
        email: response.order.email,
        total: response.order.total,
        subtotal: response.order.subtotal,
        shippingTotal: response.order.shipping_total,
        taxTotal: response.order.tax_total,
        createdAt: response.order.created_at,
      },
    };
  }
}
