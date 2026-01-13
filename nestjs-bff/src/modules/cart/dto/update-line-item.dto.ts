import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLineItemDto {
  @ApiProperty({ description: 'New quantity for the line item', minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}
