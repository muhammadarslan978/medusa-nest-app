import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SelectShippingOptionDto {
  @ApiProperty({ description: 'Shipping option ID' })
  @IsString()
  optionId: string;
}
