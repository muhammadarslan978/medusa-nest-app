import { Controller, Get, Post, Put, Delete, Param, Query, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { GetProductsDto } from './dto/get-products.dto';
import { ProductResponseDto, ProductsListResponseDto } from './dto/product-response.dto';
import { CreateProductDto } from './dto/create-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products (Store API - requires sales channel link)' })
  @ApiResponse({
    status: 200,
    description: 'List of products retrieved successfully',
    type: ProductsListResponseDto,
  })
  async getProducts(@Query() query: GetProductsDto): Promise<ProductsListResponseDto> {
    return this.productsService.getProducts(query);
  }

  @Get('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all products (Admin API - returns all products)' })
  @ApiResponse({
    status: 200,
    description: 'List of all products retrieved successfully',
    type: ProductsListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Admin token required' })
  async getAdminProducts(
    @Query() query: GetProductsDto,
    @Headers('authorization') authHeader: string,
  ): Promise<ProductsListResponseDto> {
    return this.productsService.getAdminProducts(query, authHeader);
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

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Admin token required' })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Headers('authorization') authHeader: string,
  ): Promise<ProductResponseDto> {
    return this.productsService.createProduct(createProductDto, authHeader);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product (Admin only)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Admin token required' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: CreateProductDto,
    @Headers('authorization') authHeader: string,
  ): Promise<ProductResponseDto> {
    return this.productsService.updateProduct(id, updateProductDto, authHeader);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product (Admin only)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Admin token required' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async deleteProduct(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ): Promise<{ id: string; deleted: boolean }> {
    return this.productsService.deleteProduct(id, authHeader);
  }

  @Put(':id/categories')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product categories (Admin only)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product categories updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Admin token required' })
  async updateProductCategories(
    @Param('id') id: string,
    @Body() body: { category_ids: string[] },
    @Headers('authorization') authHeader: string,
  ): Promise<ProductResponseDto> {
    return this.productsService.updateProductCategories(id, body.category_ids, authHeader);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get products by category' })
  @ApiParam({ name: 'categoryId', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type: ProductsListResponseDto,
  })
  async getProductsByCategory(
    @Param('categoryId') categoryId: string,
    @Query() query: GetProductsDto,
  ): Promise<ProductsListResponseDto> {
    return this.productsService.getProductsByCategory(categoryId, query);
  }

  @Get('collection/:collectionId')
  @ApiOperation({ summary: 'Get products by collection' })
  @ApiParam({ name: 'collectionId', description: 'Collection ID' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type: ProductsListResponseDto,
  })
  async getProductsByCollection(
    @Param('collectionId') collectionId: string,
    @Query() query: GetProductsDto,
  ): Promise<ProductsListResponseDto> {
    return this.productsService.getProductsByCollection(collectionId, query);
  }
}
