import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCartDto {
  @ApiProperty({ description: 'Region ID for the cart' })
  @IsString()
  regionId: string;

  @ApiPropertyOptional({ description: 'Country code (ISO 2)' })
  @IsOptional()
  @IsString()
  countryCode?: string;
}
