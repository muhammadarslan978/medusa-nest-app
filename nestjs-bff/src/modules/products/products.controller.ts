import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { GetProductsDto } from './dto/get-products.dto';
import { ProductResponseDto, ProductsListResponseDto } from './dto/product-response.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'List of products retrieved successfully',
    type: ProductsListResponseDto,
  })
  async getProducts(@Query() query: GetProductsDto): Promise<ProductsListResponseDto> {
    return this.productsService.getProducts(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProduct(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productsService.getProduct(id);
  }

  @Get('handle/:handle')
  @ApiOperation({ summary: 'Get a product by handle' })
  @ApiParam({ name: 'handle', description: 'Product handle (slug)' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProductByHandle(@Param('handle') handle: string): Promise<ProductResponseDto> {
    return this.productsService.getProductByHandle(handle);
  }
}
