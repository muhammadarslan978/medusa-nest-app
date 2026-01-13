import { Controller, Get, Param, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get customer orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  async getOrders(@Headers('authorization') authHeader: string) {
    return this.ordersService.getOrders(authHeader);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrder(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ) {
    return this.ordersService.getOrder(id, authHeader);
  }

  @Get('confirmation/:id')
  @ApiOperation({ summary: 'Get order confirmation (no auth required)' })
  @ApiResponse({ status: 200, description: 'Order confirmation retrieved' })
  async getOrderConfirmation(@Param('id') id: string) {
    return this.ordersService.getOrderConfirmation(id);
  }
}
