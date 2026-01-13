import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CheckoutService } from './checkout.service';
import { UpdateShippingAddressDto } from './dto/update-shipping-address.dto';
import { SelectShippingOptionDto } from './dto/select-shipping-option.dto';
import { CompleteCheckoutDto } from './dto/complete-checkout.dto';

@ApiTags('checkout')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Get(':cartId/shipping-options')
  @ApiOperation({ summary: 'Get available shipping options for cart' })
  @ApiResponse({ status: 200, description: 'Shipping options retrieved' })
  async getShippingOptions(@Param('cartId') cartId: string) {
    return this.checkoutService.getShippingOptions(cartId);
  }

  @Post(':cartId/shipping-address')
  @ApiOperation({ summary: 'Update shipping address for cart' })
  @ApiResponse({ status: 200, description: 'Shipping address updated' })
  async updateShippingAddress(
    @Param('cartId') cartId: string,
    @Body() dto: UpdateShippingAddressDto,
  ) {
    return this.checkoutService.updateShippingAddress(cartId, dto);
  }

  @Post(':cartId/shipping-option')
  @ApiOperation({ summary: 'Select shipping option for cart' })
  @ApiResponse({ status: 200, description: 'Shipping option selected' })
  async selectShippingOption(
    @Param('cartId') cartId: string,
    @Body() dto: SelectShippingOptionDto,
  ) {
    return this.checkoutService.selectShippingOption(cartId, dto);
  }

  @Post(':cartId/payment-sessions')
  @ApiOperation({ summary: 'Initialize payment sessions for cart' })
  @ApiResponse({ status: 200, description: 'Payment sessions initialized' })
  async initializePaymentSessions(@Param('cartId') cartId: string) {
    return this.checkoutService.initializePaymentSessions(cartId);
  }

  @Post(':cartId/complete')
  @ApiOperation({ summary: 'Complete checkout and create order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  async completeCheckout(
    @Param('cartId') cartId: string,
    @Body() dto: CompleteCheckoutDto,
  ) {
    return this.checkoutService.completeCheckout(cartId, dto);
  }
}
