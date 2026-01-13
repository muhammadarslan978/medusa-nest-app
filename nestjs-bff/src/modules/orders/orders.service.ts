import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { MedusaService } from '../../medusa/medusa.service';
import { MedusaOrder } from '../../medusa/types';

interface OrdersResponse {
  orders: MedusaOrder[];
  count: number;
  offset: number;
  limit: number;
}

interface OrderResponse {
  order: MedusaOrder;
}

@Injectable()
export class OrdersService {
  constructor(private readonly medusaService: MedusaService) {}

  async getOrders(authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    const response = await this.medusaService.storeRequest<OrdersResponse>(
      '/customers/me/orders',
      {
        headers: {
          Authorization: authHeader,
        },
      },
    );

    return {
      orders: response.orders.map(this.transformOrder),
      count: response.count,
      offset: response.offset,
      limit: response.limit,
    };
  }

  async getOrder(id: string, authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    try {
      const response = await this.medusaService.storeRequest<OrderResponse>(
        `/orders/${id}`,
        {
          headers: {
            Authorization: authHeader,
          },
        },
      );

      return { order: this.transformOrder(response.order) };
    } catch (error) {
      if ((error as { status?: number }).status === 404) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      throw error;
    }
  }

  async getOrderConfirmation(id: string) {
    try {
      const response = await this.medusaService.storeRequest<OrderResponse>(
        `/orders/${id}`,
      );

      return { order: this.transformOrder(response.order) };
    } catch (error) {
      if ((error as { status?: number }).status === 404) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      throw error;
    }
  }

  private transformOrder(order: MedusaOrder) {
    return {
      id: order.id,
      displayId: order.display_id,
      status: order.status,
      fulfillmentStatus: order.fulfillment_status,
      paymentStatus: order.payment_status,
      email: order.email,
      items: order.items?.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        thumbnail: item.thumbnail,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        total: item.total,
      })) || [],
      shippingAddress: order.shipping_address
        ? {
            firstName: order.shipping_address.first_name,
            lastName: order.shipping_address.last_name,
            address1: order.shipping_address.address_1,
            city: order.shipping_address.city,
            postalCode: order.shipping_address.postal_code,
            countryCode: order.shipping_address.country_code,
          }
        : null,
      subtotal: order.subtotal,
      shippingTotal: order.shipping_total,
      taxTotal: order.tax_total,
      total: order.total,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    };
  }
}
