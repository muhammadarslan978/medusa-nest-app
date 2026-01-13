import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CompleteCheckoutDto {
  @ApiPropertyOptional({ description: 'Payment provider ID to use' })
  @IsOptional()
  @IsString()
  paymentProviderId?: string;
}
